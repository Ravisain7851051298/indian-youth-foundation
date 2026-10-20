import { SITE_CONFIG, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seoData';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = {
  title: '80G Income Tax Exemption Guide & Calculator',
  description:
    'Calculate and save tax with Section 80G deductions by donating to Yuva Kranti Dal. Learn eligibility rules, deduction limits, and download instant 80G receipts.',
  alternates: {
    canonical: '/donation/80G',
  },
  openGraph: {
    title: '80G Tax Exemption Guide & Calculator | Yuva Kranti Dal',
    description:
      'Understand how 50% tax deductions work under Section 80G of the Indian Income Tax Act. Donate to certified NGO and download official receipts.',
    url: `${SITE_CONFIG.url}/donation/80G`,
  },
};

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Donate Online', path: '/donation' },
  { name: '80G Tax Exemption', path: '/donation/80G' },
];

const taxFaqs = [
  {
    question: 'How much tax deduction can I claim under Section 80G for donations to Yuva Kranti Dal?',
    answer:
      'Donors are eligible to claim a 50% deduction of the donated amount from their taxable income under Section 80G of the Income Tax Act, subject to statutory limits.',
  },
  {
    question: 'What details are required to generate an 80G receipt?',
    answer:
      'To issue an official Section 80G receipt and file Form 10BD with the Income Tax Department, the donor must provide their Full Name, PAN number, and Address.',
  },
  {
    question: 'When will I receive my 80G donation receipt?',
    answer:
      'Instant digital 80G receipts with registration and certification numbers are generated immediately upon successful online payment.',
  },
];

export default function Donation80GLayout({ children }) {
  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
      <JsonLd data={generateFaqSchema(taxFaqs)} />
      {children}
    </>
  );
}
