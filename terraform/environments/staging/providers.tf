provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Core360"
      Environment = "staging"
      ManagedBy   = "Terraform"
      Owner       = "DevOps"
      CostCenter  = "Core360"
      Application = "ERP"
    }
  }
}
