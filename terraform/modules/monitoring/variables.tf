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

variable "eks_cluster_name" {
  description = "Name of Amazon EKS Cluster"
  type        = string
  nullable    = false
}

variable "alb_arn" {
  description = "ARN of Application Load Balancer"
  type        = string
  default     = ""
  nullable    = false
}

variable "alarm_email" {
  description = "Email address for CloudWatch SNS metric alarm notifications"
  type        = string
  default     = "devops-alerts@core360.example.com"
  nullable    = false
}

variable "log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 30
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
