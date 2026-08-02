# Core360 Enterprise AWS Terraform Infrastructure

Enterprise-grade modular Terraform infrastructure for **Core360 ERP** on Amazon Web Services (AWS), complying with the **AWS Well-Architected Framework**, **HashiCorp Module Standards**, and **CIS AWS Foundations Benchmark**.

---

## 1. Directory Structure

```
terraform/
├── bootstrap/                          # Dedicated Local-State Bootstrap (Run ONCE by Admin)
│   ├── main.tf, variables.tf, outputs.tf, versions.tf, README.md
├── modules/                            # Reusable Infrastructure Modules
│   ├── vpc/                            # Multi-AZ VPC, Subnets, IGW, NAT, Route Tables
│   ├── security-groups/                # Security Groups for ALB, EKS, Worker Nodes, DB
│   ├── iam/                            # OIDC Provider, Roles, IRSA Policies
│   ├── kms/                            # KMS Customer Managed Keys
│   ├── ecr/                            # Repositories for core360-backend & core360-frontend
│   ├── eks/                            # Managed EKS Cluster, Node Groups, OIDC Provider
│   ├── alb/                            # Application Load Balancer, Target Groups, Listeners
│   ├── route53/                        # Route53 DNS Zones & Record Sets
│   ├── acm/                            # AWS Certificate Manager SSL/TLS Certificates
│   ├── waf/                            # AWS WAF v2 Web ACL Rules
│   ├── external-secrets/               # External Secrets Operator Helm & IRSA Setup
│   └── monitoring/                     # CloudWatch Logs, Alarms, Container Insights, SNS
├── environments/                       # Environment Deployments
│   ├── dev/                            # Development environment root
│   ├── staging/                        # Staging environment root
│   └── production/                     # Production environment root
├── scripts/                            # Operational Helper Scripts
│   ├── terraform-init.sh
│   ├── terraform-plan.sh
│   ├── terraform-apply.sh
│   └── terraform-destroy.sh
├── policies/                           # Security & IAM Policy Documents
├── docs/                               # Operational Specifications & Diagrams
└── examples/                           # Module Usage Examples
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
