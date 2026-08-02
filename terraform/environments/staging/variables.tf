variable "aws_region" {
  description = "Target AWS Region"
  type        = string
  default     = "us-east-1"
  nullable    = false

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-\\d{1}$", var.aws_region))
    error_message = "AWS region must be valid format (e.g. us-east-1)."
  }
}

variable "environment" {
  description = "Target environment"
  type        = string
  default     = "staging"
  nullable    = false
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "core360"
  nullable    = false
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.20.0.0/16"
  nullable    = false
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
  nullable    = false
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDRs"
  type        = list(string)
  default     = ["10.20.1.0/24", "10.20.2.0/24", "10.20.3.0/24"]
  nullable    = false
}

variable "private_app_subnet_cidrs" {
  description = "Private App subnet CIDRs"
  type        = list(string)
  default     = ["10.20.10.0/24", "10.20.11.0/24", "10.20.12.0/24"]
  nullable    = false
}

variable "private_db_subnet_cidrs" {
  description = "Private DB subnet CIDRs"
  type        = list(string)
  default     = ["10.20.20.0/24", "10.20.21.0/24", "10.20.22.0/24"]
  nullable    = false
}

variable "github_repository" {
  description = "GitHub repository for OIDC trust policy"
  type        = string
  default     = "*/*"
  nullable    = false
}

variable "domain_name" {
  description = "Domain name (optional)"
  type        = string
  default     = ""
  nullable    = false
}

variable "alarm_email" {
  description = "DevOps Alarm Email"
  type        = string
  default     = "devops-alerts-staging@core360.example.com"
  nullable    = false
}
