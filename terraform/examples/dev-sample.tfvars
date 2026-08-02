aws_region         = "us-east-1"
environment        = "dev"
project_name       = "core360"
vpc_cidr           = "10.10.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

public_subnet_cidrs      = ["10.10.1.0/24", "10.10.2.0/24", "10.10.3.0/24"]
private_app_subnet_cidrs = ["10.10.10.0/24", "10.10.11.0/24", "10.10.12.0/24"]
private_db_subnet_cidrs  = ["10.10.20.0/24", "10.10.21.0/24", "10.10.22.0/24"]

github_repository = "*/*"
alarm_email       = "devops-alerts-dev@core360.example.com"
