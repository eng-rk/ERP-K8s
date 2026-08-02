# Core360 Enterprise CI/CD — Required GitHub Secrets & Variables Documentation (100% AWS Native)

To enable automated Amazon ECR container image publishing, Amazon EKS zero-downtime rolling deployments, and automated health checks via **Keyless GitHub Actions OIDC**, configure the following variables and secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

---

## 1. AWS OpenID Connect (OIDC) Authentication Secrets & Variables

| Name | Type | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- | :--- |
| `AWS_ROLE_TO_ASSUME` | **Secret** | IAM Role ARN created for GitHub Actions OIDC trust relationship (`aws-actions/configure-aws-credentials`). | `arn:aws:iam::123456789012:role/core360-github-actions-role-production` | **Yes** |
| `AWS_REGION` | Variable / Secret | Target AWS Region hosting Amazon ECR and Amazon EKS cluster. | `us-east-1` | Optional (Defaults to `us-east-1`) |

---

## 2. Amazon EKS Cluster Deployment Variables

| Name | Type | Description | Example / Format | Required |
| :--- | :--- | :--- | :--- | :--- |
| `EKS_CLUSTER_NAME` | Variable / Secret | Name of the provisioned Amazon EKS managed Kubernetes cluster. | `core360-eks-production` | Optional (Defaults to `core360-eks-production`) |
| `KUBE_NAMESPACE` | Variable / Secret | Target Kubernetes namespace for Core360 workloads. | `super-erp` | Optional (Defaults to `super-erp`) |
| `ENVIRONMENT_URL` | **Variable** | Public environment URL for GitHub Deployment badges and health reporting. | `http://core360.example.com` | Optional (Defaults to `http://localhost`) |

---

> [!IMPORTANT]
> **Keyless OIDC Security**: This project does **NOT** require or recommend static `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`. GitHub Actions authenticates securely via short-lived STS tokens issued through `aws-actions/configure-aws-credentials@v4` and the GitHub IAM OIDC Provider.
