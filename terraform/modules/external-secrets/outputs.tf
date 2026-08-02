output "eso_role_arn" {
  description = "IAM Role ARN for External Secrets Operator (IRSA)"
  value       = aws_iam_role.eso.arn
}

output "mongodb_uri_secret_arn" {
  description = "Secrets Manager ARN for MongoDB URI"
  value       = aws_secretsmanager_secret.mongodb_uri.arn
}

output "jwt_secret_arn" {
  description = "Secrets Manager ARN for JWT Secret"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}
