# KMS Key for EKS Secret Encryption & Data Volumes
resource "aws_kms_key" "main" {
  description             = "KMS Master Key for Core360 ${var.environment} environment encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-${var.environment}-kms-key"
    }
  )
}

resource "aws_kms_alias" "main" {
  name          = "alias/${var.project_name}-${var.environment}"
  target_key_id = aws_kms_key.main.key_id
}
