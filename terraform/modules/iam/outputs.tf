output "github_oidc_provider_arn" {
  description = "ARN of GitHub OIDC Provider"
  value       = aws_iam_openid_connect_provider.github.arn
}

output "github_actions_role_arn" {
  description = "ARN of IAM Role assumed by GitHub Actions via OIDC"
  value       = aws_iam_role.github_actions.arn
}

output "eks_cluster_role_arn" {
  description = "ARN of EKS Cluster IAM Role"
  value       = aws_iam_role.eks_cluster.arn
}

output "eks_node_group_role_arn" {
  description = "ARN of EKS Worker Node IAM Role"
  value       = aws_iam_role.eks_node_group.arn
}
