import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Social Services & Community Initiatives',
  description:
    'Key welfare services provided by Yuva Kranti Dal: Shiksha Kranti free education, 24/7 blood helpline, women livelihood training, emergency ambulance, and legal awareness.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Our Social Services | Yuva Kranti Dal',
    description:
      'Grassroots welfare initiatives transforming society through education, healthcare, and livelihood support.',
    url: `${SITE_CONFIG.url}/services`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Our Services', path: '/services' },
];

export default function ServicesLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
