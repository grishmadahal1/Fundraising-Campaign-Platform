/**
 * Campaign Repository — DynamoDB access layer for the campaigns domain.
 */
import {
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/db/dynamodb';
import { env } from '@/config/env';
import type { Campaign, UpdateCampaignInput } from '@/types';

const TABLE = env.aws.dynamodb.campaignsTable;

export const campaignRepository = {
  async findById(id: string): Promise<Campaign | null> {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE,
        Key: { id },
      })
    );
    return (result.Item as Campaign) ?? null;
  },

  async findByUserId(userId: string): Promise<Campaign[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      })
    );
    return (result.Items as Campaign[]) ?? [];
  },

  async findActive(): Promise<Campaign[]> {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': 'active' },
      })
    );
    return (result.Items as Campaign[]) ?? [];
  },

  async create(campaign: Campaign): Promise<Campaign> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: campaign,
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
    return campaign;
  },

  async update(id: string, input: UpdateCampaignInput): Promise<Campaign | null> {
    const expressions: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        expressions.push(`${attrName} = ${attrValue}`);
        names[attrName] = key;
        values[attrValue] = value;
      }
    });

    if (expressions.length === 0) return this.findById(id);

    expressions.push('#updatedAt = :updatedAt');
    names['#updatedAt'] = 'updatedAt';
    values[':updatedAt'] = new Date().toISOString();

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: `SET ${expressions.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      })
    );
    return (result.Attributes as Campaign) ?? null;
  },

  async incrementAmount(id: string, amount: number): Promise<void> {
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: 'SET currentAmount = currentAmount + :amount, updatedAt = :now',
        ExpressionAttributeValues: {
          ':amount': amount,
          ':now': new Date().toISOString(),
        },
      })
    );
  },
};
