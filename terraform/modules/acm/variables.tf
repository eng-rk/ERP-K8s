variable "domain_name" {
  description = "Domain name for ACM TLS Certificate"
  type        = string
  default     = ""
  nullable    = false
}

variable "zone_id" {
  description = "Route53 Hosted Zone ID for DNS validation"
  type        = string
  default     = ""
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
