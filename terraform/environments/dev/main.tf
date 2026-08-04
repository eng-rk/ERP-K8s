# VPC Module using official registry module
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.18.1"

  name = "${var.project_name}-${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs              = var.availability_zones
  public_subnets   = var.public_subnet_cidrs
  private_subnets  = var.private_app_subnet_cidrs
  database_subnets = var.private_db_subnet_cidrs

  enable_nat_gateway     = true
  single_nat_gateway     = true
  one_nat_gateway_per_az = false

  enable_dns_hostnames = true
  enable_dns_support   = true

  public_subnet_tags = {
    "kubernetes.io/role/elb"                          = "1"
    "kubernetes.io/cluster/${local.eks_cluster_name}" = "shared"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"                 = "1"
    "kubernetes.io/cluster/${local.eks_cluster_name}" = "shared"
  }

  tags = local.common_tags
}

# KMS Module using official registry module
module "kms" {
  source  = "terraform-aws-modules/kms/aws"
  version = "3.1.1"

  description             = "KMS Key for Core360 ${var.environment} encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  aliases = ["alias/${var.project_name}-${var.environment}"]

  tags = local.common_tags
}

# Security Groups using official registry module
module "alb_security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.3.0"

  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress_with_cidr_blocks = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      description = "HTTP"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      description = "HTTPS"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  egress_with_cidr_blocks = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  tags = local.common_tags
}

# ECR Repositories using official registry module
module "ecr_backend" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "2.3.0"

  repository_name = "${var.project_name}-backend-${var.environment}"
  repository_type = "private"

  repository_encryption_type = "KMS"
  repository_kms_key         = module.kms.key_arn

  tags = local.common_tags
}

module "ecr_frontend" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "2.3.0"

  repository_name = "${var.project_name}-frontend-${var.environment}"
  repository_type = "private"

  repository_encryption_type = "KMS"
  repository_kms_key         = module.kms.key_arn

  tags = local.common_tags
}

# EKS Cluster using official registry module
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.33.1"

  cluster_name    = local.eks_cluster_name
  cluster_version = "1.30"

  cluster_endpoint_public_access  = true
  cluster_endpoint_private_access = true

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    primary = {
      name           = "${var.project_name}-node-group-${var.environment}"
      instance_types = ["t3.medium"]

      min_size     = 1
      max_size     = 3
      desired_size = 2

      capacity_type = "ON_DEMAND"
    }
  }

  tags = local.common_tags
}

# ALB using official registry module
module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "9.13.0"

  name    = "${var.project_name}-${var.environment}-alb"
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.public_subnets

  security_groups = [module.alb_security_group.security_group_id]

  tags = local.common_tags
}

# DocumentDB using official registry module
module "documentdb" {
  source  = "cloudposse/documentdb-cluster/aws"
  version = "0.28.0"

  name            = "${var.project_name}-${var.environment}-docdb"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.database_subnets
  instance_class  = "db.t3.medium"
  cluster_size    = 1
  master_username = "adminuser"

  tags = local.common_tags
}

# ElastiCache Redis using official registry module
module "elasticache" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "1.4.1"

  cluster_id           = "${var.project_name}-${var.environment}-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnets

  tags = local.common_tags
}
