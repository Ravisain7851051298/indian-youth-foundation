import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy of Indian Youth Foundation: how we protect donor data, personal information, and respect online donor privacy.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Indian Youth Foundation',
    description:
      'Learn how Indian Youth Foundation protects donor and volunteer data with bank-grade encryption and privacy compliance.',
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
