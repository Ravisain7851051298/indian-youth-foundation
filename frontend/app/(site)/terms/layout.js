import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms and conditions of Indian Youth Foundation for online donations, memberships, volunteer commitments, and platform usage.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | Indian Youth Foundation',
    description:
      'Official terms and conditions governing donations, volunteer enrollment, and memberships at Indian Youth Foundation.',
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
