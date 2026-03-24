/**
 * @jest-environment node
 */
import { campaignService } from '@/services/campaign.service';
import { campaignRepository } from '@/repositories/campaign.repository';
import { donationRepository } from '@/repositories/donation.repository';

jest.mock('@/repositories/campaign.repository');
jest.mock('@/repositories/donation.repository');

const mockCampaignRepo = campaignRepository as jest.Mocked<typeof campaignRepository>;
const mockDonationRepo = donationRepository as jest.Mocked<typeof donationRepository>;

const baseCampaign = {
  id: 'campaign-1',
  userId: 'user-1',
  title: 'Test Campaign',
  description: 'A test campaign',
  goalAmount: 5000,
  currentAmount: 1000,
  status: 'active' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('campaignService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a campaign with correct defaults', async () => {
      mockCampaignRepo.create.mockImplementation(async (c) => c);

      const result = await campaignService.create('user-1', {
        title: 'My Campaign',
        description: 'Description',
        goalAmount: 3000,
      });

      expect(result.userId).toBe('user-1');
      expect(result.title).toBe('My Campaign');
      expect(result.currentAmount).toBe(0);
      expect(result.status).toBe('active');
      expect(result.id).toBeDefined();
    });
  });

  describe('getById', () => {
    it('returns campaign with donor count', async () => {
      mockCampaignRepo.findById.mockResolvedValue(baseCampaign);
      mockDonationRepo.countByCampaignId.mockResolvedValue(42);

      const result = await campaignService.getById('campaign-1');

      expect(result.donorCount).toBe(42);
      expect(result.title).toBe('Test Campaign');
    });

    it('throws if campaign not found', async () => {
      mockCampaignRepo.findById.mockResolvedValue(null);

      await expect(campaignService.getById('missing')).rejects.toThrow('Campaign not found');
    });
  });

  describe('update', () => {
    it('updates a campaign owned by the user', async () => {
      mockCampaignRepo.findById.mockResolvedValue(baseCampaign);
      mockCampaignRepo.update.mockResolvedValue({
        ...baseCampaign,
        title: 'Updated Title',
      });

      const result = await campaignService.update('campaign-1', 'user-1', {
        title: 'Updated Title',
      });

      expect(result.title).toBe('Updated Title');
    });

    it('throws if user does not own the campaign', async () => {
      mockCampaignRepo.findById.mockResolvedValue(baseCampaign);

      await expect(
        campaignService.update('campaign-1', 'other-user', { title: 'Hack' })
      ).rejects.toThrow('Not authorised');
    });

    it('throws if campaign not found', async () => {
      mockCampaignRepo.findById.mockResolvedValue(null);

      await expect(
        campaignService.update('missing', 'user-1', { title: 'X' })
      ).rejects.toThrow('Campaign not found');
    });
  });

  describe('getActive', () => {
    it('returns active campaigns from the repository', async () => {
      mockCampaignRepo.findActive.mockResolvedValue([baseCampaign]);

      const result = await campaignService.getActive();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('campaign-1');
    });
  });
});
