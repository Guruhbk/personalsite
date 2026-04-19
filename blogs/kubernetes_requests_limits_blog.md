---
title:  The Complete Guide to Kubernetes Requests and Limits
date: April 20, 2026
author: Guru Prasanth E
category: Kubernetes
tags: [Kubernetes,  DevOps]
excerpt: Learn why CPU and memory requests and limits are critical in Kubernetes, how they affect scheduling, performance, cluster stability, and how production teams tune them correctly.
image: https://www.procore.com/library/wp-content/uploads/2023/06/Request-for-Information-RFI.jpg
---


# The Complete Guide to Kubernetes Requests and Limits (With Real Production Examples)

> Learn why CPU and memory requests and limits are critical in Kubernetes, how they affect scheduling, performance, cluster stability, and how production teams tune them correctly.

---

## Introduction

Many Kubernetes deployment issues are not caused by bad code—they are caused by bad resource settings.

Applications that randomly restart, become slow during peak traffic, remain stuck in Pending state, or trigger unnecessary infrastructure cost often share the same root cause:

**Incorrect or missing CPU and memory requests / limits.**

Yet many engineers copy values from old YAML files without understanding what these settings actually control.

In reality, requests and limits influence:

- Where Pods are scheduled
- How containers compete for CPU
- Whether workloads get OOMKilled
- How autoscaling behaves
- How much money your cluster costs
- Which Pods survive node pressure

If you run Kubernetes in production, understanding these fields is essential.

---

## What Are Requests and Limits?

Kubernetes allows each container to define expected resource needs.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

### Requests

Requests are the minimum resources Kubernetes reserves for the container during scheduling.

Think of requests as:

> “This application needs at least this much capacity to run properly.”

### Limits

Limits are the maximum resources the container is allowed to consume.

Think of limits as:

> “This application cannot exceed this boundary.”

---

## Why Requests Are Important

## 1. Pod Scheduling Depends on Requests

The Kubernetes scheduler uses requests to place Pods onto nodes.

If a node has available CPU and memory that satisfies the request, the Pod can be scheduled there.

If not, the Pod stays Pending.

### Example

A Pod requests:

- 1 CPU
n- 1Gi memory

If no node has that free capacity, scheduling fails.

Without realistic requests, Kubernetes cannot make smart placement decisions.

---

## 2. Prevent Node Overpacking

If requests are too low—or missing entirely—the scheduler may place too many Pods on the same node.

This can cause:

- CPU contention
- Memory pressure
- Latency spikes
- Evictions

Many “random production issues” are actually overpacked nodes.

---

## 3. Better Capacity Planning

Requests help teams estimate how much cluster capacity is truly needed.

Without requests, planning node count becomes guesswork.

---

## 4. Better Autoscaling

Horizontal Pod Autoscaler and Cluster Autoscaler work more effectively when workloads have realistic requests.

Bad requests lead to bad scaling decisions.

---

## Why Limits Are Important

## 1. Protect Against Noisy Neighbors

In shared clusters, one badly behaving container can consume excessive CPU or memory.

Limits prevent a single workload from harming others.

---

## 2. Improve Cluster Stability

A memory leak in one service should not destabilize an entire node.

Limits create safety boundaries.

---

## 3. Predictable Multi-Team Environments

In platform teams where many teams share the same cluster, limits help enforce fairness.

---

## CPU Limits vs Memory Limits (Very Important)

CPU and memory limits behave differently.

## CPU Limit Behavior

If a container tries to use more CPU than allowed, Linux cgroups throttle CPU usage.

Result:

- Application becomes slower
- Requests take longer
- High latency under load
- But container usually keeps running

### Real Example

An API service with low CPU limit may respond fine during normal traffic but slow dramatically during traffic spikes.

---

## Memory Limit Behavior

Memory is stricter.

If a container exceeds its memory limit, it may be terminated.

Often shown as:

```text
OOMKilled
```

Result:

- Pod restarts
- Request failures
- Crash loops
- User impact

Memory limits need careful tuning.

---

## What Happens If You Set Nothing?

If you omit requests and limits:

- Scheduler has poor placement data
- BestEffort QoS assigned
- Pod may be evicted first during pressure
- Uncontrolled CPU usage possible
- Harder troubleshooting
- Higher infrastructure waste

This is risky for production systems.

---

## Real Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: api
          image: my-api:1.0
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
```

This means:

- Scheduler reserves 250 millicores + 256Mi memory
- Container can burst CPU to 500m
- Memory capped at 512Mi

---

## Real Production Problems Caused by Bad Values

## 1. Pod Pending for Hours

Requests too high for available nodes.

## 2. Latency Spikes During Peak Traffic

CPU throttling due to low CPU limit.

## 3. Frequent Restarts

Memory limit too low → OOMKilled.

## 4. Cloud Bill Increased 40%

Requests too high forced unnecessary node scaling.

## 5. Random Node Pressure Evictions

Too many under-requested Pods on same node.

---

## How to Choose Good Values

## Step 1: Observe Real Metrics

Use tools such as:

- Prometheus
- Grafana
- Datadog
- New Relic
- CloudWatch / GCP Monitoring

Track:

- Average CPU
- Peak CPU
- Average memory
- Peak memory
- Startup spikes

---

## Step 2: Set Requests Near Typical Usage

Requests should reflect normal reliable operating needs.

---

## Step 3: Set Limits Based on Safe Burst Range

Allow occasional spikes without wasting resources.

---

## Step 4: Review Monthly

Traffic patterns change.

Resource settings should evolve too.

---

## Practical Starting Guidelines

| Workload | CPU Request | CPU Limit | Memory Strategy |
|---------|------------|----------|----------------|
| API Service | Typical avg | 2x avg | Peak + buffer |
| Worker | Normal queue load | Burst based | Job size based |
| Batch Job | Expected need | Optional | High enough to finish |
| JVM App | Higher baseline | Moderate | Generous |

---

## Requests, Limits, and QoS Classes

Kubernetes assigns QoS classes based on resource settings.

| QoS Class | Meaning |
|----------|--------|
| Guaranteed | Requests = Limits |
| Burstable | Requests set but differ from limits |
| BestEffort | No requests or limits |

### Why It Matters

During node pressure:

1. BestEffort evicted first
2. Burstable next
3. Guaranteed last (usually)

Critical workloads should avoid BestEffort.

---

## Best Practices

### Always Set Requests

At minimum, every production workload should define requests.

### Be Careful With Memory Limits

Too low causes restart loops.

### Avoid Very Low CPU Limits
nCan create severe throttling.

### Use Namespace Guardrails

Use LimitRanges and ResourceQuotas.

### Separate Workload Profiles

API pods and batch jobs should not share identical values.

### Revisit After Every Major Release

New code changes resource usage.

---

## Useful Debugging Commands

```bash
kubectl top pod
kubectl top node
kubectl describe pod mypod
kubectl get events --sort-by=.lastTimestamp
```

Look for:

- OOMKilled
n- Throttling symptoms
- Pending scheduling failures
- Node memory pressure

---

## Common Anti-Patterns

## Copy-Paste Values Everywhere

Each service behaves differently.

## Massive Overprovisioning

Safe values that waste money are still bad values.

## No Limits for Shared Clusters

Risky when many teams share nodes.

## Tiny Memory Limits

Creates unstable workloads.

## Never Reviewing Old Values

A setting from last year may be wrong today.

---

## Final Thoughts

Requests and limits are not cosmetic YAML fields.

They are core controls that determine how Kubernetes schedules, protects, and scales your workloads.

Good values improve reliability and reduce cost.
Bad values create instability and confusion.

If you want mature Kubernetes operations, resource management must be treated seriously.

---

## Suggested Tags

`kubernetes` `devops` `containers` `performance` `sre` `cloud-native`

