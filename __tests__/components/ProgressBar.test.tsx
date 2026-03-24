import { render, screen } from '@testing-library/react';
import { ProgressBar } from '@/components/ui/ProgressBar';

describe('ProgressBar', () => {
  it('renders the current amount and goal', () => {
    render(<ProgressBar current={2500} goal={5000} />);

    expect(screen.getByText('$2,500 raised')).toBeInTheDocument();
    expect(screen.getByText('of $5,000 goal')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('caps the percentage at 100%', () => {
    render(<ProgressBar current={6000} goal={5000} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveStyle({ width: '100%' });
  });

  it('sets correct aria attributes on the progress bar', () => {
    render(<ProgressBar current={1000} goal={4000} />);

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '1000');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '4000');
  });
});
