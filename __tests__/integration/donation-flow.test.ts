/**
 * @jest-environment node
 *
 * Integration test — donation flow.
 * Tests the full path from donation creation through to
 * campaign amount increment, using mocked repositories.
 */
import { donationService } from '@/services/donation.service';
import { campaignRepository } from '@/repositories/campaign.repository';
import { donationRepository } from '@/repositories/donation.repository';
import type { Campaign, Donation } from '@/types';

jest.mock('@/repositories/campaign.repository');
jest.mock('@/repositories/donation.repository');

const mockCampaignRepo = campaignRepository as jest.Mocked<typeof campaignRepository>;
const mockDonationRepo = donationRepository as jest.Mocked<typeof donationRepository>;

describe('Donation flow integration', () => {
  // Simulate a mutable campaign so we can verify state changes
  let campaignState: Campaign;

  beforeEach(() => {
    jest.clearAllMocks();

    campaignState = {
      id: 'campaign-abc',
      userId: 'fundraiser-1',
      title: 'Integration Test Campaign',
      description: 'Testing the full donation flow',
      goalAmount: 1000,
      currentAmount: 200,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    mockCampaignRepo.findById.mockImplementation(async (id) =>
      id === campaignState.id ? { ...campaignState } : null
    );

    mockCampaignRepo.incrementAmount.mockImplementation(async (_id, amount) => {
      campaignState.currentAmount += amount;
    });

    const donations: Donation[] = [];
    mockDonationRepo.create.mockImplementation(async (d) => {
      donations.push(d);
      return d;
    });
    mockDonationRepo.findByCampaignId.mockImplementation(async () => [...donations]);
  });

  it('processes a donation end-to-end', async () => {
    // 1. Make a donation
    const donation = await donationService.create({
      campaignId: 'campaign-abc',
      donorName: 'Alice',
      donorEmail: 'alice@test.com',
      amount: 75,
      message: 'Keep it up!',
    });

    // 2. Verify donation was created
    expect(donation.id).toBeDefined();
    expect(donation.amount).toBe(75);
    expect(donation.donorName).toBe('Alice');
    expect(donation.campaignId).toBe('campaign-abc');

    // 3. Verify campaign amount was incremented
    expect(campaignState.currentAmount).toBe(275); // 200 + 75

    // 4. Verify donation appears in campaign's donation list
    const campaignDonations = await donationService.getByCampaignId('campaign-abc');
    expect(campaignDonations).toHaveLength(1);
    expect(campaignDonations[0].donorEmail).toBe('alice@test.com');
  });

  it('handles multiple sequential donations', async () => {
    await donationService.create({
      campaignId: 'campaign-abc',
      donorName: 'Alice',
      donorEmail: 'alice@test.com',
      amount: 50,
    });

    await donationService.create({
      campaignId: 'campaign-abc',
      donorName: 'Bob',
      donorEmail: 'bob@test.com',
      amount: 100,
    });

    await donationService.create({
      campaignId: 'campaign-abc',
      donorName: 'Charlie',
      donorEmail: 'charlie@test.com',
      amount: 25,
    });

    // Campaign total: 200 + 50 + 100 + 25 = 375
    expect(campaignState.currentAmount).toBe(375);

    const donations = await donationService.getByCampaignId('campaign-abc');
    expect(donations).toHaveLength(3);
  });

  it('rejects donation to non-existent campaign', async () => {
    await expect(
      donationService.create({
        campaignId: 'non-existent',
        donorName: 'Alice',
        donorEmail: 'alice@test.com',
        amount: 50,
      })
    ).rejects.toThrow('Campaign not found');

    // Campaign amount should not change
    expect(campaignState.currentAmount).toBe(200);
  });

  it('rejects donation to completed campaign', async () => {
    campaignState.status = 'completed';

    await expect(
      donationService.create({
        campaignId: 'campaign-abc',
        donorName: 'Alice',
        donorEmail: 'alice@test.com',
        amount: 50,
      })
    ).rejects.toThrow('Campaign is not accepting donations');

    expect(campaignState.currentAmount).toBe(200);
  });
});
