import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Become an Official Member | Get QR Code ID Card',
  description:
    'Register as a permanent member of Indian Youth Foundation. Receive official appointment letter, verified digital member ID card with QR code, and lead district chapters.',
  alternates: {
    canonical: '/members',
  },
  openGraph: {
    title: 'Become an Official Member | Indian Youth Foundation',
    description:
      'Join our recognized national youth network. Get official appointment letter, smart ID card with verifiable QR code, and lead social initiatives.',
    url: `${SITE_CONFIG.url}/members`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Members', path: '/members' },
];

export default function MembersLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
