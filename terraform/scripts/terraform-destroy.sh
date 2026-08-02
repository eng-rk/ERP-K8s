#!/usr/bin/env bash
set -eo pipefail

ENV="${1:-dev}"

read -p "WARNING: Destroy all infrastructure for environment '${ENV}'? (y/N) " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Destroy cancelled."
  exit 0
fi

echo "Destroying infrastructure for environment: ${ENV}..."
cd "environments/${ENV}"

terraform destroy -var-file=terraform.tfvars
