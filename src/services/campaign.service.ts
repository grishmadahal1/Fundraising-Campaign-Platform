/**
 * Campaign Service — business logic for campaign CRUD operations.
 */
import { campaignRepository } from '@/repositories';
import { donationRepository } from '@/repositories';
import { generateId } from '@/lib/utils';
import type { CreateCampaignInput, UpdateCampaignInput, Campaign, CampaignWithDonorCount } from '@/types';

export const campaignService = {
  async create(userId: string, input: CreateCampaignInput): Promise<Campaign> {
    const now = new Date().toISOString();
    return campaignRepository.create({
      id: generateId(),
      userId,
      title: input.title,
      description: input.description,
      goalAmount: input.goalAmount,
      currentAmount: 0,
      imageUrl: input.imageUrl,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  },

  async getById(id: string): Promise<CampaignWithDonorCount> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    const donorCount = await donationRepository.countByCampaignId(id);
    return { ...campaign, donorCount };
  },

  async getActive(): Promise<Campaign[]> {
    return campaignRepository.findActive();
  },

  async getByUserId(userId: string): Promise<Campaign[]> {
    return campaignRepository.findByUserId(userId);
  },

  async update(id: string, userId: string, input: UpdateCampaignInput): Promise<Campaign> {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    if (campaign.userId !== userId) {
      throw new Error('Not authorised to update this campaign');
    }

    const updated = await campaignRepository.update(id, input);
    if (!updated) {
      throw new Error('Failed to update campaign');
    }
    return updated;
  },
};
