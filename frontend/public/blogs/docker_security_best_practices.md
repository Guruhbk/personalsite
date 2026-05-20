---
title:  Docker Security Best Practices 
date: May 19, 2026
author: Guru Prasanth E
category: Docker
tags: [Docker,  DevOps]
excerpt: Learn essential Docker security best practices including running containers as non-root users, minimizing privileges, protecting the Docker socket, using distroless images, and reducing container attack surface with real-world examples.
image: https://containertech.com/wp-content/uploads/2023/10/shipping-container-locks-scaled.jpg
---

> Learn essential Docker security best practices including running containers as non-root users, minimizing privileges, protecting the Docker socket, using distroless images, and reducing container attack surface with real-world examples.

# Introduction
Containers are lightweight and fast, but insecure container configurations can become a serious security risk. One of the most common mistakes is running containers as the root user.

In this article, we will explore:

- Why running containers as root is dangerous
- How attackers can abuse root containers
- How to run containers securely as non-root users
- The importance of `.dockerignore`
- Why distroless images improve container security
- How multi-stage builds reduce attack surface and image size

For this demo, I’m using a simple Node.js application.

Source code:\
[https://github.com/Guruhbk/docker-best-practice](https://github.com/Guruhbk/docker-best-practice)

---

# Running Containers as Root User

Running containers as root significantly increases the impact of a compromise. If an attacker gains access to the container, they may:

- install malicious tools
- modify application files
- consume system resources
- access mounted volumes
- potentially compromise the host machine

---

# Creating a Docker Image That Runs as Root

## index.js

```javascript
const express = require('express');
const app = express();
const os = require('os');

app.get('/', (req, res) => {
    res.send("Hi Stranger");
});

app.listen(8080, () => {
    console.log(`
    Hostname: ${os.hostname()}
    User ID: ${process.getuid()}
    `);
});
```

---

## Dockerfile-root

```dockerfile
FROM node:25

WORKDIR /myapp

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

---

# Build and Run the Container

```bash
docker build -t rootaccess .
docker run -it rootaccess
```

Output:

```text
> nodejssampleproject@1.0.0 start
> node index.js

Hostname: 45ede21b1c9c
User ID: 0
```

A user ID of `0` means the application is running as the root user.

---

# Security Risks of Running Containers as Root

## 1. Installing Malicious Software

If an attacker compromises the application, they can install additional tools inside the container.

Example:

```bash
apt update && apt install -y stress
stress --cpu 4
```

This artificially increases CPU usage and can result in denial of service.

Attackers may also install:

- crypto miners
- network scanners
- persistence tools
- reverse shell utilities

---

# 2. Corrupting Application Files

A root user can easily modify or destroy application files.

Examples:

```bash
echo "HACKED" > index.js
```

or:

```bash
rm -rf index.js
```

This could:

- break the application
- inject malicious code
- modify APIs
- steal user data

---

# 3. Compromising the Host Through Docker Socket Mounts

One of the most dangerous mistakes is mounting the Docker socket inside the container.

Example:

```bash
docker run -it \
-v /var/run/docker.sock:/var/run/docker.sock \
root-demo
```

Now, inside the container:

```bash
docker run -v /:/host -it ubuntu chroot /host
```

At this point, the container effectively gains access to the host filesystem.

This is a critical security risk because:

- the Docker daemon runs as root
- anyone with access to `docker.sock` can control the host

---

# Running Containers as Non-Root User

The safest approach is to run applications using a dedicated non-root user.

---

# Secure Dockerfile

```dockerfile
FROM node:25

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY package.json ./

RUN npm install

COPY . .

# Assign ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

EXPOSE 3000

CMD ["npm", "start"]
```

---

# Benefits of Running Containers as Non-Root

## 1. Prevents Package Installation

Non-root users cannot install system packages.

Example:

```bash
apt install stress
```

Output:

```text
E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)
E: Unable to acquire the dpkg frontend lock, are you root?
```

This significantly reduces attacker capabilities.

---

# 2. Protects Docker Socket Access

When running as non-root, access to the Docker socket is usually denied.

Example:

```bash
docker run -it \
-v /var/run/docker.sock:/var/run/docker.sock \
root-demo
```

Inside the container:

```bash
docker ps
```

Output:

```text
permission denied
```

This demonstrates how Linux permissions help protect the host system.

---

# Importance of `.dockerignore`

A common mistake is copying unnecessary files into Docker images.

Suppose your project contains:

```text
project/
├── .env
├── node_modules/
├── .git/
├── id_rsa
├── app.js
└── Dockerfile
```

And your Dockerfile contains:

```dockerfile
COPY . .
```

This copies everything into the image, including:

- secrets
- SSH keys
- `.env` files
- unnecessary dependencies

This increases:

- image size
- attack surface
- risk of secret leakage

---

# Recommended `.dockerignore`

```dockerignore
.git
.gitignore
node_modules
.env
Dockerfile*
README.md
```

Benefits:

- smaller image size
- faster builds
- reduced attack surface
- prevents accidental secret exposure

---

# Using Distroless Images

Container images can be broadly categorized into:

- normal images
- slim images
- distroless images

---

# Comparison

| Type             | Includes                 | Size     | Shell Available | Package Manager | Debugging Ease | Security |
| ---------------- | ------------------------ | -------- | --------------- | --------------- | -------------- | -------- |
| Normal Image     | Full OS utilities        | Large    | Yes             | Yes             | Easy           | Lowest   |
| Slim Image       | Minimal OS packages      | Medium   | Usually Yes     | Limited         | Moderate       | Better   |
| Distroless Image | Only application runtime | Smallest | No              | No              | Hard           | Best     |

---

# Why Distroless Images Are More Secure

A normal image includes utilities such as:

- `curl`
- `apt`
- `bash`
- `ps`
- `cat`
- `ls`

If an attacker compromises the container, these tools can be abused.

Distroless images remove almost everything except:

- application runtime
- required libraries

This means attackers usually cannot:

- open a shell
- install packages
- download malware
- run debugging tools

This dramatically reduces the attack surface.

---

# Multi-Stage Builds

Distroless images are excellent for runtime security, but building applications still requires tools such as:

- package managers
- compilers
- build dependencies

To combine both advantages, we use multi-stage builds.

---

# Multi-Stage Distroless Build

```dockerfile
# -------- Build Stage --------
FROM node:25 AS builder

WORKDIR /build

COPY package.json ./

RUN npm install

COPY . .

# -------- Runtime Stage --------
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY --from=builder /build/app.js ./app.js
COPY --from=builder /build/node_modules ./node_modules

EXPOSE 3000

CMD ["app.js"]
```

---

# Image Size Comparison

| Image                         | Disk Usage | Content Size |
| ----------------------------- | ---------- | ------------ |
| rootaccess\:latest            | 1.65GB     | 411MB        |
| nonroot\:latest               | 1.63GB     | 409MB        |
| multistage-slim\:latest       | 176MB      | 45.4MB       |
| multistage-distroless\:latest | 166MB      | 45.4MB       |

Distroless and multi-stage builds significantly reduce image size and attack surface.

---

# Is Running Containers as Non-Root Alone Enough?

Absolutely not.

Running containers as a non-root user is an important first step, but container security is much broader than simply changing the user ID. A non-root container can still become dangerous if it is given excessive privileges.

The goal should always be:

> Run containers with the least privilege possible.

This principle applies to both:

- Docker containers
- Kubernetes pods

Even a non-root container can become a serious risk if it:

- runs in privileged mode
- has unnecessary Linux capabilities
- mounts sensitive host paths
- mounts the Docker socket
- has unrestricted filesystem access

---

# Common Mistakes That Still Make Containers Dangerous

## 1. Running Containers in Privileged Mode

Example:

```bash
docker run --privileged myapp
```

or in Kubernetes:

```yaml
securityContext:
  privileged: true
```

Privileged containers gain almost unrestricted access to the host kernel and devices.

This can allow attackers to:

- access host devices
- manipulate networking
- load kernel modules
- escape container isolation

Avoid privileged mode unless absolutely necessary.

---

# 2. Mounting Docker Socket

Example:

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock myapp
```

This is extremely dangerous because anyone with access to the Docker socket can control the Docker daemon, which typically runs as root.

Even a non-root container can become dangerous if it can access `docker.sock`.

---

# 3. Running With Excessive Linux Capabilities

Containers should only have the Linux capabilities they truly need.

Bad example:

```bash
docker run --cap-add=ALL myapp
```

Better approach:

```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp
```

In Kubernetes:

```yaml
securityContext:
  capabilities:
    drop:
      - ALL
```

Linux capabilities such as:

- `SYS_ADMIN`
- `NET_ADMIN`
- `SYS_PTRACE`

can significantly increase container privileges.

---

# 4. Allowing Privilege Escalation

In Kubernetes:

```yaml
securityContext:
  allowPrivilegeEscalation: false
```

This prevents processes from gaining more privileges than initially assigned.

Without this restriction, attackers may exploit binaries with special permissions.

---

# 5. Writable Root Filesystem

Containers should ideally run with a read-only root filesystem.

Example:

```yaml
securityContext:
  readOnlyRootFilesystem: true
```

This prevents attackers from:

- modifying binaries
- installing tools
- adding persistence mechanisms

---

# 6. Dangerous hostPath Mounts

Example:

```yaml
hostPath:
  path: /
```

This exposes the host filesystem directly to the container.

If compromised, attackers may:

- modify host files
- steal secrets
- tamper with the operating system

Avoid `hostPath` volumes whenever possible.

---

# Secure Kubernetes Example

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  privileged: false
  capabilities:
    drop:
      - ALL
```

This configuration significantly reduces the attack surface.

---

# Defense in Depth

Container security should always use multiple layers of protection:

- non-root users
- minimal base images
- distroless images
- read-only filesystems
- dropped capabilities
- restricted mounts
- seccomp profiles
- AppArmor/SELinux
- network policies
- image scanning

Security is not one setting. It is a collection of layered controls that reduce the impact of a compromise.

---

# Final Thoughts

Containers are not strong security boundaries by default. A vulnerable application running as root can quickly become a serious infrastructure risk.

To build secure containers:

- avoid running as root
- use `.dockerignore`
- minimize image size
- prefer slim or distroless images
- use multi-stage builds
- avoid mounting `docker.sock`
- reduce unnecessary utilities inside containers

A secure container should assume compromise is possible and minimize the damage an attacker can do afterward. 