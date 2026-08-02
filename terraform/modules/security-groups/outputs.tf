output "alb_security_group_id" {
  description = "Security Group ID for ALB"
  value       = aws_security_group.alb.id
}

output "eks_control_plane_security_group_id" {
  description = "Security Group ID for EKS Control Plane"
  value       = aws_security_group.eks_control_plane.id
}

output "eks_nodes_security_group_id" {
  description = "Security Group ID for EKS Worker Nodes"
  value       = aws_security_group.eks_nodes.id
}

output "mongodb_security_group_id" {
  description = "Security Group ID for MongoDB"
  value       = aws_security_group.mongodb.id
}
