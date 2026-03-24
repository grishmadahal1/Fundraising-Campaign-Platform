/**
 * Centralised environment configuration.
 * Every external value the app needs is accessed through this module
 * so that missing vars surface immediately on startup, not at runtime.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  // AWS
  aws: {
    region: optionalEnv('AWS_REGION', 'ap-southeast-2'),
    accessKeyId: optionalEnv('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: optionalEnv('AWS_SECRET_ACCESS_KEY', ''),
    dynamodb: {
      usersTable: optionalEnv('DYNAMODB_USERS_TABLE', 'mocampaign-users'),
      campaignsTable: optionalEnv('DYNAMODB_CAMPAIGNS_TABLE', 'mocampaign-campaigns'),
      donationsTable: optionalEnv('DYNAMODB_DONATIONS_TABLE', 'mocampaign-donations'),
    },
    s3: {
      bucket: optionalEnv('S3_BUCKET', 'mocampaign-assets'),
    },
  },

  // Auth
  auth: {
    jwtSecret: () => requireEnv('JWT_SECRET'),
    tokenExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  },

  // App
  app: {
    url: optionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    environment: optionalEnv('NODE_ENV', 'development'),
  },
} as const;
