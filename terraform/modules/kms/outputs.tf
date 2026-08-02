output "key_arn" {
  description = "ARN of the KMS Key"
  value       = aws_kms_key.main.arn
}

output "key_id" {
  description = "ID of the KMS Key"
  value       = aws_kms_key.main.key_id
}

output "alias_name" {
  description = "Alias name of the KMS Key"
  value       = aws_kms_alias.main.name
}
