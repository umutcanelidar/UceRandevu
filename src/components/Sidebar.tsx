'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  LayoutDashboard,
  Wallet,
  Users,
  Tag,
  MessageSquare,
  Lock,
  ExternalLink,
  Shield,
  User,
  X,
  Menu,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, tenant, staffList, switchUser, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  interface NavItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
  }

  const adminNav: NavItem[] = [
    { name: 'Randevu Takvimi', href: '/admin/calendar', icon: Calendar },
    { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
    { name: 'Kasa & Gelir-Gider', href: '/admin/finance', icon: Wallet, badge: 'Kasa' },
    { name: 'Personeller', href: '/admin/staff', icon: Users },
    { name: 'Hizmetler & Fiyatlar', href: '/admin/services', icon: Tag },
    { name: 'WhatsApp Otomasyonu', href: '/admin/automations', icon: MessageSquare, badge: 'Aktif' },
  ];

  const staffNav: NavItem[] = [
    { name: 'Randevularım', href: '/staff', icon: Calendar },
  ];

  const navItems = isAdmin ? adminNav : staffNav;

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on md and up) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex-col justify-between p-4 text-slate-700 shrink-0">
        <div className="space-y-5">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                  isAdmin ? 'bg-blue-600 shadow-xs' : 'bg-slate-700'
                }`}
              >
                {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAdmin ? 'bg-blue-600' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isAdmin ? 'Salon Sahibi (Yönetici)' : `Personel: ${currentUser.staffId}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {isAdmin ? 'YÖNETİM MENÜSÜ' : 'ÇALIŞAN ALANI'}
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Confidentiality Notice for Staff */}
          {!isAdmin && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Kasa Gizliliği Aktif</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                İşletmenin kasa, ciro ve mali kayıtları yalnızca salon sahibi tarafından görüntülenebilir.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Footer */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <Link
            href={`/book/${tenant.slug}`}
            target="_blank"
            className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-700 p-2 rounded-lg hover:bg-slate-50 border border-slate-200 transition"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Online Randevu Linki</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
          <p className="text-[10px] text-slate-400 text-center font-medium">
            UCE Bilişim • Randevu Sistemi
          </p>
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-IN DRAWER & BACKDROP (Only on < md) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs text-slate-900 tracking-tight truncate max-w-[170px]">
                      {tenant.name}
                    </h2>
                    <span className="text-[10px] font-semibold text-blue-600">
                      UCE Randevu Paneli
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Role Switcher (Super Handy on Phone) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  AKTİF KULLANICI ROLÜ
                </div>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      switchUser('SPECIAL_ADMIN');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isAdmin
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Salon Sahibi (Yönetici)</span>
                    </div>
                    {isAdmin && <span className="text-[10px] font-bold">Aktif</span>}
                  </button>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {staffList.slice(0, 4).map((s) => {
                      const isStaffActive =
                        currentUser.role === 'STAFF' && currentUser.staffId === s.staffCode;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            switchUser('STAFF', s.staffCode);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition truncate cursor-pointer ${
                            isStaffActive
                              ? 'bg-emerald-600 text-white font-bold shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{s.name.split(' ')[0]} ({s.staffCode})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div>
                <div className="px-1 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {isAdmin ? 'YÖNETİM MENÜSÜ' : 'ÇALIŞAN MENÜSÜ'}
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Confidentiality Warning for Staff */}
              {!isAdmin && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-800 font-bold text-xs">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kasa Gizliliği Aktif</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    İşletmenin kasa ve mali kayıtları gizlidir.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-3 border-t border-slate-200 space-y-2 mt-4">
              <Link
                href={`/book/${tenant.slug}`}
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs font-semibold text-slate-800 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Müşteri Randevu Sayfası</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              </Link>
              <p className="text-[10px] text-slate-400 text-center font-medium">
                UCE Bilişim • Randevu ve Yönetim Sistemi
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly, fixed at bottom on < md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex items-center justify-around shadow-lg">
        {isAdmin ? (
          <>
            {/* Takvim */}
            <Link
              href="/admin/calendar"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === '/admin/calendar'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Takvim</span>
            </Link>

            {/* Kasa */}
            <Link
              href="/admin/finance"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === '/admin/finance'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Kasa</span>
            </Link>

            {/* Genel Bakış */}
            <Link
              href="/admin"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === '/admin'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Genel Bakış</span>
            </Link>

            {/* Menü Açıcı */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center py-1 px-3 rounded-lg text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Menü</span>
            </button>
          </>
        ) : (
          <>
            {/* Staff Randevularım */}
            <Link
              href="/staff"
              className={`flex flex-col items-center py-1 px-4 rounded-lg transition ${
                pathname === '/staff'
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Randevularım</span>
            </Link>

            {/* Menü Açıcı */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center py-1 px-4 rounded-lg text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Menü & Profil</span>
            </button>
          </>
        )}
      </nav>
    </>
  );
}
