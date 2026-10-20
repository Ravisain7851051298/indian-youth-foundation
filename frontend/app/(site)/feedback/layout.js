import { SITE_CONFIG, generateBreadcrumbSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Contact Us & Community Feedback',
  description:
    'Get in touch with Yuva Kranti Dal headquarters in Aligarh, Uttar Pradesh. Send your feedback, collaborate on CSR drives, or ask questions.',
  alternates: {
    canonical: '/feedback',
  },
  openGraph: {
    title: 'Contact & Feedback | Yuva Kranti Dal',
    description:
      'We welcome questions, suggestions, volunteer inquiries, and CSR partnership proposals. Reach out to our team.',
    url: `${SITE_CONFIG.url}/feedback`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Feedback & Contact', path: '/feedback' },
];

export default function FeedbackLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      {children}
    </>
  );
}
