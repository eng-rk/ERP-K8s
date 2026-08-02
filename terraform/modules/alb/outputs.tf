output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_zone_id" {
  description = "Canonical Hosted Zone ID of the ALB (for Route53 alias records)"
  value       = aws_lb.main.zone_id
}

output "frontend_target_group_arn" {
  description = "ARN of Frontend Target Group"
  value       = aws_lb_target_group.frontend.arn
}

output "backend_target_group_arn" {
  description = "ARN of Backend Target Group"
  value       = aws_lb_target_group.backend.arn
}
