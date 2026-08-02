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
  description = "VPC ID where Security Groups will be created"
  type        = string
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
