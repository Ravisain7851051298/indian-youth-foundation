import './globals.css';
import ReduxProvider from '@/store/ReduxProvider';
import { NGOProvider } from '@/context/NGOContext';

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <ReduxProvider>
          <NGOProvider>
            {children}
          </NGOProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
