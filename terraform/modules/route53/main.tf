# Route53 Public Hosted Zone
resource "aws_route53_zone" "main" {
  count = var.domain_name != "" ? 1 : 0
  name  = var.domain_name

  tags = var.tags
}

# Alias Record pointing to ALB
resource "aws_route53_record" "alb_alias" {
  count   = (var.domain_name != "" && var.alb_dns_name != "") ? 1 : 0
  zone_id = aws_route53_zone.main[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}
