import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'UCE Randevu - Randevu ve İşletme Yönetim Platformu',
  description: 'Modern randevu, personel takvimi, kasa ve otomasyon platformu.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="bg-slate-50 min-h-screen antialiased text-slate-800 overflow-x-hidden w-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
