import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Our Journey & Impact Stories - From Spark to Movement',
  description:
    'The story behind Yuva Kranti Dal (युवा क्रांति दल) - how passionate youth came together to bring social transformation to underserved communities across India.',
  alternates: {
    canonical: '/story',
  },
  openGraph: {
    title: 'The Story of Yuva Kranti Dal',
    description:
      'Discover our origin, early struggles, grassroots breakthroughs, and continuous journey to uplift communities.',
    url: `${SITE_CONFIG.url}/story`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Our Story', path: '/story' },
];

export default function StoryLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
