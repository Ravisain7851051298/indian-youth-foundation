import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Legal Registrations & Certifications - 12A, 80G, CSR-1 & NGO Darpan',
  description:
    'Verify government recognitions and official credentials of Yuva Kranti Dal: 12A, 80G tax exemption, CSR-1 eligibility, NITI Aayog NGO Darpan, and PAN records.',
  alternates: {
    canonical: '/certificates',
  },
  openGraph: {
    title: 'Legal Registrations & Compliance Certificates | Yuva Kranti Dal',
    description:
      'View official certificates: 12A, 80G Income Tax Exemption, CSR-1 registration, and NITI Aayog Darpan credentials for complete transparency.',
    url: `${SITE_CONFIG.url}/certificates`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Legal Certificates', path: '/certificates' },
];

export default function CertificatesLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
