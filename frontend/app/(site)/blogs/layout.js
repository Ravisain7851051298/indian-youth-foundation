import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Blog & Articles - Stories of Grassroots Change',
  description:
    'Read articles, news, and real stories of impact from the Yuva Kranti Dal editorial desk. Insights on child education, emergency blood donation, and youth leadership in India.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Stories of Change & Articles | Yuva Kranti Dal',
    description:
      'Inspirational updates, ground reports, and grassroots stories of transforming lives through youth action.',
    url: `${SITE_CONFIG.url}/blogs`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blogs & Articles', path: '/blogs' },
];

export default function BlogsLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
