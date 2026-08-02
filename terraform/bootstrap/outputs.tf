output "s3_bucket_name" {
  description = "Name of the created S3 remote state bucket"
  value       = aws_s3_bucket.terraform_state.id
}

output "s3_bucket_arn" {
  description = "ARN of the created S3 remote state bucket"
  value       = aws_s3_bucket.terraform_state.arn
}

output "dynamodb_table_name" {
  description = "Name of the created DynamoDB lock table"
  value       = aws_dynamodb_table.terraform_locks.id
}

output "kms_key_arn" {
  description = "ARN of the KMS Key created for state encryption"
  value       = aws_kms_key.terraform_state.arn
}

output "aws_region" {
  description = "AWS region hosting bootstrap resources"
  value       = var.aws_region
}
