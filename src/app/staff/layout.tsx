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
    <div className="min-h-screen bg-slate-50 flex flex-col w-full overflow-x-hidden">
      <Header />
      <div className="flex-1 flex w-full min-w-0">
        <Sidebar />
        <main className="flex-1 w-full min-w-0 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
