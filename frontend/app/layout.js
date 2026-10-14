import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from '@/store/ReduxProvider';
import { NGOProvider } from '@/context/NGOContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'भारतीय युवा क्रांति | Indian Youth Foundation - 12A & 80G Certified NGO',
  description: 'सशक्त युवा, समर्थ समाज, राष्ट्र निर्माण में समर्पित - देश के युवाओं का अग्रणी सामाजिक संगठन। QR कोड ID कार्ड, 80G आयकर छूट रसीद, क्राउडफंडिंग व समाज सेवा।',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased ${plusJakartaSans.className} ${plusJakartaSans.variable}`}>
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
