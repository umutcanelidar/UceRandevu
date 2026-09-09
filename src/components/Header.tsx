'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  ExternalLink,
  ShieldCheck,
  User,
  CheckCircle2,
} from 'lucide-react';

export default function Header() {
  const { tenant, currentUser, staffList, switchUser } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Corporate Brand Identity */}
          <Link href="/admin/calendar" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 tracking-tight">
                  {tenant.name}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  UCE Randevu
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Randevu, Personel ve Kasa Yönetim Sistemi
              </p>
            </div>
          </Link>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Public Booking Link */}
            <Link
              href={`/book/${tenant.slug}`}
              target="_blank"
              className="hidden md:inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition"
            >
              <span>Müşteri Randevu Sayfası</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Clean Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => switchUser('SPECIAL_ADMIN')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  isAdmin
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Yönetici (Kasa & Tüm Panel)</span>
              </button>

              {staffList.slice(0, 2).map((staff) => {
                const isCurrent =
                  currentUser.role === 'STAFF' && currentUser.staffId === staff.staffCode;

                return (
                  <button
                    key={staff.id}
                    onClick={() => switchUser('STAFF', staff.staffCode)}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                      isCurrent
                        ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{staff.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400">({staff.staffCode})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
