import type { Campaign } from './campaign';
import type { Donation } from './donation';

export interface DashboardData {
  totalRaised: number;
  totalDonors: number;
  campaignCount: number;
  campaigns: Campaign[];
  recentDonations: Donation[];
}
