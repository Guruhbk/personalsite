---
title: Terraform Security Gates with Checkov
date: June 06, 2026
author: Guru Prasanth E
category: IaC
tags:  ["IaC", "Terraform"]
excerpt: Shift Terraform security left by integrating Checkov scans, custom compliance policies, and GitHub branch protection to automatically block non-compliant infrastructure changes.
image: /images/terraform/terraform_security.jpg
---

> Shift Terraform security left by integrating Checkov scans, custom compliance policies, and GitHub branch protection to automatically block non-compliant infrastructure changes.

## Introduction

Infrastructure as Code (IaC) has fundamentally changed how cloud infrastructure is provisioned and managed. Teams can now deploy environments in minutes using reusable and version-controlled configurations.

However, this speed also introduces risk.

Without proper security validation and governance, insecure Terraform configurations can easily reach production environments through Pull Requests and CI/CD pipelines.

One of the most effective ways to reduce this risk is to enforce security validation directly during the Pull Request workflow before infrastructure changes are merged.

In this article, I’ll walk through how to build a lightweight but highly effective DevSecOps workflow using:

- Terraform
- Checkov
- Custom YAML policies
- GitHub Actions
- GitHub Branch Protection Rules

The objective is to establish automated Policy-as-Code enforcement for Infrastructure as Code while keeping the implementation:

- Simple
- Maintainable
- Fully free to operate
- Easy to integrate into existing workflows

The solution enforces:

- Security group restrictions
- S3 security best practices
- Mandatory tagging standards
- Pull Request merge blocking for failed scans

By the end of this blog, you will have a complete Policy-as-Code workflow where Terraform changes are automatically validated during Pull Requests and insecure infrastructure changes are prevented from being merged.

---

# Why Checkov?

Checkov is an Infrastructure as Code security scanner developed by Bridgecrew (Prisma Cloud).

It provides static analysis for:

- Terraform
- Kubernetes manifests
- GitHub Actions
- Dockerfiles
- CloudFormation
- Helm charts
- ARM templates

Unlike traditional compliance tooling that operates after deployment, Checkov shifts security validation left into the development workflow itself.

This allows teams to identify:

- Publicly exposed resources
- Missing encryption
- Weak IAM configurations
- Overly permissive security groups
- Compliance violations

before infrastructure is provisioned.

---

# GitHub Repository

Complete examples and workflow used in this article can be found here:

```text
https://github.com/Guruhbk/terraform-checkov-scan.git
```

---

# Installing Checkov

For local installation instructions, follow the official Checkov documentation.

Common installation methods:

## Using pip

```bash
pip install checkov
```

## Verify Installation

```bash
checkov --version
```

---

# Example Vulnerable Terraform Configuration

The following Terraform intentionally violates multiple security controls and provides a good example of how Checkov detects insecure infrastructure definitions.

<div style="max-height: 500px; overflow-y: auto;">

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "bad_bucket" {
  bucket = "guru-demo-checkov-bucket"

  tags = {
    Environment = "dev"
  }
}

resource "aws_security_group" "bad_sg" {
  name        = "allow-all"
  description = "Allow everything"

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

</div>

---

# Running Checkov

To scan all Terraform files inside a directory:

```bash
checkov -d . --framework terraform
```

This command recursively scans all Terraform files within the current directory.

---

# Example Scan Results

The above Terraform configuration generates multiple security violations.

<div style="max-height: 1000px; overflow-y: auto;">

```text
terraform scan results:

Passed checks: 5, Failed checks: 14, Skipped checks: 0

Check: CKV_AWS_93: "Ensure S3 bucket policy does not lockout all but root user. (Prevent lockouts needing root account fixes)"
        PASSED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_41: "Ensure no hard coded AWS access key and secret key exists in provider"
        PASSED for resource: aws.default

Check: CKV_AWS_20: "S3 Bucket has an ACL defined which allows public READ access."
        PASSED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_57: "S3 Bucket has an ACL defined which allows public WRITE access."
        PASSED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_19: "Ensure all data stored in the S3 bucket is securely encrypted at rest"
        PASSED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_23
Ensure every security group and rule has a description
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_382
Ensure no security groups allow egress from 0.0.0.0:0 to port -1
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_24
Ensure no security groups allow ingress from 0.0.0.0:0 to port 22
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_25
Ensure no security groups allow ingress from 0.0.0.0:0 to port 3389
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_260
Ensure no security groups allow ingress from 0.0.0.0:0 to port 80
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_277
Ensure security groups do not allow all traffic on all ports
FAILED for resource: aws_security_group.bad_sg

Check: CKV2_AWS_62
Ensure S3 buckets should have event notifications enabled
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV2_AWS_6
Ensure that S3 bucket has a Public Access block
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV2_AWS_61
Ensure that an S3 bucket has a lifecycle configuration
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV2_AWS_5
Ensure that Security Groups are attached to another resource
FAILED for resource: aws_security_group.bad_sg

Check: CKV_AWS_18
Ensure the S3 bucket has access logging enabled
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_144
Ensure that S3 bucket has cross-region replication enabled
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_21
Ensure all data stored in the S3 bucket have versioning enabled
FAILED for resource: aws_s3_bucket.bad_bucket

Check: CKV_AWS_145
Ensure that S3 buckets are encrypted with KMS by default
FAILED for resource: aws_s3_bucket.bad_bucket
```

</div>

As we can see, Checkov immediately identifies:

- Publicly exposed security groups
- Missing S3 encryption
- Missing versioning
- Lack of public access blocks
- Overly permissive network rules

This provides immediate visibility into insecure Terraform configurations before deployment.

---

# Reducing Noise with `.checkov.yaml`

Checkov ships with a very large set of policies covering multiple governance and compliance frameworks.

While this is extremely useful for enterprise environments, scanning every available policy may create unnecessary noise for smaller teams.

Instead, we can selectively enforce only critical and high-risk checks.

Create a `.checkov.yaml` file:

<div style="max-height: 400px; overflow-y: auto;">

```yaml
framework:
  - terraform

check:
  # S3
  - CKV_AWS_21
  - CKV_AWS_145
  - CKV2_AWS_6
  - CKV_AWS_20
  - CKV_AWS_57

  # Security Groups
  - CKV_AWS_24
  - CKV_AWS_25
  - CKV_AWS_277
```

</div>

Now rerun the scan:

```bash
checkov -d . --framework terraform
```

The output becomes significantly cleaner and focused only on critical findings.

```text
Passed checks: 2
Failed checks: 6
Skipped checks: 0
```

This approach helps teams:

- Focus on high-risk violations
- Reduce alert fatigue
- Improve adoption among developers
- Simplify governance implementation

---

# Implementing Custom Policies

Default Checkov policies cover most enterprise governance requirements.

However, organizations often need additional custom validations.

A common example is enforcing mandatory tagging standards for:

- Cost allocation
- Ownership tracking
- Resource governance
- Environment identification

---

# Creating a Custom Policy

Create a directory named:

```text
custom-policies
```

Inside it, create a file named:

```text
required-tags.yaml
```

Add the following custom policy:

<div style="max-height: 700px; overflow-y: auto;">

```yaml
metadata:
  id: "CUSTOM_AWS_TAGS_001"
  name: "Ensure required tags are present"
  category: "CONVENTION"

definition:
  and:
    - cond_type: attribute
      resource_types:
        - aws_s3_bucket
        - aws_security_group
        - aws_instance
        - aws_ebs_volume
        - aws_subnet
        - aws_vpc
        - aws_nat_gateway
        - aws_lb
      attribute: "tags.Environment"
      operator: "exists"

    - cond_type: attribute
      resource_types:
        - aws_s3_bucket
        - aws_security_group
        - aws_instance
        - aws_ebs_volume
        - aws_subnet
        - aws_vpc
        - aws_nat_gateway
        - aws_lb
      attribute: "tags.Owner"
      operator: "exists"

    - cond_type: attribute
      resource_types:
        - aws_s3_bucket
        - aws_security_group
        - aws_instance
        - aws_ebs_volume
        - aws_subnet
        - aws_vpc
        - aws_nat_gateway
        - aws_lb
      attribute: "tags.Project"
      operator: "exists"
```

</div>

---

# Important Notes About Custom Policies

- Each custom policy should typically exist in a separate YAML file
- Custom policies are not automatically loaded by `.checkov.yaml`
- You must explicitly pass the custom policy directory during execution

---

# Running Checkov with Custom Policies

Use the following command:

```bash
checkov -d . \
  --framework terraform \
  --external-checks-dir custom-policies
```

If you are also using `.checkov.yaml`, ensure the custom policy ID is included:

```yaml
check:
  - CUSTOM_AWS_TAGS_001
```

Otherwise, the policy may not execute.

---

# Skipping a Specific Resource

In real-world scenarios, exceptions are sometimes necessary.

For example:

- A public S3 bucket may be intentionally used for static website hosting
- A temporary security exception may exist during migration
- A legacy workload may require a temporary policy exemption

Checkov allows resource-level exceptions using inline skip comments.

Example:

```hcl
resource "aws_s3_bucket" "test" {

  #checkov:skip=CKV_AWS_21:Public access required for static website hosting

  bucket = "my-webhosting-bucket"
}
```

Important rules:

- The skip comment must exist inside the resource block
- The comment should be placed near the top of the resource
- Always include a meaningful justification

This allows controlled exceptions while preserving governance visibility.

---

# Automating Scans with GitHub Actions

To shift security validation directly into the Pull Request workflow, we can integrate Checkov into GitHub Actions.

Create the following workflow file:

```text
.github/workflows/checkov-scan.yml
```

---

# GitHub Actions Workflow

<div style="max-height: 500px; overflow-y: auto;">

```yaml
name: Checkov Scan

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  checkov:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Run Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: ./compliant
          framework: terraform
          external_checks_dirs: custom-policies
```

</div>

This workflow automatically executes:

- Terraform security scans
- Custom YAML policy validation

During:

- Pull Requests
- Pushes to the `main` branch

This ensures infrastructure validation becomes part of the CI/CD pipeline.

---

# Enforcing Pull Request Merge Blocking

Scanning infrastructure code is valuable only if failures actively prevent insecure changes from being merged.

To enforce this, GitHub Branch Protection Rules can require successful Checkov scans before Pull Requests are merged.

---

# Configuring Branch Protection Rules

Navigate to:

```text
Repository
→ Settings
→ Branches
→ Branch Protection Rules
```

Create or update the protection rule for the `main` branch.

Recommended settings:

- Require a pull request before merging
- Require approvals
- Require status checks to pass before merging
- Require branches to be up to date before merging

---

# Selecting the Checkov Status Check

After the GitHub Actions workflow runs successfully at least once on the `main` branch, GitHub automatically registers the workflow job as a selectable status check.

Depending on your workflow naming convention, the status check may appear as:

```text
Checkov Scan / checkov
```

or:

```text
checkov
```

This ensures:

- Failed scans block merges
- Insecure Terraform changes cannot be merged into protected branches
- Policy enforcement becomes mandatory instead of optional

---

# Important GitHub Behavior

A common implementation detail often missed:

GitHub does not use the workflow filename as the status check identifier.

Instead, the status check name is derived from:

- Workflow name
- Job name

Example:

```yaml
name: Checkov Scan

jobs:
  checkov:
```

GitHub internally generates:

```text
Checkov Scan / checkov
```

This becomes the enforceable status check inside branch protection rules.

---

# Final Enforcement Flow

The resulting DevSecOps workflow becomes:

```text
Terraform Changes
        ↓
Pull Request
        ↓
GitHub Actions
        ↓
Checkov Security Scan
        ↓
Custom Policy Validation
        ↓
Branch Protection Enforcement
        ↓
Secure Merge Approval
```

This creates a lightweight but highly effective Policy-as-Code implementation capable of preventing insecure infrastructure from reaching protected branches.

---

# Conclusion

By integrating Checkov directly into Pull Request workflows, organizations can significantly improve infrastructure security posture without introducing heavyweight governance tooling.

This approach provides:

- Early security validation
- Automated policy enforcement
- Consistent infrastructure governance
- Reduced operational risk
- Developer-friendly DevSecOps adoption

Most importantly, it enables teams to prevent insecure Terraform configurations from reaching production environments while keeping the workflow simple, scalable, and maintainable.

