/**
 * Dashboard Service — aggregates campaign and donation data
 * for the authenticated fundraiser's dashboard view.
 */
import { campaignRepository, donationRepository } from '@/repositories';
import type { DashboardData } from '@/types/dashboard';
import type { Donation } from '@/types';

export const dashboardService = {
  async getByUserId(userId: string): Promise<DashboardData> {
    const campaigns = await campaignRepository.findByUserId(userId);

    // Fetch donations for all user campaigns in parallel
    const donationsBycampaign = await Promise.all(
      campaigns.map((c) => donationRepository.findByCampaignId(c.id))
    );

    const allDonations: Donation[] = donationsBycampaign.flat();

    // Sort by most recent first, take top 20
    const recentDonations = allDonations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);

    const totalRaised = campaigns.reduce((sum, c) => sum + c.currentAmount, 0);
    const totalDonors = allDonations.length;

    return {
      totalRaised,
      totalDonors,
      campaignCount: campaigns.length,
      campaigns,
      recentDonations,
    };
  },
};
