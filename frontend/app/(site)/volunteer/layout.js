import { SITE_CONFIG, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: 'Volunteer with Us - Join the Youth Revolution',
  description:
    'Join Indian Youth Foundation as an active volunteer. Lead social drives in child education, blood donation camps, environmental initiatives, and gain recognized certificates.',
  alternates: {
    canonical: '/volunteer',
  },
  openGraph: {
    title: 'Volunteer with Indian Youth Foundation (भारतीय युवा क्रांति)',
    description:
      'Empower yourself by empowering others. Become an active grassroots volunteer and earn verified certificates.',
    url: `${SITE_CONFIG.url}/volunteer`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Volunteer', path: '/volunteer' },
];

const volunteerFaqs = [
  {
    question: 'Who can volunteer with Indian Youth Foundation?',
    answer:
      'Any passionate youth, student, or professional who wants to contribute time and skills towards education, health camps, or community drives can join.',
  },
  {
    question: 'Do volunteers receive a certificate?',
    answer:
      'Yes, all active volunteers who participate in our campaigns and projects receive a government-recognized digital Volunteer Certificate with verifiable credentials.',
  },
];

export default function VolunteerLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <JsonLd data={generateFaqSchema(volunteerFaqs)} />
      {children}
    </>
  );
}
