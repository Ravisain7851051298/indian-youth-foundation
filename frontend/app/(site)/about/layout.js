import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'About Us | Our Story, Mission & Journey',
  description:
    'Learn about Indian Youth Foundation (भारतीय युवा क्रांति) - our journey, leadership, mission, and transparent 12A & 80G certified grassroots operations across India.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Indian Youth Foundation (भारतीय युवा क्रांति)',
    description:
      'Learn about Indian Youth Foundation, our journey, mission, and 12A & 80G certified transparent grassroots initiatives.',
    url: `${SITE_CONFIG.url}/about`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
];

export default function AboutLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
