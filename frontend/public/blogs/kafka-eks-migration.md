---
title: Migrating Kafka to EKS with Strimzi Operator
date: December 28, 2024
author: Guru Prasanth E
excerpt: A comprehensive guide to migrating Kafka infrastructure from EC2 to Amazon EKS using the Strimzi Operator, ensuring high availability and minimal downtime.
image: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800
---

# Migrating Kafka to EKS with Strimzi Operator

At Freshworks, we recently completed a major infrastructure migration - moving our Kafka clusters from EC2 instances to Amazon EKS using the Strimzi Operator. This post shares our experience and lessons learned.

## Why Migrate to Kubernetes?

Running Kafka on EC2 had served us well, but we faced several challenges:

- **Manual scaling**: Adding brokers required manual intervention
- **Limited automation**: Configuration management was complex
- **Resource utilization**: Fixed instance sizes led to waste
- **Operational overhead**: Patching and updates were time-consuming

## Enter Strimzi Operator

Strimzi is a CNCF project that simplifies running Apache Kafka on Kubernetes. It provides:

- Declarative Kafka cluster management
- Automated rolling updates
- Built-in monitoring with Prometheus
- Topic and user management via CRDs

## Migration Strategy

We followed a phased approach to minimize risk:

### Phase 1: Preparation (2 weeks)

1. Set up EKS cluster with proper networking
2. Install Strimzi operator
3. Deploy test Kafka cluster
4. Validate connectivity and performance

```yaml
apiVersion: kafka.strimzi.io/v1beta2
kind: Kafka
metadata:
  name: production-cluster
spec:
  kafka:
    version: 3.6.0
    replicas: 6
    storage:
      type: persistent-claim
      size: 1000Gi
      class: gp3
  zookeeper:
    replicas: 3
    storage:
      type: persistent-claim
      size: 100Gi
```

### Phase 2: MirrorMaker 2 Setup (1 week)

We used Kafka MirrorMaker 2 for data replication:

- Active-passive replication from EC2 to EKS
- Consumer group offset sync
- Topic configuration sync
- Monitored lag continuously

### Phase 3: Cutover (3 days)

1. Freeze writes to EC2 cluster
2. Wait for MirrorMaker 2 to catch up (lag = 0)
3. Switch applications to EKS cluster
4. Monitor for issues
5. Keep EC2 as fallback for 1 week

## Challenges We Faced

### Storage Performance

**Problem**: Initial setup with gp2 volumes showed high latency.

**Solution**: Migrated to gp3 volumes with provisioned IOPS.

### Network Throughput

**Problem**: Pod-to-pod communication was slower than expected.

**Solution**: 
- Enabled ENI trunking
- Used placement groups for broker pods
- Optimized MTU settings

### Cost Optimization

**Problem**: Running 6 brokers on r5.2xlarge was expensive.

**Solution**:
- Right-sized to r5.xlarge with auto-scaling
- Used Spot instances for non-critical brokers
- Implemented cluster autoscaler

## Results

- **99.99% uptime** maintained during migration
- **40% cost reduction** compared to EC2
- **50% faster** deployment of configuration changes
- **Zero message loss** during cutover

## Key Learnings

1. **Test thoroughly**: We ran production-like load tests for 2 weeks
2. **Monitor everything**: Datadog + Prometheus gave us full visibility
3. **Plan for rollback**: Always have a backup plan
4. **Communication is key**: Keep all stakeholders informed
5. **Document everything**: Future migrations will be easier

## Conclusion

Migrating Kafka to Kubernetes with Strimzi has been transformative for our operations. The automation, scalability, and operational simplicity are well worth the effort.

If you're considering a similar migration, start small, test thoroughly, and don't rush the process.