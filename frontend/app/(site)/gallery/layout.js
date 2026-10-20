import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Media Gallery - Photo & Video Archives',
  description:
    'Visual journey of Yuva Kranti Dal: photos, field videos, blood donation drives, relief distributions, and community empowerment moments.',
  alternates: {
    canonical: '/gallery',
  },
  openGraph: {
    title: 'Media Gallery | Yuva Kranti Dal',
    description:
      'Glimpse our work in action through high-resolution photos and field videos of youth empowerment.',
    url: `${SITE_CONFIG.url}/gallery`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Media Gallery', path: '/gallery' },
];

export default function GalleryLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
