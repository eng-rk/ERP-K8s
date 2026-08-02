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

variable "kms_key_arn" {
  description = "KMS Key ARN for encryption at rest"
  type        = string
  nullable    = false
}

variable "oidc_provider_arn" {
  description = "EKS IAM OIDC Provider ARN for Prometheus IRSA"
  type        = string
  default     = ""
  nullable    = false
}

variable "oidc_provider_url" {
  description = "EKS IAM OIDC Provider URL for Prometheus IRSA"
  type        = string
  default     = ""
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
