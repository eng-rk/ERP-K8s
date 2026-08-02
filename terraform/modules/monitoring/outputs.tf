output "sns_topic_arn" {
  description = "ARN of SNS Alert Topic"
  value       = aws_sns_topic.alerts.arn
}

output "application_log_group_name" {
  description = "Name of CloudWatch Application Log Group"
  value       = aws_cloudwatch_log_group.application.name
}
