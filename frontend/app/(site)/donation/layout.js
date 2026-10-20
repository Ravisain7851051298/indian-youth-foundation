import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Donate Online - 50% Tax Exemption Under Section 80G',
  description:
    'Contribute to Yuva Kranti Dal. 100% transparent donation directly funding child education, emergency blood delivery, and community welfare. Instant 80G tax receipt provided.',
  alternates: {
    canonical: '/donation',
  },
  openGraph: {
    title: 'Donate to Yuva Kranti Dal | 80G Tax Deductible Donation',
    description:
      'Support underprivileged children and life-saving health emergencies. Claim 50% income tax deduction under Section 80G.',
    url: `${SITE_CONFIG.url}/donation`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Donate Online', path: '/donation' },
];

export default function DonationLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
