variable "project_name" {
  description = "Project name identifier"
  type        = string
  default     = "core360"
  nullable    = false
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  nullable    = false

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
  nullable    = false

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "VPC CIDR must be a valid IPv4 CIDR block."
  }
}

variable "availability_zones" {
  description = "List of Availability Zones to utilize"
  type        = list(string)
  nullable    = false
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for Public Subnets"
  type        = list(string)
  nullable    = false
}

variable "private_app_subnet_cidrs" {
  description = "CIDR blocks for Private Application Subnets (EKS Worker Nodes)"
  type        = list(string)
  nullable    = false
}

variable "private_db_subnet_cidrs" {
  description = "CIDR blocks for Private Database Subnets (MongoDB)"
  type        = list(string)
  nullable    = false
}

variable "single_nat_gateway" {
  description = "Set to true for single NAT Gateway (dev cost optimization), false for multi-AZ NAT Gateways (prod)"
  type        = bool
  default     = false
  nullable    = false
}

variable "eks_cluster_name" {
  description = "EKS cluster name for subnet discovery tagging"
  type        = string
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
