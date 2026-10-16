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
    default: 'Indian Youth Foundation | भारतीय युवा क्रांति - 12A & 80G Certified NGO',
    template: '%s | Indian Youth Foundation',
  },
  description:
    'सशक्त युवा, समर्थ समाज, राष्ट्र निर्माण में समर्पित - Indian Youth Foundation is a 12A & 80G certified NGO in India. Support child education, 24/7 emergency blood donation, youth livelihood, and relief projects with 50% income tax exemption.',
  applicationName: 'Indian Youth Foundation',
  authors: [{ name: 'Indian Youth Foundation', url: SITE_CONFIG.url }],
  creator: 'Indian Youth Foundation',
  publisher: 'Indian Youth Foundation',
  category: 'Non-Governmental Organization',
  keywords: [
    'Indian Youth Foundation',
    'भारतीय युवा क्रांति',
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
    title: 'Indian Youth Foundation | भारतीय युवा क्रांति - 12A & 80G Certified NGO',
    description:
      'Empowering Youth, Transforming Society, Nation First. Join India’s leading youth social welfare movement for child literacy, emergency healthcare, and grassroots change.',
    url: SITE_CONFIG.url,
    siteName: 'Indian Youth Foundation',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.jpeg',
        width: 800,
        height: 800,
        alt: 'Indian Youth Foundation - भारतीय युवा क्रांति Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Youth Foundation | भारतीय युवा क्रांति',
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
