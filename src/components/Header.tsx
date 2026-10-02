'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  ExternalLink,
  ShieldCheck,
  User,
  Menu,
  Sparkles,
  LogOut,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { tenant, currentUser, switchUser, setIsMobileMenuOpen } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const handleLogout = () => {
    switchUser('SPECIAL_ADMIN');
    router.push('/login');
  };

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

            <Link href={isAdmin ? "/admin/calendar" : "/staff"} className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
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
                  {isAdmin ? 'BAGE Online Randevu & İşletme Yönetim Sistemi' : 'Personel Randevu & Ajanda Portalı'}
                </p>
              </div>
            </Link>
          </div>

          {/* Right: Quick Actions & Safe Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Public Booking Link (Desktop) */}
            <Link
              href={`/book/${tenant.slug}`}
              target="_blank"
              className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100/70 text-brand-800 hover:text-brand-950 border border-brand-200 transition shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-700" />
              <span>BAGE Randevu Ekranı</span>
              <ExternalLink className="w-3 h-3 text-brand-500" />
            </Link>

            {/* Desktop Active User Badge & Logout */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-200/80 text-xs font-semibold text-brand-950 shadow-2xs">
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-brand-700" />
                    <span>Yönetici (Salon Sahibi)</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Personel: {currentUser.name} ({currentUser.staffId})</span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition shadow-2xs cursor-pointer"
                title="Sistemden Güvenli Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış Yap</span>
              </button>
            </div>

            {/* Mobile Exit Button */}
            <button
              onClick={handleLogout}
              className="sm:hidden p-1.5 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 transition cursor-pointer"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
