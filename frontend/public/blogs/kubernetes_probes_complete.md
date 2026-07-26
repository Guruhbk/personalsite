---

title: Liveness Probe vs Readiness Probe vs Startup Probe in Kubernetes
date: July 28, 2026
author: Guru Prasanth E
category: Kubernetes
tags: [Kubernetes, DevOps, Cloud Native, SRE, Platform Engineering]
excerpt: Understand how Kubernetes Liveness, Readiness, and Startup Probes work together to keep applications healthy, prevent unnecessary restarts, control traffic, and support reliable production deployments.
image: /images/kubernetes/kubernetes_probes.png
---

## Introduction

Kubernetes is often described as a self-healing platform.

If a container crashes, Kubernetes can restart it.

If a Pod disappears, a Deployment can create a replacement.

If a Pod becomes unavailable, Kubernetes can stop sending traffic to it.

But there is an important question:

**How does Kubernetes know that an application is actually healthy?**

A container can be running while the application inside it is completely broken.

For example:

* A Java application may be stuck in a deadlock.
* A Node.js process may still be running but unable to process requests.
* An application may have started, but its database connection pool may not be initialized.
* A service may be alive but temporarily unable to serve traffic.
* A large application may need several minutes to complete startup.
* A Pod may be healthy but not yet ready to participate in a rolling deployment.

This is where Kubernetes probes come into the picture.

Kubernetes provides three types of application health probes:

* **Liveness Probe**
* **Readiness Probe**
* **Startup Probe**

These probes answer three different questions:

```text
Startup Probe
"Has my application finished starting?"

        ↓

Readiness Probe
"Can my application receive traffic right now?"

        ↓

Liveness Probe
"Is my application still functioning, or should Kubernetes restart it?"
```

Understanding these differences is critical when running production workloads.

Incorrect probe configuration can result in:

* unnecessary container restarts
* `CrashLoopBackOff`
* traffic being sent to unhealthy Pods
* failed rolling deployments
* cascading failures
* downtime during deployments
* applications never getting enough time to start

In this article, we will understand how all three probes work, how they interact, and how to configure them correctly for real-world Kubernetes workloads.

---

# 1. The Problem: A Running Container Is Not Necessarily Healthy

Let's imagine that we deploy an application to Kubernetes.

The container starts successfully.

From Kubernetes' perspective:

```text
Container Process
       │
       ▼
      RUNNING
```

But is the application actually healthy?

Not necessarily.

Consider this scenario:

```text
Container is running
       │
       ├── Application started
       │
       ├── Database connection failed
       │
       ├── Redis unavailable
       │
       └── HTTP requests returning 500
```

The container process is still running.

But the application is not usable.

This is one of the most important concepts to understand:

> **Container state and application health are not the same thing.**

Kubernetes needs a mechanism to understand the state of the application inside the container.

That's what probes provide.

---

# 2. The Three Questions Kubernetes Needs to Answer

Imagine a production API running in Kubernetes.

Kubernetes needs to answer three different questions.

### Question 1: Has the application finished starting?

This is the job of the **Startup Probe**.

```text
Is the application still starting?
            │
            ▼
       Startup Probe
```

### Question 2: Can this Pod receive traffic?

This is the job of the **Readiness Probe**.

```text
Can I send requests to this Pod?
            │
            ▼
      Readiness Probe
```

### Question 3: Is the application still functioning?

This is the job of the **Liveness Probe**.

```text
Is the application stuck or broken?
            │
            ▼
       Liveness Probe
```

These are different questions.

Therefore, they should not automatically be treated as the same health check.

---

# 3. Liveness Probe

A **Liveness Probe** tells Kubernetes whether a container is still alive and functioning.

The key question is:

> **Should Kubernetes restart this container?**

If the liveness probe repeatedly fails, Kubernetes restarts the container.

The purpose of a liveness probe is to recover from situations where the application is running but cannot recover by itself.

Examples include:

* deadlocks
* stuck threads
* infinite loops
* application hangs
* internal unrecoverable states

## Real-World Example

Imagine a Java application running inside a Pod.

The JVM process is still running.

However, due to a bug, all worker threads become deadlocked.

The situation looks like this:

```text
Pod
 │
 └── Java Process
       │
       ├── Process exists
       ├── JVM exists
       └── Application cannot process requests
```

From the operating system's perspective, the process is alive.

From Kubernetes' perspective, the container is also still running.

But the application is effectively broken.

A liveness probe can detect this condition.

```text
Liveness Probe
      │
      ▼
Health Check Fails
      │
      ▼
Kubernetes restarts container
      │
      ▼
Application starts again
```

This is Kubernetes' self-healing mechanism.

## Example

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8080
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3
```

Kubernetes checks the endpoint every 10 seconds.

If the probe fails three consecutive times, Kubernetes considers the container unhealthy and restarts it.

The exact time before restart is influenced by the probe configuration and the time taken by each probe attempt.

---

# 4. Readiness Probe

A **Readiness Probe** answers a different question:

> **Can this Pod receive traffic right now?**

If the readiness probe fails:

* the container is not restarted
* the Pod remains running
* Kubernetes considers the Pod not ready
* the Pod is removed from the set of ready endpoints used for Service traffic

This is primarily a **traffic management mechanism**.

## Real-World Example

Imagine we have three API Pods:

```text
              Kubernetes Service
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
        Pod A      Pod B      Pod C
        Ready      Ready     NotReady
```

Traffic goes to:

```text
Pod A
Pod B
```

Pod C does not receive normal Service traffic.

Now imagine Pod C temporarily loses access to a dependency.

```text
Pod C
 │
 ├── Application process: Running
 ├── Container: Running
 └── Database: Unavailable
```

The application itself may still be alive.

Restarting it may not solve anything.

Instead, the application can report:

```text
Readiness = FALSE
```

Kubernetes stops routing traffic to that Pod.

Once the database connection is restored:

```text
Readiness = TRUE
```

The Pod becomes eligible to receive traffic again.


You configure:

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8080
  initialDelaySeconds: 5 
  periodSeconds: 5 
  timeoutSeconds: 2 
  failureThreshold: 3 
  successThreshold: 1
```

This is an important distinction:

> **Readiness protects users from unhealthy Pods.**

It does not necessarily fix the underlying problem.

---

# 5. Startup Probe

A **Startup Probe** is designed for applications that take a long time to initialize.

It answers:

> **Has the application finished starting successfully?**

This is particularly important for applications that:

* load large caches
* initialize complex frameworks
* perform migrations
* restore state
* load large datasets
* initialize JVMs
* perform expensive startup operations

## The Problem Without a Startup Probe

Suppose an application takes five minutes to start.

You configure:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
  failureThreshold: 3
```

The application needs 5 minutes.

But Kubernetes starts checking after 30 seconds.

After three failed checks, Kubernetes restarts the container.

The application starts again.

Then the same thing happens.

```text
Application starts
       │
       ▼
30 seconds
       │
       ▼
Liveness checks fail
       │
       ▼
Container restarted
       │
       ▼
Application starts again
       │
       ▼
Liveness checks fail
       │
       ▼
Container restarted
       │
       ▼
CrashLoopBackOff
```

The application may never get enough time to finish starting.

---

# 6. How Startup Probe Solves the Problem

A startup probe tells Kubernetes:

> "Don't use the normal liveness check until my application has successfully started."

Example:

```yaml
startupProbe:
  httpGet:
    path: /health/startup
    port: 8080
  periodSeconds: 10
  failureThreshold: 30
```

This allows approximately:

```text
30 failures × 10 seconds
= 300 seconds
= 5 minutes
```

for the application to successfully start.

The lifecycle becomes:

```text
Container starts
      │
      ▼
Startup Probe runs
      │
      ├── Fails → Keep waiting
      │
      ├── Fails → Keep waiting
      │
      ├── Fails → Keep waiting
      │
      └── Succeeds
             │
             ▼
     Startup completed
             │
       ┌─────┴─────┐
       ▼           ▼
   Liveness     Readiness
     starts       starts
```

While the startup probe is failing, Kubernetes does not use the liveness and readiness probes to determine the container's normal health/readiness state.

Once the startup probe succeeds, it does not normally run again for that container lifecycle. The liveness and readiness probes then take over.

This is one of the most useful features for slow-starting production applications.

---

# 7. How All Three Probes Work Together

This is where the concept becomes much easier to understand.

Imagine we deploy a Spring Boot application.

The lifecycle looks like this:

```text
                 Container Created
                        │
                        ▼
                 Application Starts
                        │
                        ▼
               ┌─────────────────┐
               │ Startup Probe   │
               └────────┬────────┘
                        │
                 Still Starting?
                    │         │
                   YES       NO
                    │         │
                    │         ▼
                    │   Startup Complete
                    │         │
                    │    ┌────┴─────┐
                    │    │          │
                    │    ▼          ▼
                    │ Liveness   Readiness
                    │    │          │
                    │    │          │
                    │    │      Ready for Traffic
                    │    │          │
                    │    │          ▼
                    │    │       Service
                    │    │          │
                    │    │          ▼
                    │    │        Users
                    │    │
                    │    ▼
                    │  Healthy?
                    │    │
                    │   NO
                    │    │
                    │    ▼
                    │ Container Restart
                    │
                    └─────────────────
```

The simple mental model is:

```text
Startup  → "Can I finish starting?"
Readiness → "Can I receive traffic?"
Liveness  → "Should I be restarted?"
```

---

# 8. A Real-World Production Example

Let's consider a production e-commerce API.

The architecture looks like this:

```text
                    Internet
                       │
                       ▼
                 Load Balancer
                       │
                       ▼
                  Kubernetes
                    Service
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Pod A         Pod B         Pod C
          │            │            │
          └────────────┼────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      PostgreSQL      Redis      Payment API
```

The application has three probes.

## Startup Probe

The startup probe verifies that the application has completed its initialization.

It might check:

* application initialization
* framework startup
* required internal components

Example:

```text
/startup
```

The application may return:

```text
200 OK
```

only after initialization is complete.

---

## Readiness Probe

The readiness probe determines whether the Pod should receive traffic.

Example:

```text
/ready
```

The application might check:

* database connection pool availability
* Redis availability
* required internal dependencies

If the database is temporarily unavailable:

```text
Readiness = FALSE
```

The Pod stays alive but stops receiving normal traffic.

---

## Liveness Probe

The liveness probe checks whether the application is fundamentally functioning.

Example:

```text
/health/live
```

The endpoint should focus on whether the application itself is alive and responsive.

If the application becomes permanently stuck:

```text
Liveness = FALSE
```

Kubernetes can restart the container.

The resulting behavior is:

```text
Application starts
       │
       ▼
Startup Probe
       │
       ▼
Startup successful
       │
       ▼
Readiness Probe
       │
       ▼
Pod receives traffic
       │
       ├───────────────┐
       │               │
       ▼               ▼
Dependency        Application
failure           becomes stuck
       │               │
       ▼               ▼
Readiness         Liveness
fails             fails
       │               │
       ▼               ▼
Traffic stops     Container restarts
```

This is a much better failure model than simply restarting every Pod whenever a dependency temporarily becomes unavailable.

---

# 9. What Happens During a Rolling Deployment?

Readiness probes are especially important during deployments.

Suppose we have:

```text
Version 1
├── Pod A
├── Pod B
└── Pod C
```

We deploy Version 2.

Kubernetes creates a new Pod:

```text
Version 1
├── Pod A
├── Pod B
└── Pod C

Version 2
└── Pod D
```

Pod D starts.

But the application takes 60 seconds to initialize.

Without a readiness probe, the new Pod could potentially become eligible for traffic before it is actually capable of serving requests.

With a readiness probe:

```text
Pod D starts
     │
     ▼
Readiness = FALSE
     │
     ▼
Pod D receives no traffic
     │
     ▼
Application initializes
     │
     ▼
Readiness = TRUE
     │
     ▼
Pod D starts receiving traffic
```

This allows Kubernetes to gradually introduce the new version.

This is why readiness probes are critical for **zero-downtime deployments**.

---

# 10. Readiness Is Not the Same as "All Dependencies Must Be Healthy"

One common mistake is making readiness checks too strict.

For example:

```text
Application
  │
  ├── PostgreSQL
  ├── Redis
  ├── Payment API
  ├── Email Service
  ├── Analytics API
  └── Logging Service
```

If the readiness endpoint checks every dependency, a temporary failure in one non-critical service could cause the entire application to become NotReady.

This can create a larger outage.

For example:

```text
Analytics API fails
        │
        ▼
Readiness fails
        │
        ▼
All API Pods become NotReady
        │
        ▼
No traffic
        │
        ▼
E-commerce application unavailable
```

A better approach is to define readiness based on what is **actually required to serve the application's critical traffic**.

The key question should be:

> If this dependency is unavailable, can the application still safely serve requests?

If the answer is yes, it may not belong in the readiness check.

---

# 11. Liveness Probe Should Not Check Everything

Another common mistake is using liveness to check external dependencies.

For example:

```text
Liveness
   │
   ├── Database
   ├── Redis
   ├── Payment API
   └── External Service
```

Imagine the database goes down.

Now:

```text
Database unavailable
        │
        ▼
Liveness fails
        │
        ▼
Kubernetes restarts Pod
        │
        ▼
New Pod starts
        │
        ▼
Database still unavailable
        │
        ▼
Liveness fails again
        │
        ▼
Pod restarts again
```

Every Pod may start restarting.

This is usually not useful.

The database outage is an external dependency problem.

Restarting every application instance may make the situation worse.

In many architectures, dependency failures are better handled through:

* readiness checks
* retries
* timeouts
* circuit breakers
* graceful degradation

The liveness probe should generally answer:

> **Is the application itself stuck in a state where restarting it may help?**

---

# 12. Probe Configuration Parameters

Probe configuration has several important parameters.

## `initialDelaySeconds`

Defines how long Kubernetes waits before starting the probe.

```yaml
initialDelaySeconds: 30
```

This means the probe starts after approximately 30 seconds.

However, for slow-starting applications, a startup probe is often a better solution than relying only on a large `initialDelaySeconds`.

---

## `periodSeconds`

Defines how frequently Kubernetes performs the probe.

```yaml
periodSeconds: 10
```

The probe runs approximately every 10 seconds.

---

## `timeoutSeconds`

Defines how long Kubernetes waits for a probe response.

```yaml
timeoutSeconds: 2
```

If the endpoint does not respond within the timeout, that probe attempt fails.

Be careful with very aggressive values.

For example:

```yaml
timeoutSeconds: 1
```

A temporary CPU spike or network delay could cause false failures.

---

## `failureThreshold`

Defines how many consecutive failures are required before the probe is considered failed.

```yaml
failureThreshold: 3
```

For a liveness probe, this can eventually lead to a container restart.

For a readiness probe, it can cause the Pod to be marked NotReady.

For a startup probe, it determines how many failures are tolerated before startup is considered unsuccessful.

---

## `successThreshold`

Defines how many consecutive successful probes are required to consider a probe successful.

For most probes, the default is 1.

For readiness probes, you can configure a higher value when you want to ensure the application is consistently healthy before sending traffic.

---

# 13. HTTP vs TCP vs Exec Probes

Kubernetes supports different probe mechanisms.

## HTTP Probe

```yaml
httpGet:
  path: /health/live
  port: 8080
```

Good for:

* REST APIs
* web applications
* HTTP services

The application returns a successful HTTP status when the check passes.

---

## TCP Probe

```yaml
tcpSocket:
  port: 9092
```

Kubernetes checks whether a TCP connection can be established.

Useful for services such as:

* Kafka
* databases
* custom TCP applications

However, remember:

> A successful TCP connection does not necessarily mean the application is healthy.

A process can accept TCP connections while still being unable to process requests correctly.

---

## Exec Probe

```yaml
exec:
  command:
    - cat
    - /tmp/healthy
```

Kubernetes executes a command inside the container.

This can be useful for applications without an HTTP endpoint.

However, exec probes should be used carefully.

Running expensive commands frequently can add unnecessary CPU overhead.

---

# 14. A Production-Ready Example

Here is an example of a Kubernetes Deployment using all three probes:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-api
spec:
  replicas: 3

  selector:
    matchLabels:
      app: ecommerce-api

  template:
    metadata:
      labels:
        app: ecommerce-api

    spec:
      containers:
        - name: ecommerce-api
          image: ecommerce-api:v2

          ports:
            - containerPort: 8080

          startupProbe:
            httpGet:
              path: /health/startup
              port: 8080
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 30

          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            periodSeconds: 5
            timeoutSeconds: 2
            failureThreshold: 3
            successThreshold: 1

          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
            periodSeconds: 10
            timeoutSeconds: 2
            failureThreshold: 3
```

The behavior is:

```text
             Container Starts
                    │
                    ▼
             Startup Probe
                    │
             Application starts
                    │
                    ▼
            Startup succeeds
                    │
             ┌──────┴──────┐
             ▼             ▼
        Readiness       Liveness
             │             │
             ▼             ▼
       Traffic Control   Recovery
```

---

# 15. Graceful Shutdown and Probes

Probes are only one part of reliable application lifecycle management.

Consider a Pod receiving traffic:

```text
Pod A
  │
  └── Serving requests
```

Now Kubernetes needs to terminate Pod A.

A good shutdown sequence should allow the Pod to stop receiving new traffic and finish existing requests gracefully.

Conceptually:

```text
Pod receives SIGTERM
        │
        ▼
Pod begins termination
        │
        ▼
Pod becomes unavailable for new traffic
        │
        ▼
Existing requests complete
        │
        ▼
Application exits
```

This is why probe configuration should be considered together with:

* `terminationGracePeriodSeconds`
* application shutdown hooks
* connection draining
* `preStop` lifecycle hooks where appropriate

A healthy Kubernetes deployment is not just about detecting failures.

It is also about **starting and stopping applications safely**.

---

# 16. Common Production Mistakes

## Mistake 1: Using Only a Liveness Probe

A liveness probe does not tell Kubernetes whether a Pod should receive traffic.

You can have:

```text
Liveness = Healthy
Readiness = NotReady
```

The application is alive but temporarily unavailable.

Both concepts are important.

---

## Mistake 2: Restarting Pods Because a Dependency Is Down

Avoid making liveness depend on every external service.

Otherwise:

```text
Dependency failure
      ↓
Liveness failure
      ↓
Pod restart
      ↓
Dependency still unavailable
      ↓
Pod restart again
```

This can turn a dependency outage into a restart storm.

---

## Mistake 3: No Startup Probe for Slow Applications

If an application takes five minutes to start, a liveness probe that starts checking after 30 seconds may repeatedly restart it.

Use a startup probe to protect the initialization period.

---

## Mistake 4: Making Health Checks Too Expensive

Avoid health endpoints that:

* execute expensive database queries
* call many external services
* perform complex computations
* scan large datasets

Health checks run frequently.

A slow health check can become a source of additional load.

---

## Mistake 5: Very Aggressive Timeouts

This configuration may be too aggressive:

```yaml
timeoutSeconds: 1
failureThreshold: 1
```

A single transient delay could cause a failure.

Probe configuration should account for normal application behavior.

---

## Mistake 6: Treating TCP Connectivity as Application Health

A TCP connection only proves that something is listening on the port.

It does not prove that the application is functioning correctly.

---

# 17. Troubleshooting Probe Failures

When a Pod is restarting or unexpectedly NotReady, start by checking the Pod:

```bash
kubectl get pods
```

Then inspect the Pod:

```bash
kubectl describe pod <pod-name>
```

Look at the Events section.

You may see messages such as:

```text
Liveness probe failed
Readiness probe failed
Startup probe failed
```

Check the container logs:

```bash
kubectl logs <pod-name>
```

For a previously terminated container:

```bash
kubectl logs <pod-name> --previous
```

You can also inspect the Pod's current status:

```bash
kubectl get pod <pod-name> -o wide
```

If a Pod is repeatedly restarting, check:

```bash
kubectl get pod <pod-name>
```

You may see:

```text
CrashLoopBackOff
```

Remember that `CrashLoopBackOff` does not itself mean that a liveness probe is the cause.

The container may be:

* crashing on its own
* failing to start
* being killed by Kubernetes
* running out of memory
* failing a liveness probe

Always check the Pod events and container termination reason.

---

# 18. A Simple Mental Model

If you remember only three things from this article, remember this:

```text
STARTUP
"Give me time to start."

READINESS
"Send me traffic only when I can handle it."

LIVENESS
"If I become permanently stuck, restart me."
```

Or, even simpler:

```text
              ┌───────────────┐
              │   STARTUP     │
              │               │
              │ Am I started? │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   READINESS   │
              │               │
              │ Can I receive │
              │   traffic?    │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   LIVENESS    │
              │               │
              │ Am I stuck?   │
              │ Restart me?   │
              └───────────────┘
```

---

# 19. Final Comparison

| Feature                          | Startup Probe                                                   | Readiness Probe         | Liveness Probe          |
| -------------------------------- | --------------------------------------------------------------- | ----------------------- | ----------------------- |
| Main question                    | Has the app started?                                            | Can it receive traffic? | Should it be restarted? |
| Primary purpose                  | Protect slow startup                                            | Control traffic         | Self-healing            |
| Failure effect                   | Container can eventually be restarted if startup never succeeds | Pod becomes NotReady    | Container is restarted  |
| Removes Pod from Service traffic | No, not directly                                                | Yes                     | Not directly            |
| Protects slow startup            | Yes                                                             | No                      | No                      |
| Useful for dependency outages    | Usually no                                                      | Sometimes               | Usually no              |
| Used after startup succeeds      | No longer runs for that container lifecycle                     | Yes                     | Yes                     |

---

# Conclusion

Kubernetes probes are much more than simple health checks.

They are mechanisms that control how Kubernetes interacts with your application throughout its lifecycle.

A well-designed application lifecycle looks like this:

```text
          Application Starts
                 │
                 ▼
          Startup Probe
                 │
                 ▼
          Initialization
                 │
                 ▼
          Readiness Probe
                 │
                 ▼
           Receive Traffic
                 │
                 ▼
          Liveness Probe
                 │
                 ▼
       Detect Unrecoverable State
                 │
                 ▼
          Restart Container
```

The most important thing is to understand that each probe has a different responsibility.

**Startup Probe** protects the application while it is starting.

**Readiness Probe** protects users by preventing traffic from reaching a Pod that is not currently able to serve requests.

**Liveness Probe** enables Kubernetes to recover from applications that have become stuck or unhealthy and may benefit from a restart.

The goal is not to make every health check as complicated as possible.

The goal is to give Kubernetes the **right information at the right stage of the application lifecycle**.

When designing probes for production workloads, ask three questions:

1. **How long can this application take to start?**
2. **What conditions mean that this Pod should receive traffic?**
3. **What conditions indicate that restarting the application could actually fix the problem?**

## If you can answer those three questions correctly, you are already on your way to designing a reliable Kubernetes health-check strategy.

## Quick Reference

```text
Startup Probe
     │
     └── Protects application startup

Readiness Probe
     │
     └── Controls whether traffic reaches the Pod

Liveness Probe
     │
     └── Enables Kubernetes to restart a stuck application
```

**Remember:**

> **Startup decides when the application is ready to be evaluated.**
>
> **Readiness decides whether the application should receive traffic.**
>
> **Liveness decides whether the application should be restarted.**
