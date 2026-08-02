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

variable "oidc_provider_arn" {
  description = "EKS IAM OIDC Provider ARN for IRSA"
  type        = string
  nullable    = false
}

variable "oidc_provider_url" {
  description = "EKS IAM OIDC Provider URL"
  type        = string
  nullable    = false
}

variable "kms_key_arn" {
  description = "KMS Key ARN used by Secrets Manager"
  type        = string
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
