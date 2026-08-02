variable "aws_region" {
  description = "Target AWS region for infrastructure bootstrap"
  type        = string
  default     = "us-east-1"
  nullable    = false

  validation {
    condition     = can(regex("^[a-z]{2}-[a-z]+-\\d{1}$", var.aws_region))
    error_message = "AWS region must be a valid format (e.g. us-east-1, eu-west-1)."
  }
}

variable "project_name" {
  description = "Standardized project name identifier"
  type        = string
  default     = "core360"
  nullable    = false
}
