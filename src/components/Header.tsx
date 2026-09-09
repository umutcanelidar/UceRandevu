'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
} from 'lucide-react';

export default function Header() {
  const { tenant, currentUser, staffList, switchUser, setIsMobileMenuOpen } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Mobile Hamburger & Corporate Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/admin/calendar" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                    {tenant.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    UCE Randevu
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-500 font-medium truncate">
                  Randevu, Personel ve Kasa Yönetim Sistemi
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Public Booking Link (Desktop) */}
            <Link
              href={`/book/${tenant.slug}`}
              target="_blank"
              className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition"
            >
              <span>Müşteri Sayfası</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            {/* Mobile Role Switch Trigger Pill */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer"
              title="Rolü Değiştirmek İçin Dokun"
            >
              {isAdmin ? (
                <span className="flex items-center space-x-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Yönetici</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentUser.staffId}</span>
                </span>
              )}
            </button>

            {/* Desktop Role Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
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
                    <span>{staff.name.split(' ')[0]}</span>
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
