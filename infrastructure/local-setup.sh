#!/usr/bin/env bash
# ─────────────────────────────────────────────
# MoCampaign — Local DynamoDB Table Setup
# Requires: docker, aws cli
#
# Usage:
#   1. Start DynamoDB Local:  docker run -p 8000:8000 amazon/dynamodb-local
#   2. Run this script:       ./infrastructure/local-setup.sh
# ─────────────────────────────────────────────

set -euo pipefail

ENDPOINT="http://localhost:8000"
REGION="ap-southeast-2"

# Use dummy credentials matching the app's DynamoDB client config
# (DynamoDB Local without -sharedDb isolates databases per access key)
export AWS_ACCESS_KEY_ID="local"
export AWS_SECRET_ACCESS_KEY="local"

echo "Creating Users table..."
aws dynamodb create-table \
  --table-name mocampaign-users \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[
    {
      "IndexName": "email-index",
      "KeySchema": [{"AttributeName": "email", "KeyType": "HASH"}],
      "Projection": {"ProjectionType": "ALL"}
    }
  ]' \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url "$ENDPOINT" \
  --region "$REGION" \
  2>/dev/null || echo "  (already exists)"

echo "Creating Campaigns table..."
aws dynamodb create-table \
  --table-name mocampaign-campaigns \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --global-secondary-indexes '[
    {
      "IndexName": "userId-index",
      "KeySchema": [{"AttributeName": "userId", "KeyType": "HASH"}],
      "Projection": {"ProjectionType": "ALL"}
    }
  ]' \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url "$ENDPOINT" \
  --region "$REGION" \
  2>/dev/null || echo "  (already exists)"

echo "Creating Donations table..."
aws dynamodb create-table \
  --table-name mocampaign-donations \
  --attribute-definitions \
    AttributeName=campaignId,AttributeType=S \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=campaignId,KeyType=HASH \
    AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url "$ENDPOINT" \
  --region "$REGION" \
  2>/dev/null || echo "  (already exists)"

echo ""
echo "Done! Tables created on DynamoDB Local ($ENDPOINT)"
echo "List tables: aws dynamodb list-tables --endpoint-url $ENDPOINT --region $REGION"
