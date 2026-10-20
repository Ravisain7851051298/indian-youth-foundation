import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms and conditions of Yuva Kranti Dal for online donations, memberships, volunteer commitments, and platform usage.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Yuva Kranti Dal',
    description:
      'Official terms and conditions governing donations, volunteer enrollment, and memberships at Yuva Kranti Dal.',
    url: `${SITE_CONFIG.url}/terms`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Terms & Conditions', path: '/terms' },
];

export default function TermsLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
