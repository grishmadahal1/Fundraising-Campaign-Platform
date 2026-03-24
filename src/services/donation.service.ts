/**
 * Donation Service — business logic for processing donations.
 */
import { donationRepository, campaignRepository } from '@/repositories';
import { generateId } from '@/lib/utils';
import type { CreateDonationInput, Donation } from '@/types';

export const donationService = {
  async create(input: CreateDonationInput): Promise<Donation> {
    // Verify the campaign exists and is active
    const campaign = await campaignRepository.findById(input.campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    if (campaign.status !== 'active') {
      throw new Error('Campaign is not accepting donations');
    }

    const donation = await donationRepository.create({
      id: generateId(),
      campaignId: input.campaignId,
      donorName: input.donorName,
      donorEmail: input.donorEmail,
      amount: input.amount,
      message: input.message,
      createdAt: new Date().toISOString(),
    });

    // Update the campaign's running total
    await campaignRepository.incrementAmount(input.campaignId, input.amount);

    return donation;
  },

  async getByCampaignId(campaignId: string): Promise<Donation[]> {
    return donationRepository.findByCampaignId(campaignId);
  },
};
