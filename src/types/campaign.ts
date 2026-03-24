export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  imageUrl?: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'active' | 'completed' | 'draft';

export interface CreateCampaignInput {
  title: string;
  description: string;
  goalAmount: number;
  imageUrl?: string;
}

export interface UpdateCampaignInput {
  title?: string;
  description?: string;
  goalAmount?: number;
  imageUrl?: string;
  status?: CampaignStatus;
}

export interface CampaignWithDonorCount extends Campaign {
  donorCount: number;
}
