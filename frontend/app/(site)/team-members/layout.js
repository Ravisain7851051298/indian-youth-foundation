import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Our Leadership Team & Board of Trustees',
  description:
    'Meet the passionate executive board, regional coordinators, and community leaders steering Yuva Kranti Dal across India.',
  alternates: {
    canonical: '/team-members',
  },
  openGraph: {
    title: 'Leadership & Team | Yuva Kranti Dal',
    description:
      'Dedicated trustees, mentors, and youth coordinators driving our non-profit initiatives forward.',
    url: `${SITE_CONFIG.url}/team-members`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Team Members', path: '/team-members' },
];

export default function TeamMembersLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
