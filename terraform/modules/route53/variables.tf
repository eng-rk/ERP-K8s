variable "domain_name" {
  description = "Primary domain name for Route53 hosted zone (e.g. example.com)"
  type        = string
  default     = ""
  nullable    = false
}

variable "alb_dns_name" {
  description = "DNS name of Application Load Balancer"
  type        = string
  default     = ""
  nullable    = false
}

variable "alb_zone_id" {
  description = "Hosted zone ID of Application Load Balancer"
  type        = string
  default     = ""
  nullable    = false
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
