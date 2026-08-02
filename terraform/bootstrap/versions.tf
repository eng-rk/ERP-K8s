terraform {
  required_version = ">= 1.9.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.60.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Core360"
      Environment = "bootstrap"
      ManagedBy   = "Terraform"
      Owner       = "DevOps"
      CostCenter  = "Core360"
      Application = "ERP-Bootstrap"
    }
  }
}
