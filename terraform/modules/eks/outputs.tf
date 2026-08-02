output "cluster_name" {
  description = "Name of the EKS Cluster"
  value       = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  description = "Kubernetes API Endpoint of EKS Cluster"
  value       = aws_eks_cluster.main.endpoint
}

output "cluster_arn" {
  description = "ARN of the EKS Cluster"
  value       = aws_eks_cluster.main.arn
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.main.certificate_authority[0].data
}

output "oidc_provider_arn" {
  description = "ARN of IAM OIDC Provider for EKS IRSA"
  value       = aws_iam_openid_connect_provider.eks.arn
}

output "oidc_provider_url" {
  description = "Issuer URL of IAM OIDC Provider for EKS IRSA"
  value       = aws_eks_cluster.main.identity[0].oidc[0].issuer
}

output "node_group_id" {
  description = "ID of Managed Node Group"
  value       = aws_eks_node_group.main.id
}
