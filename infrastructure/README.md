# Infrastructure

AWS CloudFormation template for the MoCampaign platform.

## Resources Created

| Resource | Type | Purpose |
|----------|------|---------|
| `UsersTable` | DynamoDB | User accounts with email GSI |
| `CampaignsTable` | DynamoDB | Campaign data with userId GSI |
| `DonationsTable` | DynamoDB | Donations keyed by campaignId + id |
| `AssetsBucket` | S3 | Campaign images and uploads |
| `ApiGateway` | API Gateway | REST API endpoint |
| `ApiFunction` | Lambda | API handler (Node.js 20) |
| `LambdaExecutionRole` | IAM Role | Lambda permissions (DynamoDB + S3) |
| `GitHubOIDCProvider` | IAM OIDC | GitHub Actions authentication |
| `GitHubDeployRole` | IAM Role | CI/CD deployment permissions |

## Deploy

```bash
# Deploy to dev
aws cloudformation deploy \
  --template-file infrastructure/template.yml \
  --stack-name mocampaign-dev \
  --parameter-overrides Environment=dev \
  --capabilities CAPABILITY_NAMED_IAM

# Deploy to prod
aws cloudformation deploy \
  --template-file infrastructure/template.yml \
  --stack-name mocampaign-prod \
  --parameter-overrides Environment=prod \
  --capabilities CAPABILITY_NAMED_IAM
```

## Local Development

```bash
# Start DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# Create tables
chmod +x infrastructure/local-setup.sh
./infrastructure/local-setup.sh
```

## GitHub Actions Setup

After deploying, add these GitHub secrets:
- `AWS_DEPLOY_ROLE_ARN` — from the `GitHubDeployRoleArn` output
- `JWT_SECRET` — a strong random string for production JWT signing
