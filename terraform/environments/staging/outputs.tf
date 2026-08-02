output "aws_account_id" {
  description = "AWS Account ID"
  value       = module.iam.github_oidc_provider_arn != "" ? element(split(":", module.iam.github_oidc_provider_arn), 4) : ""
}

output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}

output "eks_cluster_name" {
  description = "Amazon EKS Cluster Name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Amazon EKS Kubernetes Control Plane Endpoint"
  value       = module.eks.cluster_endpoint
}

output "oidc_provider_arn" {
  description = "IAM OIDC Provider ARN"
  value       = module.eks.oidc_provider_arn
}

output "github_actions_role_arn" {
  description = "IAM Role ARN for GitHub Actions OIDC"
  value       = module.iam.github_actions_role_arn
}

output "ecr_backend_repository_url" {
  description = "Amazon ECR Repository URL for Backend"
  value       = module.ecr.backend_repository_url
}

output "ecr_frontend_repository_url" {
  description = "Amazon ECR Repository URL for Frontend"
  value       = module.ecr.frontend_repository_url
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of Public Subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of Private Application Subnet IDs"
  value       = module.vpc.private_app_subnet_ids
}

output "database_subnet_ids" {
  description = "List of Private Database Subnet IDs"
  value       = module.vpc.private_db_subnet_ids
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Name"
  value       = module.alb.alb_dns_name
}

output "prometheus_workspace_id" {
  description = "Amazon Managed Prometheus Workspace ID"
  value       = module.prometheus_grafana.prometheus_workspace_id
}

output "grafana_endpoint" {
  description = "Amazon Managed Grafana Workspace Endpoint URL"
  value       = module.prometheus_grafana.grafana_endpoint
}

