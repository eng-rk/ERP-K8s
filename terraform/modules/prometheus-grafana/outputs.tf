output "prometheus_workspace_id" {
  description = "ID of Amazon Managed Prometheus Workspace"
  value       = aws_prometheus_workspace.main.id
}

output "prometheus_workspace_arn" {
  description = "ARN of Amazon Managed Prometheus Workspace"
  value       = aws_prometheus_workspace.main.arn
}

output "prometheus_endpoint" {
  description = "Prometheus Remote Write API Endpoint"
  value       = aws_prometheus_workspace.main.prometheus_endpoint
}

output "grafana_workspace_id" {
  description = "ID of Amazon Managed Grafana Workspace"
  value       = aws_grafana_workspace.main.id
}

output "grafana_endpoint" {
  description = "URL Endpoint for Managed Grafana Dashboard"
  value       = aws_grafana_workspace.main.endpoint
}
