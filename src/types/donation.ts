export interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
  createdAt: string;
}

export interface CreateDonationInput {
  campaignId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  message?: string;
}
