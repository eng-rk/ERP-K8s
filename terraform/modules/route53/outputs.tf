output "zone_id" {
  description = "Route53 Hosted Zone ID"
  value       = length(aws_route53_zone.main) > 0 ? aws_route53_zone.main[0].zone_id : ""
}

output "name_servers" {
  description = "Name servers for Route53 Hosted Zone"
  value       = length(aws_route53_zone.main) > 0 ? aws_route53_zone.main[0].name_servers : []
}
