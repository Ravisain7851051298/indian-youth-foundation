import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Core Programs & Youth Welfare Missions',
  description:
    'Explore Yuva Kranti Dal core programs: Youth Leadership Academy, Remedial Slum Education, Raktdan Mahadan, Environmental Green Drives, and Rural Women Empowerment.',
  alternates: {
    canonical: '/programs',
  },
  openGraph: {
    title: 'Core NGO Programs | Yuva Kranti Dal',
    description:
      'Long-term sustainable development programs bridging socioeconomic gaps through youth engagement.',
    url: `${SITE_CONFIG.url}/programs`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Programs', path: '/programs' },
];

export default function ProgramsLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
