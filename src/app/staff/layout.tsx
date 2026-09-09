'use client';

import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-5 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-5xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
