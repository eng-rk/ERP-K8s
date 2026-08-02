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

variable "cluster_version" {
  description = "Kubernetes version for Amazon EKS"
  type        = string
  default     = "1.30"
  nullable    = false
}

variable "vpc_id" {
  description = "VPC ID where EKS cluster will be deployed"
  type        = string
  nullable    = false
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for worker node placement"
  type        = list(string)
  nullable    = false
}

variable "cluster_role_arn" {
  description = "ARN of IAM role for EKS control plane"
  type        = string
  nullable    = false
}

variable "node_role_arn" {
  description = "ARN of IAM role for EKS worker node group"
  type        = string
  nullable    = false
}

variable "kms_key_arn" {
  description = "KMS Key ARN for EKS Kubernetes Secrets envelope encryption"
  type        = string
  nullable    = false
}

variable "instance_types" {
  description = "List of EC2 instance types for managed node group"
  type        = list(string)
  default     = ["m6i.large", "c6i.large"]
  nullable    = false
}

variable "desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 3
  nullable    = false
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 2
  nullable    = false
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 6
  nullable    = false
}

variable "capacity_type" {
  description = "Capacity type for node group (ON_DEMAND or SPOT)"
  type        = string
  default     = "ON_DEMAND"
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
