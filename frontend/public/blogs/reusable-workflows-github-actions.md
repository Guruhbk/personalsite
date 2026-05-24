---
title:  Reusable Workflows in GitHub Actions
date: May 24, 2026
author: Guru Prasanth E
category: CI/CD
tags: [CI/CD, DevOps, GitHub-Actions]
excerpt: Reusable Workflows in GitHub Actions help eliminate duplicate CI/CD pipelines across repositories by centralizing common workflow logic. They improve maintainability, consistency, and scalability by allowing workflows to be reused across projects using workflow_call.
image: https://www.soluforce.com/about-us/news/SoluForce-Reaching-the-Next-Level-of-Reusability/_jcr_content/root/media_copy_152807173/item/image.imgTransformer/media_16to10/md-2/1710423921924/2112SF_Reusable-Pipe-Systems_fittings%20(3).jpg
---

> Reusable Workflows in GitHub Actions help eliminate duplicate CI/CD pipelines across repositories by centralizing common workflow logic. They improve maintainability, consistency, and scalability by allowing workflows to be reused across projects using workflow_call.


# Reusable Workflows in GitHub Actions

When working in an organization with hundreds of repositories, one common problem is duplication in CI/CD pipelines. Almost every repository needs to:

- Build the application
- Run tests
- Build Docker images
- Push images to a registry
- Deploy the application

If every repository maintains its own workflow YAML files, managing updates becomes difficult. A small change in the CI process may require updating hundreds of repositories.

To solve this problem, GitHub Actions provides **Reusable Workflows**.

Code examples used in this blog:

- https://github.com/Guruhbk/reusable-workflow-demo
- https://github.com/Guruhbk/workflow-differentrepo-demo

---

# What is a Reusable Workflow?

A reusable workflow is a GitHub Actions workflow that can be called from another workflow.

Instead of duplicating CI/CD logic across repositories, you can create a centralized workflow and reuse it everywhere.

Reusable workflows:
- Reduce duplication
- Improve maintainability
- Standardize CI/CD pipelines
- Simplify updates across repositories

Reusable workflows are normal workflow YAML files stored under:

```yaml
.github/workflows/
```

For a workflow to become reusable, it must include:

```yaml
on:
  workflow_call:
```

---

# Creating a Reusable Workflow

Below is an example reusable workflow that builds and pushes a Docker image.

File location:

```yaml
.github/workflows/reusable-ci.yaml
```

---

## Defining Inputs and Secrets

Reusable workflows can accept:
- Inputs
- Secrets

These values are passed from the caller workflow.

Example:

```yaml
on:
  workflow_call:
    inputs:
      image_name:
        required: true
        type: string

      registry:
        required: false
        type: string
        default: guruhbk

      context:
        required: false
        type: string
        default: .

      docker_path:
        required: false
        type: string
        default: .

      image_tag:
        required: true
        type: string
        default: latest

      push_image:
        required: false
        type: boolean
        default: true

    secrets:
      registry_username:
        required: true

      registry_password:
        required: true
```

---

# Complete Reusable Workflow Example

Repository:

https://github.com/Guruhbk/reusable-workflow-demo

File:

```yaml
name: Reusable CI

on:
  workflow_call:
    inputs:
      image_name:
        required: true
        type: string

      registry:
        required: false
        type: string
        default: guruhbk

      context:
        required: false
        type: string
        default: .

      docker_path:
        required: false
        type: string
        default: .

      image_tag:
        required: true
        type: string
        default: latest

      push_image:
        required: false
        type: boolean
        default: true

    secrets:
      registry_username:
        required: true

      registry_password:
        required: true

jobs:
  docker-build:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      packages: write

    outputs:
      image: ${{ steps.meta.outputs.image }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set image metadata
        id: meta
        run: |
          IMAGE="${{ inputs.registry }}/${{ inputs.image_name }}:${{ inputs.image_tag }}"
          echo "image=$IMAGE" >> $GITHUB_OUTPUT

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.registry_username }}
          password: ${{ secrets.registry_password }}

      - name: Docker build and push
        uses: docker/build-push-action@v6
        with:
          context: ${{ inputs.context }}
          file: ${{ inputs.docker_path }}/Dockerfile
          push: ${{ inputs.push_image }}
          tags: ${{ steps.meta.outputs.image }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

# Calling a Reusable Workflow

Reusable workflows can be called in two ways:

1. From the same repository
2. From a different repository

---

# Calling a Reusable Workflow from the Same Repository

If the reusable workflow exists in the same repository, use:

```yaml
uses: ./.github/workflows/reusable-ci.yaml
```

Example:

```yaml
name: Application Build

on:
  push:
    branches:
      - main

permissions:
  contents: read
  packages: write

jobs:
  docker:
    uses: ./.github/workflows/reusable-ci.yaml

    with:
      image_name: reusable-workflow
      image_tag: ${{ github.sha }}

    secrets:
      registry_username: ${{ secrets.REGISTRY_USERNAME }}
      registry_password: ${{ secrets.REGISTRY_PASSWORD }}
```

Repository:

https://github.com/Guruhbk/reusable-workflow-demo

---

# Calling a Reusable Workflow from a Different Repository

If the reusable workflow exists in another repository, use:

```yaml
uses: owner/repository/.github/workflows/workflow-file.yaml@ref
```

Example:

```yaml
uses: guruhbk/reusable-workflow-demo/.github/workflows/reusable-ci.yaml@v1
```

Important:
- The `@ref` is mandatory when using workflows from another repository
- The ref can be:
  - Branch name
  - Tag
  - Commit SHA

Using tags is usually recommended for stability.

Example caller workflow:

```yaml
name: Application Build

on:
  push:
    branches:
      - main

permissions:
  contents: read
  packages: write

jobs:
  docker:
    uses: guruhbk/reusable-workflow-demo/.github/workflows/reusable-ci.yaml@v1

    with:
      image_name: reusable-workflow
      image_tag: ${{ github.sha }}

    secrets:
      registry_username: ${{ secrets.REGISTRY_USERNAME }}
      registry_password: ${{ secrets.REGISTRY_PASSWORD }}
```

Repository:

https://github.com/Guruhbk/workflow-differentrepo-demo

---

# Understanding Permissions

One common issue while using reusable workflows is permissions mismatch.

For example, you may encounter errors like:

```text
The nested job 'docker-build' is requesting 'packages: write',
but is only allowed 'packages: read'
```

This happens because reusable workflows cannot automatically elevate permissions.

The caller workflow must explicitly provide the required permissions.

Example:

```yaml
permissions:
  contents: read
  packages: write
```

If the reusable workflow requires:
- `packages: write`
- `id-token: write`
- `pull-requests: write`

then the caller workflow must also grant them.

---

# Versioning Best Practices

When reusable workflows are shared across repositories, versioning becomes important.

Recommended approaches:

## Use Tags

```yaml
uses: guruhbk/reusable-workflow-demo/.github/workflows/reusable-ci.yaml@v1
```

Advantages:
- Stable
- Easy to upgrade
- Safe for production usage

---

## Use Commit SHA for Maximum Stability

```yaml
uses: guruhbk/reusable-workflow-demo/.github/workflows/reusable-ci.yaml@8e691a436d7edf89649ac79b091192edac6913d0
```

Advantages:
- Immutable
- Fully reproducible builds

Disadvantage:
- Harder to manage manually

---

# Benefits of Reusable Workflows

Reusable workflows provide several advantages:

- Centralized CI/CD management
- Reduced duplication
- Easier maintenance
- Consistent build pipelines
- Faster onboarding for new repositories
- Standardized security practices
- Simplified Docker build pipelines

---

# Final Thoughts

Reusable workflows are one of the most powerful features in GitHub Actions for scaling CI/CD across multiple repositories.

Instead of copying workflow YAML files everywhere, you can maintain a single reusable workflow and consume it across teams and repositories.

As organizations grow, reusable workflows help enforce:
- Standardization
- Security
- Maintainability
- Faster development workflows

If you're managing multiple repositories, adopting reusable workflows early can save a significant amount of operational effort later.
