---
title:  Helm Hooks: Automating Tasks Before and After Deployments 
date: June 27, 2026
author: Guru Prasanth E
category: Kubernetes
tags: [Kubernetes,  DevOps]
excerpt: Learn how Helm Hooks simplify Kubernetes deployments by automating pre- and post-deployment tasks with real-world examples and production best practices.
image: /images/kubernetes/helm_hooks.png
---


## Introduction

One of the biggest challenges in Kubernetes deployments is handling tasks that must happen before or after an application deployment.

Imagine deploying a new version of an application that requires a database schema change. If the application starts before the schema is updated, it may immediately crash. Similarly, if you need to take a backup before an upgrade, Kubernetes itself provides no native mechanism to perform these deployment lifecycle operations.

This is where Helm Hooks become extremely valuable.

Helm Hooks allow engineers to execute Kubernetes resources at specific stages of a release lifecycle such as installation, upgrade, rollback, testing, and deletion.

In this article, we'll explore:

* What Helm Hooks are
* How they work internally
* Available hook types
* Hook ordering and cleanup
* use cases
* Common pitfalls and best practices

---

# What Are Helm Hooks?

Helm Hooks are Kubernetes resources that Helm executes at predefined lifecycle events.

A hook is defined using a special annotation:

```yaml
metadata:
  annotations:
    "helm.sh/hook": pre-install
```

When Helm encounters this annotation, it treats the resource differently from normal chart resources.

Instead of deploying it as part of the application workload, Helm executes it at a specific stage of the deployment lifecycle.

---

# Why Do We Need Hooks?

Consider the following deployment workflow.

Without Hooks:

```text
helm upgrade
      │
      ▼
Deploy Application
      │
      ▼
Application Starts
      │
      ▼
Database Schema Missing
      │
      ▼
Application Crash
```

With Hooks:

```text
helm upgrade
      │
      ▼
Run Database Migration
      │
      ▼
Migration Successful
      │
      ▼
Deploy Application
      │
      ▼
Application Starts Successfully
```

Hooks help automate operational tasks that are tightly coupled with application deployments.

---

# Available Hook Types

Helm supports multiple lifecycle hooks.

| Hook          | Trigger             |
| ------------- | ------------------- |
| pre-install   | Before installation |
| post-install  | After installation  |
| pre-upgrade   | Before upgrade      |
| post-upgrade  | After upgrade       |
| pre-delete    | Before uninstall    |
| post-delete   | After uninstall     |
| pre-rollback  | Before rollback     |
| post-rollback | After rollback      |
| test          | During helm test    |

---

# Understanding Hook Execution Flow

Let's examine an installation.

```bash
helm install myapp .
```

Helm performs the following sequence:

```text
Install Release
      │
      ▼
Execute pre-install Hooks
      │
      ▼
Deploy Chart Resources
      │
      ▼
Execute post-install Hooks
      │
      ▼
Mark Release Successful
```

For upgrades:

```bash
helm upgrade myapp .
```

Execution flow:

```text
Start Upgrade
      │
      ▼
Execute pre-upgrade Hooks
      │
      ▼
Upgrade Resources
      │
      ▼
Execute post-upgrade Hooks
      │
      ▼
Upgrade Complete
```

---

# Creating Your First Hook

Let's create a simple pre-install hook.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pre-install-check
  annotations:
    "helm.sh/hook": pre-install
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: checker
        image: busybox
        command:
        - sh
        - -c
        - echo "Pre-install validation successful"
```

When Helm encounters this resource:

```bash
helm install myapp .
```

The Job executes before any application resource is installed.

---

# Use Case #1: Database Migration

This is by far the most common use case.

Imagine deploying version 2.0 of an application.

Version 2.0 introduces:

```sql
ALTER TABLE users
ADD COLUMN mobile_number VARCHAR(20);
```

The application code expects this column to exist.

If deployment occurs before migration:

```text
Application Starts
       │
       ▼
Query Executes
       │
       ▼
Column Not Found
       │
       ▼
Application Failure
```

Instead, create a migration Job.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
  annotations:
    "helm.sh/hook": pre-upgrade
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: migration
        image: myapp:v2
        command:
        - python
        - manage.py
        - migrate
```

Now deployment becomes:

```text
helm upgrade
       │
       ▼
Run Migration
       │
       ▼
Migration Success
       │
       ▼
Deploy Application
       │
       ▼
Application Starts
```

If migration fails:

```text
Migration Failed
      │
      ▼
Upgrade Aborted
```

This prevents production outages.

---

# Use Case #2: Kafka Topic Validation

Suppose your microservice depends on Kafka topics.

Before deployment:

```text
orders
payments
notifications
```

must already exist.

A pre-install hook can verify Kafka connectivity and topic availability.

```yaml
annotations:
  "helm.sh/hook": pre-install
```

The Job:

```bash
kafka-topics.sh --describe --topic orders
```

If validation fails:

```text
Topic Missing
      │
      ▼
Installation Fails
```

This prevents applications from entering CrashLoopBackOff due to missing dependencies.

---

# Use Case #3: Backup Before Upgrade

For stateful applications:

```text
PostgreSQL
MongoDB
Redis
Elasticsearch
```

it is often necessary to take backups before major upgrades.

A pre-upgrade hook can trigger backup automation.

```yaml
annotations:
  "helm.sh/hook": pre-upgrade
```

Workflow:

```text
helm upgrade
      │
      ▼
Take Backup
      │
      ▼
Backup Success
      │
      ▼
Upgrade Application
```

---

# Use Case #4: Cleanup During Uninstall

Suppose your application creates:

* Temporary databases
* Test topics
* Shared storage paths

Before uninstall:

```yaml
annotations:
  "helm.sh/hook": pre-delete
```

The hook can:

```bash
Delete temporary topics
Remove stale objects
Archive logs
```

before Helm removes the release.

---

# Hook Ordering with Weights

Multiple hooks can exist for the same lifecycle event.

Example:

```yaml
metadata:
  annotations:
    "helm.sh/hook": pre-upgrade
    "helm.sh/hook-weight": "-10"
```

Helm executes lower weights first.

Example:

| Hook       | Weight |
| ---------- | ------ |
| Backup     | -10    |
| Validation | 0      |
| Migration  | 10     |

Execution order:

```text
Backup
   │
   ▼
Validation
   │
   ▼
Migration
```

This provides deterministic execution.

---

# Hook Delete Policies

A common mistake is forgetting cleanup.

By default hook resources remain in the cluster.

Example:

```yaml
annotations:
  "helm.sh/hook-delete-policy": hook-succeeded
```

Available policies:

```text
hook-succeeded
hook-failed
before-hook-creation
```

Recommended production configuration:

```yaml
annotations:
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

This prevents Job accumulation over time.

---

# What Happens When a Hook Fails?

Consider a pre-upgrade migration Job.

```text
helm upgrade
      │
      ▼
Migration Job Starts
      │
      ▼
Migration Fails
      │
      ▼
Upgrade Stops
```

Result:

* Application remains on previous version
* Deployment is blocked
* Production outage avoided

This behavior is one of the biggest advantages of hooks.

---

# Common Pitfalls

## Long-Running Hooks

Bad example:

```text
Data migration taking 4 hours
```

Helm will wait and may hit timeout limits.

Use dedicated migration workflows for large operations.

---

## Missing Cleanup Policy

Without cleanup:

```text
migration-job-1
migration-job-2
migration-job-3
migration-job-4
```

Clusters become cluttered with completed Jobs.

Always configure delete policies.

---

## Non-Idempotent Hooks

Avoid:

```sql
CREATE TABLE users;
```

Better:

```sql
CREATE TABLE IF NOT EXISTS users;
```

Hooks should be safe to rerun.

---

# Helm Hooks vs Kubernetes Lifecycle Hooks

Many engineers confuse these concepts.

Helm Hook:

```yaml
annotations:
  helm.sh/hook: pre-install
```

Triggered by Helm.

Kubernetes Lifecycle Hook:

```yaml
lifecycle:
  preStop:
```

Triggered by kubelet.

They solve entirely different problems.

---

# Best Practices

1. Use Jobs instead of Pods.
2. Keep hooks idempotent.
3. Configure cleanup policies.
4. Use hook weights for ordering.
5. Avoid long-running tasks.
6. Log hook execution clearly.
7. Test hooks in non-production environments.
8. Use hooks only for deployment-related operations.

---

# Final Thoughts

Helm Hooks are one of the most powerful yet underutilized features in Kubernetes deployments.

They bridge the gap between application deployment and operational automation by enabling tasks such as database migrations, backup creation, dependency validation, cleanup operations, and deployment testing.

In production environments, Hooks often become the difference between a smooth zero-downtime release and a failed deployment.

The next time you're deploying an application that requires actions before or after installation, upgrade, rollback, or deletion, consider leveraging Helm Hooks instead of relying on manual operational steps.
