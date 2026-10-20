import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/store/ReduxProvider';
import { NGOProvider } from '@/context/NGOContext';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG, defaultOrganizationSchema, defaultWebSiteSchema } from '@/lib/seoData';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const baseUrl = new URL(SITE_CONFIG.url);

export const metadata = {
  metadataBase: baseUrl,
  title: {
    default: 'Yuva Kranti Dal | युवा क्रांति दल - 12A & 80G Certified NGO',
    template: '%s | Yuva Kranti Dal',
  },
  description:
    'सशक्त युवा, समर्थ समाज, राष्ट्र निर्माण में समर्पित - Yuva Kranti Dal is a 12A & 80G certified NGO in India. Support child education, 24/7 emergency blood donation, youth livelihood, and relief projects with 50% income tax exemption.',
  applicationName: 'Yuva Kranti Dal',
  authors: [{ name: 'Yuva Kranti Dal', url: SITE_CONFIG.url }],
  creator: 'Yuva Kranti Dal',
  publisher: 'Yuva Kranti Dal',
  category: 'Non-Governmental Organization',
  keywords: [
    'Yuva Kranti Dal',
    'युवा क्रांति दल',
    'NGO in India',
    '80G tax exemption donation',
    '12A registered NGO',
    'online donation 80g receipt',
    'youth empowerment India',
    'volunteer in NGO',
    'blood donation emergency helpline',
    'child education NGO India',
    'underprivileged education',
    'NGO membership card with QR code',
    'crowdfunding India causes',
    'CSR eligible NGO',
    'Aligarh NGO Uttar Pradesh',
  ],
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'hi-IN': '/',
    },
  },
  openGraph: {
    title: 'Yuva Kranti Dal | युवा क्रांति दल - 12A & 80G Certified NGO',
    description:
      'Empowering Youth, Transforming Society, Nation First. Join India’s leading youth social welfare movement for child literacy, emergency healthcare, and grassroots change.',
    url: SITE_CONFIG.url,
    siteName: 'Yuva Kranti Dal',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 800,
        alt: 'Yuva Kranti Dal - युवा क्रांति दल Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yuva Kranti Dal | युवा क्रांति दल',
    description:
      '12A & 80G certified NGO empowering youth for education, emergency blood donation, and nation building.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.className} ${plusJakartaSans.variable}`}>
      <head>
        <JsonLd data={defaultOrganizationSchema} />
        <JsonLd data={defaultWebSiteSchema} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black">
        <ReduxProvider>
          <NGOProvider>
            {children}
            <Toaster position="top-right" />
          </NGOProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
