# Core360 Infrastructure Bootstrap Layer

This directory contains the **one-time bootstrap layer** responsible for initializing the AWS remote backend infrastructure (S3 State Bucket, DynamoDB Lock Table, KMS Encryption Key).

## Operational Workflow

> [!IMPORTANT]
> This bootstrap is executed **ONLY ONCE** by an Infrastructure Administrator using local state (`terraform.tfstate`). It is **never** executed as part of standard GitHub Actions CI/CD pipelines.

### Initialization Steps
```bash
# 1. Navigate to bootstrap directory
cd terraform/bootstrap

# 2. Initialize local Terraform state
terraform init

# 3. Provision remote state infrastructure
terraform apply -auto-approve

# 4. Copy S3 bucket name and DynamoDB table name from outputs
```
