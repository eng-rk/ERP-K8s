#!/usr/bin/env bash
set -eo pipefail

ENV="${1:-dev}"

echo "Generating Terraform Plan for environment: ${ENV}..."
cd "environments/${ENV}"

terraform fmt -check
terraform validate
terraform plan -out=tfplan -var-file=terraform.tfvars

echo "Plan generated and saved to environments/${ENV}/tfplan"
