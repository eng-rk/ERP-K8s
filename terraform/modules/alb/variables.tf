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

variable "vpc_id" {
  description = "VPC ID where Target Groups and Load Balancer will be deployed"
  type        = string
  nullable    = false
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ALB placement"
  type        = list(string)
  nullable    = false
}

variable "alb_security_group_id" {
  description = "Security Group ID for ALB"
  type        = string
  nullable    = false
}

variable "certificate_arn" {
  description = "ACM TLS Certificate ARN (Optional, fallback to HTTP if not supplied)"
  type        = string
  default     = ""
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
