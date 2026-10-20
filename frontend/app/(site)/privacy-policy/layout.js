import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy of Yuva Kranti Dal: how we protect donor data, personal information, and respect online donor privacy.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Yuva Kranti Dal',
    description:
      'Learn how Yuva Kranti Dal protects donor and volunteer data with bank-grade encryption and privacy compliance.',
    url: `${SITE_CONFIG.url}/privacy-policy`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Privacy Policy', path: '/privacy-policy' },
];

export default function PrivacyPolicyLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
