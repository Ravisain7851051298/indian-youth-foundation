import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Social Welfare Events & Drives',
  description:
    'Stay updated with upcoming and past social welfare events organized by Indian Youth Foundation - blood donation camps, stationery distribution, youth rallies, and environmental plantation drives.',
  alternates: {
    canonical: '/event',
  },
  openGraph: {
    title: 'Events & Community Drives | Indian Youth Foundation',
    description:
      'Participate in impactful community events, health checkup camps, and youth mobilization programs across districts.',
    url: `${SITE_CONFIG.url}/event`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/event' },
];

export default function EventLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
