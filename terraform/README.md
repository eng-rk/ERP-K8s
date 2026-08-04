# Core360 Enterprise AWS Terraform Infrastructure

<!-- CI/CD Validation Trigger: 2026-08-04 -->

Enterprise-grade modular Terraform infrastructure for **Core360 ERP** on Amazon Web Services (AWS), complying with the **AWS Well-Architected Framework**, **HashiCorp Module Standards**, and **CIS AWS Foundations Benchmark**.

---

## 1. Directory Structure

```
terraform/
└── environments/
    ├── dev/
    │   ├── main.tf           # Official terraform-aws-modules configuration (dev)
    │   ├── variables.tf
    │   ├── outputs.tf
    │   ├── providers.tf
    │   ├── versions.tf
    │   ├── backend.tf
    │   ├── locals.tf
    │   └── terraform.tfvars
    ├── staging/
    │   ├── main.tf           # Official terraform-aws-modules configuration (staging)
    │   ├── variables.tf
    │   ├── outputs.tf
    │   ├── providers.tf
    │   ├── versions.tf
    │   ├── backend.tf
    │   ├── locals.tf
    │   └── terraform.tfvars
    └── production/
        ├── main.tf           # Official terraform-aws-modules configuration (prod)
        ├── variables.tf
        ├── outputs.tf
        ├── providers.tf
        ├── versions.tf
        ├── backend.tf
        ├── locals.tf
        └── terraform.tfvars
```

---

## 2. Infrastructure Modules Used (Terraform Registry)

- **VPC**: `terraform-aws-modules/vpc/aws` (v5.18.1)
- **EKS**: `terraform-aws-modules/eks/aws` (v20.33.1)
- **ALB**: `terraform-aws-modules/alb/aws` (v9.13.0)
- **ECR**: `terraform-aws-modules/ecr/aws` (v2.3.0)
- **Security Groups**: `terraform-aws-modules/security-group/aws` (v5.3.0)
- **KMS**: `terraform-aws-modules/kms/aws` (v3.1.1)
- **DocumentDB**: `cloudposse/documentdb-cluster/aws` (v0.28.0)
- **ElastiCache**: `terraform-aws-modules/elasticache/aws` (v1.4.1)
