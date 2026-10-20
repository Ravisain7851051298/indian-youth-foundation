import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Active Campaigns & Crowdfunding Causes',
  description:
    'Explore verified social welfare campaigns by Yuva Kranti Dal. Support child education kits, emergency patient medical relief, winter blanket drives, and food relief.',
  alternates: {
    canonical: '/campaigns',
  },
  openGraph: {
    title: 'Support Verified Social Campaigns | Yuva Kranti Dal',
    description:
      'Fund life-changing campaigns for underprivileged children, healthcare emergencies, and disaster relief.',
    url: `${SITE_CONFIG.url}/campaigns`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Campaigns', path: '/campaigns' },
];

export default function CampaignsLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
