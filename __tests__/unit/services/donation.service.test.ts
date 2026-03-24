/**
 * @jest-environment node
 */
import { donationService } from '@/services/donation.service';
import { donationRepository } from '@/repositories/donation.repository';
import { campaignRepository } from '@/repositories/campaign.repository';

jest.mock('@/repositories/donation.repository');
jest.mock('@/repositories/campaign.repository');

const mockDonationRepo = donationRepository as jest.Mocked<typeof donationRepository>;
const mockCampaignRepo = campaignRepository as jest.Mocked<typeof campaignRepository>;

const activeCampaign = {
  id: 'campaign-1',
  userId: 'user-1',
  title: 'Test',
  description: 'Test',
  goalAmount: 5000,
  currentAmount: 1000,
  status: 'active' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('donationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a donation and increments campaign amount', async () => {
      mockCampaignRepo.findById.mockResolvedValue(activeCampaign);
      mockDonationRepo.create.mockImplementation(async (d) => d);
      mockCampaignRepo.incrementAmount.mockResolvedValue();

      const result = await donationService.create({
        campaignId: 'campaign-1',
        donorName: 'John',
        donorEmail: 'john@example.com',
        amount: 50,
        message: 'Good luck!',
      });

      expect(result.campaignId).toBe('campaign-1');
      expect(result.amount).toBe(50);
      expect(result.donorName).toBe('John');
      expect(result.id).toBeDefined();
      expect(mockCampaignRepo.incrementAmount).toHaveBeenCalledWith('campaign-1', 50);
    });

    it('throws if campaign does not exist', async () => {
      mockCampaignRepo.findById.mockResolvedValue(null);

      await expect(
        donationService.create({
          campaignId: 'missing',
          donorName: 'John',
          donorEmail: 'john@example.com',
          amount: 50,
        })
      ).rejects.toThrow('Campaign not found');
    });

    it('throws if campaign is not active', async () => {
      mockCampaignRepo.findById.mockResolvedValue({
        ...activeCampaign,
        status: 'completed',
      });

      await expect(
        donationService.create({
          campaignId: 'campaign-1',
          donorName: 'John',
          donorEmail: 'john@example.com',
          amount: 50,
        })
      ).rejects.toThrow('Campaign is not accepting donations');
    });
  });

  describe('getByCampaignId', () => {
    it('returns donations from the repository', async () => {
      const mockDonations = [
        {
          id: 'd-1',
          campaignId: 'campaign-1',
          donorName: 'Alice',
          donorEmail: 'alice@example.com',
          amount: 25,
          createdAt: '2024-01-01T00:00:00Z',
        },
      ];
      mockDonationRepo.findByCampaignId.mockResolvedValue(mockDonations);

      const result = await donationService.getByCampaignId('campaign-1');
      expect(result).toHaveLength(1);
      expect(result[0].donorName).toBe('Alice');
    });
  });
});
