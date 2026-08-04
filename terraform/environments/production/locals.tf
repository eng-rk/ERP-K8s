locals {
  common_tags = {
    Project     = "Core360"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "DevOps"
    CostCenter  = "Core360"
    Application = "ERP"
  }

  eks_cluster_name = "${var.project_name}-${var.environment}-eks"
}
