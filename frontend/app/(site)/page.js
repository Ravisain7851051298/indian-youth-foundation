import React from 'react';
import HomeClient from './HomeClient';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG, generateFaqSchema } from '@/lib/seoData';

export const metadata = {
  title: 'Yuva Kranti Dal | युवा क्रांति दल - 12A & 80G Certified NGO',
  description:
    'Join India’s premier youth movement dedicated to underprivileged child education, 24/7 emergency blood donor network, women livelihood, and grassroots empowerment. 100% transparent giving with Section 80G tax benefits.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Yuva Kranti Dal | युवा क्रांति दल - 12A & 80G Certified NGO',
    description:
      'Empowering Youth, Transforming Society, Nation First. Discover verified causes, volunteer opportunities, and instant 80G tax-exempt donation receipts.',
    url: SITE_CONFIG.url,
    siteName: 'Yuva Kranti Dal',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 800,
        alt: 'Yuva Kranti Dal',
      },
    ],
  },
};

const homeFaqs = [
  {
    question: 'What is Yuva Kranti Dal (युवा क्रांति दल)?',
    answer:
      'Yuva Kranti Dal (युवा क्रांति दल) is a government-registered 12A and 80G certified non-profit organization mobilizing youth across India for free child education, emergency healthcare, rural empowerment, and national development.',
  },
  {
    question: 'Are donations to Yuva Kranti Dal eligible for Section 80G income tax deduction?',
    answer:
      'Yes, donations made to Yuva Kranti Dal are 50% tax deductible under Section 80G of the Indian Income Tax Act. Instant digital 80G receipts are issued automatically upon donation.',
  },
  {
    question: 'How can I become an official volunteer or member?',
    answer:
      'Youth can register online through our portal. Volunteers receive digital volunteer certificates, and registered members obtain a personalized membership ID card with a verifiable QR code.',
  },
  {
    question: 'How does the emergency blood donation support work?',
    answer:
      'Our dedicated 24/7 voluntary blood network connects critical patients in need with verified local donors across districts in real time with zero charges.',
  },
];

export default function HomePage() {
  const faqSchema = generateFaqSchema(homeFaqs);

  return (
    <>
      <JsonLd data={faqSchema} />
      <HomeClient />
    </>
  );
}
