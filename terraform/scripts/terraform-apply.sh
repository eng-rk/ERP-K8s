#!/usr/bin/env bash
set -eo pipefail

ENV="${1:-dev}"

echo "Applying Terraform Execution Plan for environment: ${ENV}..."
cd "environments/${ENV}"

if [ ! -f "tfplan" ]; then
  echo "ERROR: tfplan file not found! Run terraform-plan.sh first."
  exit 1
fi

terraform apply tfplan
rm -f tfplan

echo "Terraform infrastructure apply completed successfully."
