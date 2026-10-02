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
  Sparkles,
} from 'lucide-react';

export default function Header() {
  const { tenant, currentUser, staffList, switchUser, setIsMobileMenuOpen } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Mobile Hamburger & Corporate Brand Identity */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-brand-800 hover:text-brand-950 rounded-lg hover:bg-brand-50 transition cursor-pointer"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-5 h-5 text-brand-700" />
            </button>

            <Link href="/admin/calendar" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-brand-900/10 shrink-0 border border-brand-200 bg-brand-900">
                <img
                  src="/bage-logo.jpg"
                  alt="BAGE Nail Studio"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-bold text-xs sm:text-sm text-brand-950 tracking-tight truncate">
                    BAGE Nail Studio | Beaute
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 shrink-0">
                    Bagenailstudiobeaute.com
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-brand-700/80 font-medium truncate">
                  BAGE Online Randevu & İşletme Yönetim Sistemi
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
              className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100/70 text-brand-800 hover:text-brand-950 border border-brand-200 transition shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-700" />
              <span>BAGE Online Randevu Sistemi</span>
              <ExternalLink className="w-3 h-3 text-brand-500" />
            </Link>

            {/* Mobile Role Switch Trigger Pill */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer"
              title="Rolü Değiştirmek İçin Dokun"
            >
              {isAdmin ? (
                <span className="flex items-center space-x-1 text-brand-900 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  <span>Yönetici</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{currentUser.staffId}</span>
                </span>
              )}
            </button>

            {/* Desktop Role Switcher */}
            <div className="hidden md:flex items-center bg-brand-50/50 p-1 rounded-xl border border-brand-100 text-xs">
              <button
                onClick={() => switchUser('SPECIAL_ADMIN')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  isAdmin
                    ? 'bg-white text-brand-800 shadow-xs border border-brand-200 font-bold'
                    : 'text-brand-700/80 hover:text-brand-950'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-brand-700" />
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
                        ? 'bg-white text-brand-800 shadow-xs border border-brand-200 font-bold'
                        : 'text-brand-700/70 hover:text-brand-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span>{staff.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-brand-400">({staff.staffCode})</span>
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
