output "aws_region" {
  description = "AWS Region"
  value       = var.aws_region
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of Public Subnet IDs"
  value       = module.vpc.public_subnets
}

output "private_subnet_ids" {
  description = "List of Private Application Subnet IDs"
  value       = module.vpc.private_subnets
}

output "database_subnet_ids" {
  description = "List of Private Database Subnet IDs"
  value       = module.vpc.database_subnets
}

output "eks_cluster_name" {
  description = "Amazon EKS Cluster Name"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Amazon EKS Kubernetes Control Plane Endpoint"
  value       = module.eks.cluster_endpoint
}

output "ecr_backend_repository_url" {
  description = "Amazon ECR Repository URL for Backend"
  value       = module.ecr_backend.repository_url
}

output "ecr_frontend_repository_url" {
  description = "Amazon ECR Repository URL for Frontend"
  value       = module.ecr_frontend.repository_url
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS Name"
  value       = module.alb.dns_name
}

output "documentdb_endpoint" {
  description = "DocumentDB Cluster Endpoint"
  value       = module.documentdb.endpoint
}

output "elasticache_endpoint" {
  description = "ElastiCache Redis Primary Endpoint"
  value       = module.elasticache.replication_group_primary_endpoint_address
}
