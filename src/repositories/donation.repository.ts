/**
 * Donation Repository — DynamoDB access layer for the donations domain.
 */
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/db/dynamodb';
import { env } from '@/config/env';
import type { Donation } from '@/types';

const TABLE = env.aws.dynamodb.donationsTable;

export const donationRepository = {
  async findByCampaignId(campaignId: string): Promise<Donation[]> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'campaignId = :campaignId',
        ExpressionAttributeValues: { ':campaignId': campaignId },
        ScanIndexForward: false,
      })
    );
    return (result.Items as Donation[]) ?? [];
  },

  async create(donation: Donation): Promise<Donation> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: donation,
      })
    );
    return donation;
  },

  async countByCampaignId(campaignId: string): Promise<number> {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'campaignId = :campaignId',
        ExpressionAttributeValues: { ':campaignId': campaignId },
        Select: 'COUNT',
      })
    );
    return result.Count ?? 0;
  },
};
