import { Hero } from '@/components/Hero';
import { FeaturedCampaigns } from '@/components/FeaturedCampaigns';
import { HowItWorks } from '@/components/HowItWorks';

/**
 * Homepage — server-rendered.
 * Currently uses hardcoded sample data; will be replaced with
 * Sanity CMS content and live campaign data from DynamoDB.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedCampaigns />
      <HowItWorks />
    </main>
  );
}
