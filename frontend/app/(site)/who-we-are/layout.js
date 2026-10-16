import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Who We Are - Leading Youth Social Movement',
  description:
    'Discover who we are at Indian Youth Foundation (भारतीय युवा क्रांति): our nationwide network of youth leaders, advisors, volunteers, and change-makers.',
  alternates: {
    canonical: '/who-we-are',
  },
  openGraph: {
    title: 'Who We Are | Indian Youth Foundation',
    description:
      'A coalition of conscious youth leaders committed to social justice, equal opportunities, and selfless community service.',
    url: `${SITE_CONFIG.url}/who-we-are`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Who We Are', path: '/who-we-are' },
];

export default function WhoWeAreLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
