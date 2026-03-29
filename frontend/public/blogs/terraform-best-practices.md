---
title: Infrastructure as Code: Terraform Best Practices
date: November 10, 2024
author: Guru Prasanth E
excerpt: Lessons learned from managing multi-environment infrastructure with Terraform. Discover patterns for reusable modules, remote state management, and CI/CD integration.
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800
---

# Infrastructure as Code: Terraform Best Practices

After years of managing infrastructure with Terraform across multiple environments and cloud providers, I've compiled a set of best practices that have proven invaluable.

## Module Design Principles

### 1. Keep Modules Focused

Each module should have a single responsibility:

```hcl
# Good: Focused VPC module
module "vpc" {
  source = "./modules/vpc"
  
  cidr_block           = "10.0.0.0/16"
  availability_zones   = ["us-east-1a", "us-east-1b"]
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
}
```

### 2. Use Semantic Versioning for Modules

Version your modules and use specific versions in production:

```hcl
module "eks" {
  source  = "git::https://github.com/company/terraform-modules.git//eks?ref=v2.1.0"
  # ...
}
```

## State Management

### Remote State is Non-Negotiable

Always use remote state for team collaboration:

```hcl
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "production/vpc/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

### State Locking

Use DynamoDB for state locking to prevent concurrent modifications:

```bash
aws dynamodb create-table \
  --table-name terraform-locks \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

## Variable Management

### Use tfvars Files for Different Environments

```hcl
# production.tfvars
environment     = "production"
instance_type   = "t3.large"
min_size        = 3
max_size        = 10

# staging.tfvars
environment     = "staging"
instance_type   = "t3.medium"
min_size        = 1
max_size        = 3
```

### Validate Variables

```hcl
variable "environment" {
  type        = string
  description = "Environment name"
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Terraform

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        
      - name: Terraform Init
        run: terraform init
        
      - name: Terraform Validate
        run: terraform validate
        
      - name: Terraform Plan
        run: terraform plan -out=tfplan
        
      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan
```

## Security Best Practices

### 1. Never Commit Secrets

Use external secret management:

```hcl
data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "production/database/password"
}

resource "aws_db_instance" "main" {
  password = data.aws_secretsmanager_secret_version.db_password.secret_string
  # ...
}
```

### 2. Use tfsec for Security Scanning

```bash
tfsec . --format json --out tfsec-results.json
```

## Cost Optimization

### Tag Everything

```hcl
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    CostCenter  = var.cost_center
    Team        = var.team
  }
}

resource "aws_instance" "web" {
  tags = merge(
    local.common_tags,
    {
      Name = "web-server"
    }
  )
}
```

## Testing

### Use Terratest for Integration Testing

```go
func TestTerraformVPC(t *testing.T) {
    terraformOptions := &terraform.Options{
        TerraformDir: "../examples/vpc",
    }

    defer terraform.Destroy(t, terraformOptions)
    terraform.InitAndApply(t, terraformOptions)

    vpcId := terraform.Output(t, terraformOptions, "vpc_id")
    assert.NotEmpty(t, vpcId)
}
```

## Documentation

### Use terraform-docs

Automatically generate documentation:

```bash
terraform-docs markdown table . > README.md
```

## Conclusion

Terraform is powerful but requires discipline:

1. **Modularize** your code
2. **Version** everything
3. **Test** before applying
4. **Document** thoroughly
5. **Secure** by default

Following these practices will lead to maintainable, scalable infrastructure that your team can confidently manage.