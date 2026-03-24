/**
 * User Repository — DynamoDB access layer for the users domain.
 * All database operations for users are encapsulated here,
 * keeping the service layer free of infrastructure concerns.
 */
import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/db/dynamodb';
import { env } from '@/config/env';
import type { User } from '@/types';

const TABLE = env.aws.dynamodb.usersTable;

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: { id },
      })
    );
    return (result.Item as User) ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      })
    );
    return (result.Items?.[0] as User) ?? null;
  },

  async create(user: User): Promise<User> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: user,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
    return user;
  },
};
