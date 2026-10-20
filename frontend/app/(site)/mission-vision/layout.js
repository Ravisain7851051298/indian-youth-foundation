import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Our Mission & Vision - Nation First',
  description:
    'Our vision of an empowered India driven by proactive youth leadership. Read the mission, values, and core principles guiding the Yuva Kranti Dal.',
  alternates: {
    canonical: '/mission-vision',
  },
  openGraph: {
    title: 'Mission & Vision | Yuva Kranti Dal',
    description:
      'Guiding principles and roadmap for building an educated, healthy, and self-reliant society.',
    url: `${SITE_CONFIG.url}/mission-vision`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Mission & Vision', path: '/mission-vision' },
];

export default function MissionVisionLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
