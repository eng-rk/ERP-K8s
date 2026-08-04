# Core360 Enterprise AWS Terraform Infrastructure

Enterprise-grade modular Terraform infrastructure for **Core360 ERP** on Amazon Web Services (AWS), complying with the **AWS Well-Architected Framework**, **HashiCorp Module Standards**, and **CIS AWS Foundations Benchmark**.

---

## 1. Directory Structure

```
terraform/
├── main.tf              # AWS Infrastructure Root Module (official terraform-aws-modules)
├── variables.tf         # Input variable definitions & defaults
├── outputs.tf           # Output values (VPC, EKS, ALB, ECR, DocumentDB, ElastiCache)
├── providers.tf         # AWS Provider configuration & default tags
├── versions.tf          # Terraform & AWS provider version constraints
├── backend.tf           # Remote S3 backend configuration
├── locals.tf            # Common tags & local variables
└── terraform.tfvars     # Default production variable values
```

---

## 2. Bootstrap & Deployment Flow

### Step 1: Execute Bootstrap Layer (Run ONCE)
```bash
cd terraform/bootstrap
terraform init
terraform apply -auto-approve
```

### Step 2: Initialize Remote State for Target Environment
```bash
cd ../environments/production
terraform init -backend-config="bucket=<s3_bucket_name>" \
               -backend-config="key=production/terraform.tfstate" \
               -backend-config="region=us-east-1" \
               -backend-config="dynamodb_table=core360-tf-locks"
```

### Step 3: Plan and Apply Infrastructure Execution Plan
```bash
../../scripts/terraform-plan.sh production
../../scripts/terraform-apply.sh production
```

---

## 3. Required GitHub Configuration

### Required GitHub Secrets (`Settings > Secrets and variables > Actions > Secrets`)
- `AWS_ROLE_TO_ASSUME`: `arn:aws:iam::<account-id>:role/core360-github-actions-role-production`

### Required GitHub Variables (`Settings > Secrets and variables > Actions > Variables`)
- `AWS_REGION`: `us-east-1`
- `EKS_CLUSTER_NAME`: `core360-prod-eks`
- `KUBE_NAMESPACE`: `core360-production`

---

## 4. Operational Rollback Workflow
- **Application Deployment**: `kubectl rollout undo deployment/backend-deployment -n core360-production`
- **Terraform Infrastructure**: Revert git release tag and re-apply approved `tfplan` artifact.
