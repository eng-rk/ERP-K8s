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

# KMS Key Module
module "kms" {
  source       = "../../modules/kms"
  project_name = var.project_name
  environment  = var.environment
  tags         = local.common_tags
}

# VPC Module
module "vpc" {
  source                   = "../../modules/vpc"
  project_name             = var.project_name
  environment              = var.environment
  vpc_cidr                 = var.vpc_cidr
  availability_zones       = var.availability_zones
  public_subnet_cidrs      = var.public_subnet_cidrs
  private_app_subnet_cidrs = var.private_app_subnet_cidrs
  private_db_subnet_cidrs  = var.private_db_subnet_cidrs
  single_nat_gateway       = true
  eks_cluster_name         = local.eks_cluster_name
  tags                     = local.common_tags
}

# Security Groups Module
module "security_groups" {
  source       = "../../modules/security-groups"
  project_name = var.project_name
  environment  = var.environment
  vpc_id       = module.vpc.vpc_id
  tags         = local.common_tags
}

# IAM Module
module "iam" {
  source            = "../../modules/iam"
  project_name      = var.project_name
  environment       = var.environment
  github_repository = var.github_repository
  tags              = local.common_tags
}

# ECR Module
module "ecr" {
  source       = "../../modules/ecr"
  project_name = var.project_name
  environment  = var.environment
  kms_key_arn  = module.kms.key_arn
  tags         = local.common_tags
}

# EKS Module
module "eks" {
  source             = "../../modules/eks"
  project_name       = var.project_name
  environment        = var.environment
  cluster_version    = "1.30"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_app_subnet_ids
  cluster_role_arn   = module.iam.eks_cluster_role_arn
  node_role_arn      = module.iam.eks_node_group_role_arn
  kms_key_arn        = module.kms.key_arn
  instance_types     = ["t3.medium", "m6i.large"]
  desired_capacity   = 2
  min_size           = 2
  max_size           = 4
  capacity_type      = "ON_DEMAND"
  tags               = local.common_tags
}

# Route53 Module
module "route53" {
  source       = "../../modules/route53"
  domain_name  = var.domain_name
  alb_dns_name = module.alb.alb_dns_name
  alb_zone_id  = module.alb.alb_zone_id
  tags         = local.common_tags
}

# ACM Module
module "acm" {
  source      = "../../modules/acm"
  domain_name = var.domain_name
  zone_id     = module.route53.zone_id
  tags        = local.common_tags
}

# ALB Module
module "alb" {
  source                = "../../modules/alb"
  project_name          = var.project_name
  environment           = var.environment
  vpc_id                = module.vpc.vpc_id
  public_subnet_ids     = module.vpc.public_subnet_ids
  alb_security_group_id = module.security_groups.alb_security_group_id
  certificate_arn       = module.acm.certificate_arn
  tags                  = local.common_tags
}

# WAF Module
module "waf" {
  source       = "../../modules/waf"
  project_name = var.project_name
  environment  = var.environment
  alb_arn      = module.alb.alb_arn
  tags         = local.common_tags
}

# External Secrets Module
module "external_secrets" {
  source            = "../../modules/external-secrets"
  project_name      = var.project_name
  environment       = var.environment
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
  kms_key_arn       = module.kms.key_arn
  tags              = local.common_tags
}

# Monitoring Module
module "monitoring" {
  source             = "../../modules/monitoring"
  project_name       = var.project_name
  environment        = var.environment
  eks_cluster_name   = module.eks.cluster_name
  alb_arn            = module.alb.alb_arn
  alarm_email        = var.alarm_email
  log_retention_days = 30
  tags               = local.common_tags
}
