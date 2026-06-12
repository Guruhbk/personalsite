---
title:  How HTTPS Works Deep Dive
date: June 13, 2026
author: Guru Prasanth E
category: Security
tags: [Security]
excerpt: HTTPS keeps web traffic private and authentic by combining TLS certificates (to verify site identity), ECDHE key exchange (to create a shared secret without sending it), and fast symmetric session keys (AES/ChaCha20) to encrypt data — giving confidentiality, integrity, and Perfect Forward Secrecy.
image: /images/terraform/terraform_security.jpg
---

> HTTPS keeps web traffic private and authentic by combining TLS certificates (to verify site identity), ECDHE key exchange (to create a shared secret without sending it), and fast symmetric session keys (AES/ChaCha20) to encrypt data — giving confidentiality, integrity, and Perfect Forward Secrecy. ",.

## Introduction

When you open a website like:

```text
https://example.com
```

your browser establishes a secure connection before any data is exchanged.

That secure connection protects:

- Usernames and passwords
- Session cookies
- API requests
- Credit card information
- Personal data

But have you ever wondered what actually happens behind the scenes?

How does the browser know it's talking to the real server?

How is a shared secret created without sending it over the network?

Why can't attackers decrypt HTTPS traffic even if they can see every packet?

In this article, we'll walk through the complete HTTPS flow, from certificates and TLS handshakes to ECDHE key exchange and Perfect Forward Secrecy.

---

# Why HTTP Is Not Secure

Before understanding HTTPS, we need to understand the problem it solves.

HTTP sends data in plain text.

For example:

```http
POST /login

username=guru
password=SuperSecret123
```

Anyone who can intercept network traffic can read this information.

Potential attackers include:

- Someone on the same public Wi-Fi
- A compromised router
- A malicious proxy
- Network monitoring systems

HTTP provides no:

- Encryption
- Identity verification
- Tamper protection

This is where HTTPS comes in.

---

# HTTP vs HTTPS

![HTTP vs HTTPS](/images/https/http_vs_https.png)

HTTPS is simply:

```text
HTTPS = HTTP + TLS
```

TLS provides:

## Confidentiality

Data is encrypted so that attackers cannot read it.

## Integrity

Data cannot be modified without detection.

## Authentication

The browser can verify that it is communicating with the correct server.

Instead of:

```text
Browser → HTTP → Server
```

we get:

```text
Browser → TLS Encrypted Tunnel → Server
```

The actual HTTP traffic still exists, but it travels through an encrypted channel.

---

# The Three Security Goals of HTTPS

## Confidentiality

Only the browser and server can read the data.

Even if an attacker captures the packets, they cannot understand the contents.

## Integrity

Data cannot be modified while in transit.

If an attacker changes the contents of a message, TLS detects it immediately.

## Authentication

The browser verifies the identity of the server before trusting it.

This prevents attackers from impersonating legitimate websites.

---

# The Problem of Trust

Suppose a server simply sends a public key to the browser.

How does the browser know that the public key actually belongs to:

```text
example.com
```

and not an attacker?

Without verification, an attacker could perform a man-in-the-middle attack by presenting their own public key.

This is where certificates and Certificate Authorities come into play.

---

# Understanding TLS Certificates

A TLS certificate contains information such as:

```text
Domain Name
Public Key
Issuer
Validity Period
Digital Signature
```

The certificate effectively says:

> This public key belongs to this domain.

However, anyone can create a certificate.

The important part is who signs it.

---

# Certificate Trust Chain

**Insert Diagram: Certificate Trust Chain**

Browsers trust a set of Root Certificate Authorities (CAs).

The trust chain works like this:

```text
Root CA
   ↓
Intermediate CA
   ↓
Website Certificate
```

When a browser receives a certificate, it validates:

- The certificate is not expired
- The domain matches
- The certificate is signed by a trusted authority
- The signature is valid

If all checks pass, the browser trusts the server's public key.

At this point, the browser knows:

> I am talking to the real server.

But we still need a way to create an encryption key.

---

# The TLS Handshake

**Insert Diagram: TLS Handshake Overview**

The TLS handshake is the process of establishing a secure connection.

At a high level:

```text
Browser → ClientHello
Server → ServerHello
Server → Certificate
Browser ↔ Server → Key Exchange
Secure Connection Established
```

The goal of the handshake is to:

- Authenticate the server
- Negotiate encryption algorithms
- Create a shared secret

Once this process completes, encrypted communication can begin.

---

# Symmetric vs Asymmetric Encryption

## Symmetric Encryption

The same key is used for encryption and decryption.

Examples:

- AES
- ChaCha20

Advantages:

- Extremely fast
- Efficient for large amounts of data

Disadvantage:

- Both parties need the same secret key

## Asymmetric Encryption

Uses two keys:

```text
Public Key
Private Key
```

The public key can be shared freely.

The private key must remain secret.

Asymmetric cryptography helps establish trust and exchange information securely.

However, it is much slower than symmetric encryption.

This is why HTTPS uses a combination of both approaches.

---

# How Browser and Server Create a Shared Secret

Modern TLS uses:

```text
ECDHE
```

which stands for:

```text
Elliptic Curve Diffie-Hellman Ephemeral
```

The goal is simple:

> Generate the same secret on both sides without ever sending the secret across the network.

---

# ECDHE Key Exchange

**Insert Diagram: ECDHE Key Exchange**

The browser generates:

```text
Ephemeral Private Key
Ephemeral Public Key
```

The server does the same.

They exchange only their public keys.

Using mathematical properties of elliptic curves, both sides independently compute:

```text
Shared Secret
```

The browser computes the secret using:

```text
Its Private Key
+
Server Public Key
```

The server computes the secret using:

```text
Its Private Key
+
Browser Public Key
```

Both arrive at exactly the same result.

No secret is ever transmitted over the network.

---

# Why Can't an Attacker Compute the Shared Secret?

**Insert Diagram: Why Attacker Cannot Compute the Secret**

An attacker can see:

```text
Browser Public Key
Server Public Key
```

The attacker also knows:

```text
ECDHE Algorithm
```

So why can't they generate the shared secret?

Because they do not know either party's private key.

ECDHE relies on a difficult mathematical problem called the Elliptic Curve Discrete Logarithm Problem (ECDLP).

Given a public key, deriving the corresponding private key is computationally infeasible.

As a result:

```text
Public Keys → Visible
Private Keys → Hidden
Shared Secret → Unreachable
```

Without one of the private keys, the attacker cannot derive the shared secret.

---

# Session Keys

The shared secret generated by ECDHE is not used directly for encrypting data.

Instead, TLS derives one or more:

```text
Session Keys
```

from the shared secret.

These session keys are then used by:

- AES-GCM
- ChaCha20-Poly1305

to encrypt actual HTTP traffic.

This gives us the performance of symmetric encryption while retaining the security of asymmetric cryptography.

---

# What Are Ephemeral Keys?

The word:

```text
Ephemeral
```

means temporary.

For every new TLS connection:

- New browser keys are generated
- New server keys are generated
- New shared secrets are created

After the session ends:

```text
Ephemeral Keys
Destroyed
```

This design leads to one of the most important security properties in modern TLS.

---

# Perfect Forward Secrecy

**Insert Diagram: Perfect Forward Secrecy**

Imagine an attacker records encrypted HTTPS traffic today.

Years later, the attacker somehow steals the server's certificate private key.

Can they decrypt the recorded traffic?

With modern TLS:

**No.**

Because the session keys were derived from temporary ECDHE keys that no longer exist.

Each TLS session uses completely new ephemeral keys.

Compromising the server's long-term private key does not reveal past session secrets.

This property is called:

**Perfect Forward Secrecy (PFS)**

and it is one of the primary reasons ECDHE became the standard key exchange mechanism in TLS.

---

# Putting Everything Together

When you visit:

```text
https://example.com
```

the following events occur:

```text
DNS Lookup
        ↓
TCP Connection
        ↓
TLS Handshake
        ↓
Certificate Validation
        ↓
ECDHE Key Exchange
        ↓
Shared Secret Generated
        ↓
Session Keys Derived
        ↓
Encrypted HTTP Communication
        ↓
Website Loads Securely
```

At no point is the shared secret transmitted over the network.

At no point does the browser receive the server's private key.

The browser and server independently generate the same secret and use it to establish a secure channel.

---

# Conclusion

HTTPS combines multiple technologies to create secure communication:

```text
Certificates
    ↓
Verify Identity

ECDHE
    ↓
Generate Shared Secret

Session Keys
    ↓
Encrypt Data

Perfect Forward Secrecy
    ↓
Protect Historical Traffic
```

Together, these mechanisms ensure that modern web communication remains private, authenticated, and resistant to interception.

Even if an attacker can observe every packet crossing the network, they cannot decrypt the traffic without access to the temporary keys used during the session.

That is the magic of HTTPS.
