# IAM Role for External Secrets Operator (IRSA)
resource "aws_iam_role" "eso" {
  name = "${var.project_name}-${var.environment}-eso-irsa-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = var.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(var.oidc_provider_url, "https://", "")}:sub" = "system:serviceaccount:external-secrets:external-secrets"
            "${replace(var.oidc_provider_url, "https://", "")}:aud" = "sts.amazonaws.com"
          }
        }
      }
    ]
  })

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-eso-irsa-role"
    }
  )
}

# Policy allowing ESO to read Secrets Manager & SSM Parameter Store
resource "aws_iam_role_policy" "eso_secrets_access" {
  name = "${var.project_name}-${var.environment}-eso-secrets-policy"
  role = aws_iam_role.eso.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "arn:aws:secretsmanager:*:*:secret:${var.project_name}/${var.environment}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:GetParametersByPath"
        ]
        Resource = "arn:aws:ssm:*:*:parameter/${var.project_name}/${var.environment}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt"
        ]
        Resource = var.kms_key_arn
      }
    ]
  })
}

# Provision AWS Secrets Manager Secret Containers
resource "aws_secretsmanager_secret" "mongodb_uri" {
  name                    = "${var.project_name}/${var.environment}/mongodb-uri"
  kms_key_id              = var.kms_key_arn
  recovery_window_in_days = 0

  tags = var.tags
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.project_name}/${var.environment}/jwt-secret"
  kms_key_id              = var.kms_key_arn
  recovery_window_in_days = 0

  tags = var.tags
}

resource "aws_secretsmanager_secret" "encryption_secret" {
  name                    = "${var.project_name}/${var.environment}/encryption-secret"
  kms_key_id              = var.kms_key_arn
  recovery_window_in_days = 0

  tags = var.tags
}

resource "aws_secretsmanager_secret" "meta_verify_token" {
  name                    = "${var.project_name}/${var.environment}/meta-verify-token"
  kms_key_id              = var.kms_key_arn
  recovery_window_in_days = 0

  tags = var.tags
}

# Populate initial secure default values
resource "aws_secretsmanager_secret_version" "mongodb_uri" {
  secret_id     = aws_secretsmanager_secret.mongodb_uri.id
  secret_string = "mongodb://mongo-service:27017/core360-${var.environment}"
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = "production_high_entropy_jwt_secret_key_${var.environment}"
}

resource "aws_secretsmanager_secret_version" "encryption_secret" {
  secret_id     = aws_secretsmanager_secret.encryption_secret.id
  secret_string = "production_aes_256_encryption_secret_${var.environment}"
}

resource "aws_secretsmanager_secret_version" "meta_verify_token" {
  secret_id     = aws_secretsmanager_secret.meta_verify_token.id
  secret_string = "production_meta_webhook_verify_token_${var.environment}"
}

# Provision SSM Parameter Store Parameters for Application Config
resource "aws_ssm_parameter" "port" {
  name  = "/${var.project_name}/${var.environment}/PORT"
  type  = "String"
  value = "5000"

  tags = var.tags
}

resource "aws_ssm_parameter" "node_env" {
  name  = "/${var.project_name}/${var.environment}/NODE_ENV"
  type  = "String"
  value = var.environment == "prod" ? "production" : var.environment

  tags = var.tags
}
