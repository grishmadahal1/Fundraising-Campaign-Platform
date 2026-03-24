import { render, screen } from '@testing-library/react';
import { CampaignCard } from '@/components/CampaignCard';
import type { Campaign } from '@/types';

const mockCampaign: Campaign = {
  id: 'test-1',
  userId: 'user-1',
  title: 'Save the Whales',
  description: 'Fundraising for marine conservation and whale protection.',
  goalAmount: 10000,
  currentAmount: 4500,
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

describe('CampaignCard', () => {
  it('renders campaign title and description', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('Save the Whales')).toBeInTheDocument();
    expect(
      screen.getByText('Fundraising for marine conservation and whale protection.')
    ).toBeInTheDocument();
  });

  it('renders the progress bar with correct values', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    expect(screen.getByText('$4,500 raised')).toBeInTheDocument();
    expect(screen.getByText('of $10,000 goal')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('links to the campaign detail page', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/campaigns/test-1');
  });

  it('shows placeholder icon when no image URL', () => {
    render(<CampaignCard campaign={mockCampaign} />);

    // Should not render an img element
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
