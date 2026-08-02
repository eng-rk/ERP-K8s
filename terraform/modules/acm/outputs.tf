output "certificate_arn" {
  description = "ARN of validated ACM TLS Certificate"
  value       = length(aws_acm_certificate.main) > 0 ? aws_acm_certificate.main[0].arn : ""
}
