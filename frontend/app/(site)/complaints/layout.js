import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Public Grievance Redressal & Emergency Helpdesk',
  description:
    'Yuva Kranti Dal helpline & grievance portal: lodge emergency blood requests, community complaints, or social support appeals.',
  alternates: {
    canonical: '/complaints',
  },
  openGraph: {
    title: 'Grievance Redressal & Helpdesk | Yuva Kranti Dal',
    description:
      'Transparent community support and grievance redressal helpline operated by Yuva Kranti Dal.',
    url: `${SITE_CONFIG.url}/complaints`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Helpdesk & Grievance', path: '/complaints' },
];

export default function ComplaintsLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
