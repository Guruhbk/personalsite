---
title: Kubernetes Requests and Limits
date: May 19, 2026
author: Guru Prasanth E
category: Kubernetes
tags: [Kubernetes, DevOps]
excerpt: Learn why CPU and memory requests and limits are critical in Kubernetes, how they affect scheduling, performance, cluster stability, and how production teams tune them correctly.
image: https://www.procore.com/library/wp-content/uploads/2023/06/Request-for-Information-RFI.jpg
---


> Learn why CPU and memory requests and limits are critical in Kubernetes, how they affect scheduling, performance, cluster stability, and how production teams tune them correctly.

---

# Introduction

Many Kubernetes production incidents are not caused by bad application code.

They are caused by bad infrastructure resource management.

Applications that randomly restart, become slow during peak traffic, remain stuck in `Pending` state, or trigger unnecessary infrastructure cost often share the same hidden root cause:

**Incorrect or missing CPU and memory requests and limits.**

Yet in many environments, engineers simply copy values from older YAML files without understanding what those numbers actually control.

In reality, requests and limits influence almost every important Kubernetes behavior:

- Where Pods are scheduled
- How workloads compete for CPU
- Whether containers get OOMKilled
- How autoscaling behaves
- Which Pods survive node pressure
- How efficiently cluster resources are utilized
- Overall cloud infrastructure cost
- Application reliability during traffic spikes

If you operate Kubernetes in production, understanding requests and limits is not optional.

It is one of the most important foundations of stable platform engineering.

---

# What Are Requests and Limits?

Kubernetes allows each container to define expected CPU and memory requirements.

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

These values help Kubernetes make intelligent scheduling and resource management decisions.

---

# Understanding CPU Units

Before going deeper, it is important to understand Kubernetes CPU units.

```text
1000m = 1 CPU core
500m  = 0.5 CPU
250m  = 0.25 CPU
```

The `m` stands for millicores.

For example:

- `100m` means 10% of one CPU core
- `2000m` means 2 full CPU cores

CPU in Kubernetes is generally compressible.

This means workloads can be throttled instead of immediately killed.

---

# Understanding Memory Units

Memory values are typically defined using binary units.

```text
Mi = Mebibytes
Gi = Gibibytes
```

Examples:

```yaml
memory: "256Mi"
memory: "1Gi"
```

Unlike CPU, memory is not compressible.

Once a container exceeds its memory limit, Linux may terminate the process.

---

# Requests

Requests define the minimum resources Kubernetes reserves for the container during scheduling.

Think of requests as:

> “This application needs at least this much capacity to run reliably.”

When the Kubernetes scheduler evaluates nodes, it checks whether enough unallocated requested resources are available.

If sufficient capacity exists, the Pod can be scheduled.

If not, the Pod remains in `Pending` state.

---

# Limits

Limits define the maximum resources a container is allowed to consume.

Think of limits as:

> “This workload cannot exceed this boundary.”

Limits protect cluster stability by preventing one workload from consuming excessive resources.

They are especially important in shared clusters where many teams run workloads on the same nodes.

---

# Why Requests Are Extremely Important

# 1. Pod Scheduling Depends on Requests

The Kubernetes scheduler primarily uses requests to determine Pod placement.

If a node does not have enough available requested CPU or memory, the Pod cannot be scheduled there.

## Example

A Pod requests:

- 1 CPU
- 1Gi memory

If every node already allocated those requested resources elsewhere, the scheduler keeps the Pod in:

```text
Pending
```

Even if nodes appear idle in reality.

This confuses many engineers.

The scheduler trusts declared requests, not instantaneous utilization.

---

# 2. Prevent Node Overpacking

If requests are set too low — or omitted entirely — Kubernetes may aggressively pack Pods onto the same node.

This can lead to:

- CPU contention
- Memory pressure
- High latency
- Application instability
- Frequent evictions
- Noisy neighbor problems

Many “random Kubernetes production issues” are actually resource contention problems caused by under-requested workloads.

---

# 3. Better Capacity Planning

Infrastructure teams rely on requests to estimate cluster capacity requirements.

Without requests:

- Node sizing becomes guesswork
- Autoscaling becomes inaccurate
- Infrastructure costs become unpredictable
- Resource fragmentation increases

Good requests improve forecasting and infrastructure efficiency.

---

# 4. Better Autoscaling

Several Kubernetes autoscaling components rely heavily on requests.

Including:

- Horizontal Pod Autoscaler (HPA)
- Vertical Pod Autoscaler (VPA)
- Cluster Autoscaler

If requests are unrealistic:

- HPA may scale too early or too late
- Cluster Autoscaler may add unnecessary nodes
- Workloads may appear overloaded when they are not

Proper resource definitions improve scaling behavior significantly.

---

# Why Limits Matter

# 1. Protect Against Noisy Neighbors

In shared Kubernetes clusters, one badly behaving container can consume excessive resources.

Without limits:

- One service can starve others
- Node performance degrades
- Critical applications become unstable

Limits create resource boundaries.

---

# 2. Improve Cluster Stability

A memory leak inside one application should not destabilize an entire Kubernetes node.

Limits help contain failures.

This is especially important in:

- Multi-tenant environments
- Platform engineering teams
- Shared EKS/GKE/AKS clusters
- Large production platforms

---

# 3. Fair Resource Distribution

When many teams share infrastructure, limits help maintain fairness.

Without limits:

- Aggressive workloads dominate resources
- Smaller services become unstable
- Platform reliability suffers

Resource governance becomes difficult.

---

# CPU Limits vs Memory Limits (Very Important)

One of the biggest Kubernetes misunderstandings is assuming CPU and memory limits behave the same way.

They do not.

---

# CPU Limit Behavior

If a container tries to use more CPU than its limit, Linux cgroups throttle CPU usage.

The container usually continues running.

## Result

- Slower application performance
- Increased response latency
- Reduced throughput
- Longer processing time
- Higher request queueing

But the container typically survives.

---

# Real CPU Throttling Example

Imagine an API service:

```yaml
limits:
  cpu: "500m"
```

During normal traffic:

- Application works perfectly

During peak traffic:

- CPU demand rises to 1 core
- Linux throttles the container
- Response time increases dramatically
- APIs become slow
- Users experience latency spikes

The Pod does not crash.

It simply becomes slow.

This is why very restrictive CPU limits can silently hurt performance.

---

# Memory Limit Behavior

Memory works very differently.

If a container exceeds its memory limit:

- Linux Out Of Memory killer may terminate the process
- Kubernetes restarts the container

Usually visible as:

```text
OOMKilled
```

---

# Result of Bad Memory Limits

- Pod restarts
- Application downtime
- Request failures
- CrashLoopBackOff
- Unstable services
- Lost in-memory data

Memory limits require careful tuning.

Setting them too low is one of the most common Kubernetes production mistakes.

---

# What Happens If You Set Nothing?

If requests and limits are omitted entirely:

- Scheduler has poor placement information
- Pod receives `BestEffort` QoS class
- Pod becomes eviction candidate during node pressure
- CPU usage becomes uncontrolled
- Troubleshooting becomes harder
- Cluster utilization becomes unpredictable

For production workloads, this is highly risky.

---

# Kubernetes QoS Classes

Kubernetes automatically assigns a QoS (Quality of Service) class.

---

| QoS Class | Meaning |
|---|---|
| Guaranteed | Requests = Limits |
| Burstable | Requests set but differ from limits |
| BestEffort | No requests or limits |

---

# Guaranteed QoS

Example:

```yaml
resources:
  requests:
    cpu: "1"
    memory: "1Gi"
  limits:
    cpu: "1"
    memory: "1Gi"
```

These Pods receive the highest protection during node pressure.

Ideal for:

- Critical databases
- Core infrastructure
- Important control plane services

---

# Burstable QoS

Most production workloads use Burstable.

Example:

```yaml
requests:
  cpu: "250m"
limits:
  cpu: "1"
```

This allows workloads to burst above baseline usage.

Good balance between:

- Stability
- Performance
- Cost efficiency

---

# BestEffort QoS

No requests or limits.

Example:

```yaml
resources: {}
```

These Pods are first to be evicted during resource pressure.

Usually unsuitable for production.

---

# Real Deployment Example

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

This configuration means:

- Scheduler reserves 250 millicores CPU
- Scheduler reserves 256Mi memory
- Container may burst CPU to 500m
- Memory usage capped at 512Mi

This is a common Burstable production pattern.

---

# Real Production Problems Caused by Bad Resource Values

# 1. Pods Stuck in Pending State

Cause:

- Requests too high
- Nodes lack allocatable capacity

Symptoms:

```bash
0/5 nodes are available: insufficient memory
```

---

# 2. Latency Spikes During Peak Traffic

Cause:

- CPU limit too restrictive
- Heavy CPU throttling

Symptoms:

- Slow APIs
- Increased p99 latency
- High response times
- Low throughput

---

# 3. Frequent OOMKilled Restarts

Cause:

- Memory limit too low
- Application memory spikes exceed limit

Symptoms:

```text
OOMKilled
CrashLoopBackOff
```

---

# 4. Cloud Cost Increased by 40%

Cause:

- Requests massively overprovisioned
- Cluster Autoscaler added unnecessary nodes

Very common in enterprises.

---

# 5. Random Node Pressure Evictions

Cause:

- Too many under-requested Pods packed onto same node

Symptoms:

```text
Evicted
Reason: MemoryPressure
```

---

# Understanding CPU Throttling Deeply

CPU throttling is one of the most misunderstood Kubernetes performance issues.

Many teams only monitor CPU usage percentage.

But low CPU usage does not always mean healthy performance.

A container may actually be throttled aggressively.

## Example Scenario

A service needs:

- 1 full CPU during peak load

But limit configured:

```yaml
limits:
  cpu: "300m"
```

Linux restricts execution time.

The application becomes slow even though:

- Memory is healthy
- Pod is running
- No crashes occur

This creates hidden latency issues.

---

# Why Memory Requests Matter More Than Many Think

Many engineers focus only on memory limits.

But memory requests are equally important.

The scheduler uses memory requests for placement decisions.

If memory requests are too small:

- Too many Pods fit onto a node
- Actual runtime memory usage exceeds expectations
- Node memory pressure occurs
- Kubernetes starts evicting Pods

This becomes dangerous during traffic spikes.

---

# How Kubernetes Calculates Node Capacity

Each Kubernetes node has:

- Total CPU
- Total memory
- System reserved resources
- Kubernetes reserved resources

Only remaining allocatable resources are available for Pods.

Example:

| Resource | Amount |
|---|---|
| Node Memory | 16Gi |
| System Reserved | 2Gi |
| Allocatable | 14Gi |

Scheduler only considers allocatable capacity.

---

# Requests and Cluster Autoscaler

Cluster Autoscaler relies heavily on requests.

If Pods cannot schedule because requests exceed available capacity:

- Autoscaler adds new nodes

If requests are inflated:

- More nodes than necessary are created
- Infrastructure cost rises significantly

Bad requests directly increase cloud bills.

---

# Real Production Sizing Strategy

Most mature platform teams follow a process like this:

## Step 1: Observe Real Metrics

Use monitoring tools such as:

- Prometheus
- Grafana
- Datadog
- New Relic
- CloudWatch
- GCP Monitoring
- Dynatrace

Track:

- Average CPU
- Peak CPU
- Average memory
- Peak memory
- Startup spikes
- GC spikes
- Burst traffic behavior

---

# Step 2: Define Requests Around Reliable Baseline

Requests should reflect normal stable operating usage.

Example:

If service usually consumes:

- 200m CPU
- 300Mi memory

Requests may be:

```yaml
requests:
  cpu: "250m"
  memory: "384Mi"
```

---

# Step 3: Define Safe Limits

Limits should allow safe bursting.

Example:

```yaml
limits:
  cpu: "1"
  memory: "768Mi"
```

Enough headroom for:

- Traffic spikes
- JVM bursts
- Temporary workload increases

---

# Step 4: Continuously Reevaluate

Applications evolve.

Resource usage changes over time.

Good teams periodically revisit resource configurations.

Especially after:

- Major releases
- Traffic growth
- Runtime upgrades
- Architecture changes

---

# Practical Starting Guidelines

| Workload Type | CPU Request | CPU Limit | Memory Strategy |
|---|---|---|---|
| API Service | Near average | 2x average | Peak + buffer |
| Worker | Normal queue load | Burst based | Job size based |
| Batch Job | Expected runtime need | Optional | High enough to finish |
| JVM App | Higher baseline | Moderate | Generous |
| Databases | Stable guaranteed | Often equal | Conservative |

These are starting points, not universal rules.

---

# Special Considerations for JVM Applications

JVM applications often need careful memory planning.

Because memory usage includes:

- Heap
- Metaspace
- Thread stacks
- Direct buffers
- Native memory

A Java service using:

```text
-Xmx512m
```

May actually require:

```text
700Mi+
```

Container limits that ignore non-heap memory frequently cause OOMKilled errors.

---

# Requests and Limits in Multi-Tenant Clusters

Shared clusters require stronger governance.

Without proper controls:

- One team may overconsume resources
- Resource starvation affects others
- Platform instability increases

This is why platform teams often enforce:

- LimitRanges
- ResourceQuotas
- Namespace defaults
- Admission controllers

---

# Using LimitRanges

`LimitRange` helps enforce default requests and limits.

Example:

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
    - default:
        cpu: "500m"
        memory: "512Mi"
      defaultRequest:
        cpu: "250m"
        memory: "256Mi"
      type: Container
```

Useful for preventing unbounded workloads.

---

# Using ResourceQuotas

`ResourceQuota` limits total namespace resource consumption.

Example:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
```

This prevents one namespace from consuming excessive cluster capacity.

---

# Useful Debugging Commands

```bash
kubectl top pod
kubectl top node
kubectl describe pod mypod
kubectl get events --sort-by=.lastTimestamp
```

---

# What to Look For

## OOMKilled

```text
Last State: Terminated
Reason: OOMKilled
```

Indicates memory limit exceeded.

---

# Pending Scheduling Failures

```text
0/10 nodes available: insufficient cpu
```

Requests too high for available cluster capacity.

---

# Node Pressure

```text
MemoryPressure=True
```

Node under heavy memory stress.

---

# CPU Throttling Symptoms

Indicators:

- High latency
- Low throughput
- Increased response times
- High throttled CPU metrics

Often visible in Prometheus metrics such as:

```text
container_cpu_cfs_throttled_seconds_total
```

---

# Common Anti-Patterns

# 1. Copy-Paste Resource Values Everywhere

Every service behaves differently.

A Kafka consumer and REST API should not share identical settings.

---

# 2. Massive Overprovisioning

Many teams intentionally overestimate requests.

This wastes:

- CPU
- Memory
- Node capacity
- Cloud budget

Overprovisioning at scale becomes extremely expensive.

---

# 3. No Limits in Shared Clusters

Without limits:

- Resource abuse becomes possible
- Cluster reliability decreases
- Noisy neighbor issues increase

---

# 4. Tiny Memory Limits

Very low memory limits create unstable workloads.

Especially dangerous for:

- JVM apps
- Kafka clients
- Python workloads
- Machine learning services

---

# 5. Never Reviewing Old Values

Traffic patterns evolve.

Code changes.

Libraries change.

A resource configuration from last year may now be completely wrong.

---

# Advanced Production Recommendation

Many mature organizations:

- Avoid CPU limits entirely for latency-sensitive applications
- Always set memory limits
- Continuously monitor throttling metrics
- Use VPA recommendations as guidance
- Separate batch and latency-sensitive workloads
- Tune resources based on SLOs

This helps balance:

- Reliability
- Performance
- Cost efficiency

---

# Real-World Example: E-Commerce Traffic Spike

Imagine an e-commerce platform during a major sale.

Traffic suddenly increases 10x.

If API Pods have:

```yaml
limits:
  cpu: "300m"
```

Requests begin queueing.

Latency rises.

Checkout failures increase.

Revenue impact follows.

But simply increasing CPU limit to:

```yaml
limits:
  cpu: "2"
```

May completely stabilize the service.

Resource tuning directly affects business outcomes.

---

# Final Thoughts

Requests and limits are not cosmetic YAML fields.

They are core controls that determine how Kubernetes schedules, protects, isolates, and scales workloads.

Good resource management:

- Improves reliability
- Reduces infrastructure cost
- Prevents noisy neighbors
- Enhances autoscaling
- Improves cluster efficiency
- Reduces production incidents

Bad resource management creates:

- Instability
- Slow applications
- Random evictions
- Unnecessary cloud spending
- Difficult troubleshooting

If you want mature Kubernetes operations, requests and limits must be treated as first-class engineering concerns.

---

# Suggested Tags

`kubernetes` `devops` `containers` `performance` `sre` `cloud-native` `platform-engineering` `kubernetes-resources`

