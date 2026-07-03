---
title:  AWS IAM Best Practices Engineers Ignore (Until Something Breaks) 
date: May 18, 2026
author: Guru Prasanth E
category: AWS
tags: [AWS,  Security]
excerpt: Most AWS security incidents don't start with hackers—they start with overly permissive IAM policies. Discover 12 AWS IAM best practices that engineers often overlook and learn how to strengthen your cloud security with least privilege, temporary credentials, and smarter access controls.
image: /images/aws/iam.png
---

> Most AWS security incidents don't start with hackers—they start with overly permissive IAM policies. Discover 12 AWS IAM best practices that engineers often overlook and learn how to strengthen your cloud security with least privilege, temporary credentials, and smarter access controls.

## Introduction

When people think about AWS security, they usually think about
firewalls, VPCs, encryption, or security groups.

But in reality, most cloud security incidents begin with something much
simpler:

> An IAM permission that was broader than it needed to be.

As engineers, we often create IAM policies just to "make things work." A
wildcard here, an AdministratorAccess role there, and suddenly
production has dozens of identities with permissions nobody fully
understands.

The scary part?

Everything still works perfectly---until one compromised credential or
accidental command causes a major incident.

In this article, we'll explore IAM best practices that many engineers
overlook, even after years of working with AWS.

# 1. Stop Using AdministratorAccess for Humans

One of the biggest anti-patterns is giving engineers full administrator
access simply because it's convenient.

``` text
    AdministratorAccess
```
It solves permission issues instantly...but creates a massive blast
radius.

Instead: 
- Use permission sets based on job roles. 
- Separate developer, SRE, DevOps, and security responsibilities. 
- Elevate privileges only when required.

Think of admin access like root access on Linux.

You don't SSH as root every day.

The same principle applies to AWS.

# 2. Avoid Wildcards Whenever Possible

We've all written policies like:

``` json
"Action": "*",
"Resource": "*"
```

Or

``` json
"Action": "s3:*"
```

Instead, specify only the exact actions required.

``` json
s3:GetObject
s3:PutObject
s3:ListBucket
```

Least privilege isn't just a security recommendation. 

It also prevents accidental outages.

# 3. Use IAM Roles Instead of Long-Term Access Keys

Access keys never expire by default.

People generate them...

Forget them...

Months later they're still active.

Use IAM Roles whenever possible:

-   EC2 → Instance Profile
-   Lambda → Execution Role
-   ECS → Task Role
-   EKS → IRSA
-   GitHub Actions → OIDC
-   CI/CD → AssumeRole

Temporary credentials dramatically reduce risk.

# 4. Trust Policies Matter Just as Much as Permission Policies

Many engineers focus only on permissions.

But the trust relationship decides **who can assume the role**.

Bad:

    Principal: "*"

Better:

-   Only specific AWS Account
-   Specific IAM Role
-   OIDC Provider
-   AWS Service

A poorly written trust policy can expose powerful roles.

# 5. Use Conditions More Often

IAM Conditions are one of AWS's most underused security features.

Examples: 

Allow access only:
- From a specific VPC endpoint 
- During business hours 
- From a corporate IP 
- With MFA enabled 
- With required resource tags

Conditions make permissions context-aware.

# 6. Separate Humans from Applications

Applications should never use developer credentials.

Instead

Humans: 
- IAM Identity Center 
- MFA 
- Temporary sessions

Applications: 
- IAM Roles 
- Instance Profiles 
- IRSA 
- Service Roles

This separation simplifies auditing.

# 7. Rotate Roles, Not Secrets

Many teams spend enormous effort rotating access keys.

A better solution:

Avoid storing secrets entirely.

Use: 
- IAM Roles 
- STS Temporary Credentials 
- OIDC Federation

No secrets to rotate.

No leaked keys to worry about.

# 8. Tag Everything and Use ABAC

Most organizations ignore tags.

But tags unlock:

- Attribute-Based Access Control (ABAC)
- Cost allocation
- Easier auditing
- Automated governance

Example:
```text
    Project=Payments
    Environment=Production
    Owner=Platform
```
IAM policies can then allow access only to matching resources.

# 9. Regularly Review Unused Permissions

Many roles accumulate permissions over time.

Nobody removes them.

AWS provides:

- IAM Access Analyzer 
- Last Accessed Information 
- CloudTrail logs

Use them regularly.

You'll often discover permissions that haven't been used in years.

# 10. Don't Ignore Service Control Policies (SCPs)

IAM controls what identities can do.

SCPs control what accounts are allowed to do.

Think of SCPs as the organization's guardrails.

Examples: 
- Deny deleting CloudTrail 
- Prevent disabling GuardDuty 
- Block public S3 buckets 
- Restrict regions 
- Prevent root account actions

Even administrators cannot bypass SCPs.

# 11. Use Permission Boundaries for Delegated Administration

Many teams allow platform engineers to create IAM roles.

Without permission boundaries, those engineers could accidentally create roles with unrestricted permissions.

Permission boundaries place an upper limit on what any created role can do.

This is especially useful in large organizations where multiple teams manage AWS resources independently.

# 12. Validate Policies Before Deploying

Writing IAM policies manually often results in excessive permissions or syntax mistakes.

Before attaching a policy:

-   Use the IAM Policy Simulator.
-   Review Access Analyzer findings.
-   Test with least privilege first.
-   Validate infrastructure changes in non-production environments.

Treat IAM changes with the same rigor as application code.

# Common Mistakes I Still See in Production

-   Everyone has AdministratorAccess
-   Hundreds of active access keys
-   IAM users for applications
-   No MFA enforcement
-   Wildcard (`*`) everywhere
-   Shared AWS accounts
-   Unused IAM roles left for years
-   No CloudTrail monitoring
-   Trust policies that allow unintended role assumption
-   No permission boundaries for delegated administrators

# Final Thoughts

IAM isn't just about granting access---it's about limiting the blast
radius when something inevitably goes wrong.

The best IAM setup is one where: 
- Engineers have only the permissions they need. 
- Applications use temporary credentials instead of long-lived secrets. 
- Access is continuously reviewed and tightened over time. 
- Organization-wide guardrails prevent catastrophic mistakes.

Security incidents are often begin with a single overly permissive IAM
policy. Spending time on IAM hygiene today can prevent hours---or
days---of incident response tomorrow.
