---
title: The Hidden Problem with maxSkew: 1 in Kubernetes
date: July 21, 2026
author: Guru Prasanth E
category: Kubernetes
tags: [Kubernetes]
excerpt: A Kubernetes configuration that works perfectly on day one can unexpectedly fail during a pod restart. This article explores why `maxSkew: 1` and topology spread constraints behave differently for StatefulSets like Kafka and Strimzi, how PVC topology creates hidden scheduling conflicts, and the best practices to avoid pods getting stuck in the **Pending** state.
image: /images/kubernetes/topology_site.png
---
> A Kubernetes configuration that works perfectly on day one can unexpectedly fail during a pod restart. This article explores why `maxSkew: 1` and topology spread constraints behave differently for StatefulSets like Kafka and Strimzi, how PVC topology creates hidden scheduling conflicts, and the best practices to avoid pods getting stuck in the **Pending** state.

## Introduction

Topology Spread Constraints are commonly used in Kubernetes to improve application availability by distributing pods evenly across:
- nodes
- racks
- availability zones

At first glance, using:

```yaml
maxSkew: 1
```

looks like a perfect high-availability strategy.

For stateless applications, this usually works very well.

But for stateful applications like:
- Kafka
- Strimzi
- Elasticsearch
- Cassandra

strict topology spread constraints can unexpectedly break scheduling during:
- pod restarts
- rolling updates
- node failures
- autoscaling events

This article explains a real-world issue commonly seen with StatefulSets, especially in Strimzi deployments.

---

# What is `maxSkew`?

`maxSkew` defines:
> the maximum allowed difference in pod count between topology domains.

Example:

```yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
```

This tells Kubernetes:
- distribute pods evenly across zones
- never allow imbalance greater than 1

---

# Stateless Application Scenario

Suppose we deploy:
- 3 replicas
- across 2 zones

Distribution:

| Zone | Pods |
|---|---|
| zone-a | 2 |
| zone-b | 1 |

This is VALID because:
- difference = 1
- satisfies `maxSkew: 1`

---

# Why Stateless Applications Usually Work Fine

For Deployments (stateless apps):
- pods are disposable
- no persistent identity exists
- no zone-bound storage exists

If a pod restarts:
- Kubernetes can freely recreate it anywhere

Suppose:
- one pod from `zone-a` restarts

Scheduler may decide:
- recreate it in `zone-b`

Now distribution becomes:

| Zone | Pods |
|---|---|
| zone-a | 1 |
| zone-b | 2 |

Still valid.

Nothing breaks because:
- application is stateless
- no storage affinity exists

This is why topology spread constraints work beautifully for stateless workloads.

---

# StatefulSet Scenario

Now let’s look at StatefulSets.

Suppose we have:
- 3 Kafka brokers
- managed by StatefulSet
- using persistent volumes

Current distribution:

| Zone | Brokers |
|---|---|
| zone-a | kafka-0, kafka-1 |
| zone-b | kafka-2 |

This is STILL valid because:
- skew = 1

Everything works initially.

---

# What Happens During Pod Restart

Now imagine:
- `kafka-1` restarts

Its PVC already exists.

And importantly:
- PVC is zone-bound
- underlying EBS volume exists in `zone-a`

This means:
> `kafka-1` MUST run in `zone-a`

because EBS volumes cannot attach cross-zone.

---

# The Scheduling Problem

When Kubernetes tries scheduling `kafka-1` again:

Current running pods:

| Zone | Brokers |
|---|---|
| zone-a | kafka-0 |
| zone-b | kafka-2 |

Scheduler now evaluates:
- where should restarted pod go?

If scheduler places `kafka-1` in `zone-a`:

| Zone | Brokers |
|---|---|
| zone-a | 2 |
| zone-b | 1 |

This is technically valid.

BUT during scheduling evaluation, Kubernetes sometimes evaluates skew against currently schedulable domains and pending states differently, especially when:
- other constraints exist
- anti-affinity exists
- node pressure exists
- one zone has fewer schedulable nodes

Scheduler may attempt balancing toward another zone.

---

# The Real Issue

Scheduler says:
> “To maintain better spread, I prefer zone-b.”

But PVC says:
> “I can only attach in zone-a.”

Now we have conflicting constraints.

---

# Result

Typical outcome:

```text
0/10 nodes are available:
3 node(s) didn't match pod topology spread constraints,
2 node(s) had volume node affinity conflict
```

Pod remains:
- Pending
- unschedulable

This is exactly the issue many teams hit with StatefulSets.

---

# Why This Happens Specifically with StatefulSets

StatefulSets introduce:
- stable identity
- stable storage
- persistent PVC binding

Unlike Deployments:
- pods cannot freely move across zones

Storage locality becomes mandatory.

---

# Why the Initial Deployment Worked

This confuses many engineers.

Initial placement:

| Zone | Brokers |
|---|---|
| zone-a | 2 |
| zone-b | 1 |

was valid.

But after restart:
- scheduler re-evaluates placement
- current cluster conditions may differ
- available nodes may differ
- balancing calculations happen again

Now topology constraints and PVC affinity can conflict.

---

# Why Strimzi Commonly Exposes This Problem

Strimzi Kafka clusters commonly use:
- StatefulSets
- zonal persistent volumes
- rack awareness
- strict anti-affinity
- topology spread constraints

This creates multiple scheduling constraints simultaneously.

Example:
- broker identity
- PVC zone affinity
- anti-affinity
- topology spread
- node resources

Even a small imbalance or temporary node issue can make scheduling impossible.

---

# Real Production Scenario

A common production setup:

```yaml
replicas: 3
```

Topology:
- 2 AZ cluster
- `maxSkew: 1`
- `DoNotSchedule`
- EBS-backed PVCs

Initial distribution:

| Zone | Brokers |
|---|---|
| zone-a | 2 |
| zone-b | 1 |

works perfectly.

Later:
- broker restart happens
- node drain occurs
- autoscaler removes node
- scheduler re-evaluates topology

Now:
- replacement pod cannot schedule
- topology prefers another zone
- PVC requires original zone

Result:
- broker stuck Pending forever

---

# Why Stateless Deployments Don’t Suffer

Stateless Deployments:
- don’t care about storage locality
- can recreate anywhere
- don’t have identity coupling

StatefulSets:
- are tightly coupled to storage topology

This is the key difference.

---

# Best Practices

## Avoid Overly Strict Constraints for StatefulSets

Avoid:

```yaml
maxSkew: 1
whenUnsatisfiable: DoNotSchedule
```

for Stateful workloads unless:
- cluster capacity is guaranteed
- zones are perfectly balanced

---

## Prefer `ScheduleAnyway`

Better:

```yaml
whenUnsatisfiable: ScheduleAnyway
```

This allows:
- temporary imbalance
- successful pod recovery

---

## Use Rack Awareness Carefully

For Kafka/Strimzi:
- rack awareness already provides resilience

Adding multiple strict scheduler constraints may over-constrain scheduling.

---

## Understand Storage Topology

Always remember:
- EBS volumes are AZ-bound
- StatefulSet pods become zone-coupled

This fundamentally changes scheduling behavior.

---

# Key Takeaway

Topology Spread Constraints behave very differently for:
- stateless applications
vs
- StatefulSets

For stateless workloads:
- pods are movable
- scheduler has flexibility

For StatefulSets:
- PVC topology creates hard placement requirements

This can create hidden conflicts during:
- restarts
- rolling updates
- node drains
- autoscaling events

The issue becomes especially visible in Kafka and Strimzi clusters because broker storage is tightly tied to availability zones.

A configuration that initially works perfectly can later fail during recovery operations due to scheduler re-evaluation and PVC topology constraints.

