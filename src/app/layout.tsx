import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'UCE Randevu & Salon Yönetim Sistemi',
  description: 'Küçük esnaflar için modern randevu, personel takvimi, kasa ve otomasyon platformu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-slate-50 min-h-screen antialiased text-slate-800">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
