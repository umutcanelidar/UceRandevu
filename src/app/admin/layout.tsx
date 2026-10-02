'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useApp();
  const router = useRouter();

  // Personelin yönetici sayfalarına sızmasını kesin olarak engelle
  if (currentUser.role === 'STAFF') {
    return (
      <div className="min-h-screen bg-[#FAF7F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-brand-200 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-brand-950">Erişim Yetkisi Yok</h2>
          <p className="text-xs text-brand-700 leading-relaxed">
            Personel hesabı ile yönetici paneline erişim yetkiniz bulunmamaktadır. Kasa, mali kayıtlar ve personel yönetimi gizlidir.
          </p>
          <button
            onClick={() => router.push('/staff')}
            className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Personel Ajandama Dön</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex-1 flex w-full min-w-0">
        <Sidebar />
        <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
