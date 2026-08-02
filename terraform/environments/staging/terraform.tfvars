aws_region         = "us-east-1"
environment        = "staging"
project_name       = "core360"
vpc_cidr           = "10.20.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

public_subnet_cidrs      = ["10.20.1.0/24", "10.20.2.0/24", "10.20.3.0/24"]
private_app_subnet_cidrs = ["10.20.10.0/24", "10.20.11.0/24", "10.20.12.0/24"]
private_db_subnet_cidrs  = ["10.20.20.0/24", "10.20.21.0/24", "10.20.22.0/24"]

github_repository = "*/*"
alarm_email       = "devops-alerts-staging@core360.example.com"
