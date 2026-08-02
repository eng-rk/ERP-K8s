#!/usr/bin/env bash
set -eo pipefail

ENV="${1:-dev}"
BUCKET_NAME="${2}"
DYNAMODB_TABLE="${3:-core360-tf-locks}"
REGION="${4:-us-east-1}"

if [ -z "$BUCKET_NAME" ]; then
  echo "Usage: ./terraform-init.sh <environment> <s3_bucket_name> [dynamodb_table] [region]"
  exit 1
fi

echo "Initializing Remote Terraform State for environment: ${ENV}..."
cd "environments/${ENV}"

terraform init \
  -backend-config="bucket=${BUCKET_NAME}" \
  -backend-config="key=${ENV}/terraform.tfstate" \
  -backend-config="region=${REGION}" \
  -backend-config="dynamodb_table=${DYNAMODB_TABLE}"

echo "Terraform remote state initialized successfully."
