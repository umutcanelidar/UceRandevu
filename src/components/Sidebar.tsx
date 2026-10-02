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
  Layers,
  ShoppingBag,
  Boxes,
  Clock,
  UserCheck,
  Sparkles,
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
    { name: 'Müşteriler & CRM', href: '/admin/customers', icon: UserCheck, badge: '45 Gün' },
    { name: 'Paketler & Seanslar', href: '/admin/packages', icon: Layers, badge: 'Seans' },
    { name: 'Ürün Satışı (POS)', href: '/admin/pos', icon: ShoppingBag, badge: 'Perakende' },
    { name: 'Malzeme Stokları', href: '/admin/inventory', icon: Boxes, badge: 'Stok' },
    { name: 'Bekleme Listesi', href: '/admin/waitlist', icon: Clock, badge: 'Waitlist' },
    { name: 'Kasa & Gelir-Gider', href: '/admin/finance', icon: Wallet, badge: 'Net Kâr' },
    { name: 'Personeller & İzinler', href: '/admin/staff', icon: Users },
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
      <aside className="hidden md:flex w-64 bg-white border-r border-brand-100 min-h-[calc(100vh-4rem)] flex-col justify-between p-4 text-brand-950 shrink-0">
        <div className="space-y-5">
          {/* User Profile Card */}
          <div className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-100/80">
            <div className="flex items-center space-x-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                  isAdmin ? 'bg-brand-700 shadow-brand-700/20' : 'bg-brand-900'
                }`}
              >
                {isAdmin ? <Shield className="w-4 h-4 text-amber-200" /> : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-950 truncate">{currentUser.name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isAdmin ? 'bg-brand-600' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[11px] text-brand-800 font-medium">
                    {isAdmin ? 'Salon Sahibi (Yönetici)' : `Personel: ${currentUser.staffId}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-brand-400 uppercase">
              {isAdmin ? 'BAGE YÖNETİM MENÜSÜ' : 'ÇALIŞAN ALANI'}
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
                        ? 'bg-brand-50 text-brand-800 font-bold border-l-4 border-brand-700 border-y border-r border-brand-100 shadow-xs'
                        : 'text-brand-900 hover:bg-brand-50/50 hover:text-brand-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-brand-600/70'}`} />
                      <span className="tracking-tight">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive
                            ? 'bg-brand-700 text-white'
                            : 'bg-brand-100/70 text-brand-800 border border-brand-200/50'
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
            <div className="p-3.5 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-brand-950 font-bold text-xs">
                <Lock className="w-3.5 h-3.5 text-brand-700" />
                <span>Kasa Gizliliği Aktif</span>
              </div>
              <p className="text-[11px] text-brand-700/80 leading-relaxed">
                İşletmenin kasa, ciro ve mali kayıtları yalnızca salon sahibi tarafından görüntülenebilir.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Footer */}
        <div className="pt-3 border-t border-brand-100 space-y-2">
          <Link
            href={`/book/${tenant.slug}`}
            target="_blank"
            className="flex items-center justify-between text-xs font-semibold text-brand-800 hover:text-brand-950 p-2 rounded-lg hover:bg-brand-50 bg-brand-50/40 border border-brand-200 transition"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-700" />
              <span className="text-brand-800 font-bold">Online Randevu Linki</span>
            </div>
            <ExternalLink className="w-3 h-3 text-brand-600" />
          </Link>
          <div className="text-[10px] text-brand-400 text-center font-medium flex items-center justify-center space-x-1">
            <Sparkles className="w-3 h-3 text-brand-400" />
            <span>BAGENailStudio • UCE Bilişim</span>
          </div>
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-IN DRAWER & BACKDROP (Only on < md) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-brand-950/60 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between p-4 overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-brand-200 bg-brand-900 shrink-0">
                    <img
                      src="/bage-logo.jpg"
                      alt="BAGE Nail Studio"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs text-brand-950 tracking-tight truncate max-w-[170px]">
                      BAGE Nail Studio | Beaute
                    </h2>
                    <span className="text-[10px] font-semibold text-brand-700">
                      Bagenailstudiobeaute.com
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-brand-600 hover:text-brand-950 hover:bg-brand-50 rounded-lg transition cursor-pointer"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-5 h-5 text-brand-700" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 space-y-2">
                <div className="text-[10px] font-bold tracking-wider text-brand-400 uppercase">
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
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-white text-brand-800 hover:bg-brand-50 border border-brand-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
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
                              ? 'bg-brand-800 text-white font-bold shadow-xs'
                              : 'bg-white text-brand-800 hover:bg-brand-50 border border-brand-100'
                          }`}
                        >
                          <User className="w-3.5 h-3.5 shrink-0 text-brand-600" />
                          <span className="truncate">{s.name.split(' ')[0]} ({s.staffCode})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div>
                <div className="px-1 mb-2 text-[10px] font-bold tracking-wider text-brand-400 uppercase">
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
                            ? 'bg-brand-50 text-brand-800 font-bold border-l-4 border-brand-700 border-y border-r border-brand-100'
                            : 'text-brand-900 hover:bg-brand-50/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-brand-700' : 'text-brand-600'}`} />
                          <span className="text-brand-900 font-medium">{item.name}</span>
                        </div>
                        {item.badge ? (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              isActive
                                ? 'bg-brand-700 text-white'
                                : 'bg-brand-100 text-brand-800'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-brand-300" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Confidentiality Warning for Staff */}
              {!isAdmin && (
                <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 space-y-1">
                  <div className="flex items-center space-x-1.5 text-brand-950 font-bold text-xs">
                    <Lock className="w-3.5 h-3.5 text-brand-700" />
                    <span>Kasa Gizliliği Aktif</span>
                  </div>
                  <p className="text-[11px] text-brand-700/80 leading-relaxed">
                    İşletmenin kasa ve mali kayıtları gizlidir.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-3 border-t border-brand-100 space-y-2 mt-4">
              <Link
                href={`/book/${tenant.slug}`}
                target="_blank"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs font-semibold text-brand-800 p-2.5 rounded-xl bg-brand-50 border border-brand-200 transition"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand-700" />
                  <span className="font-bold text-brand-800">Online Randevu Linki</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-700" />
              </Link>
              <p className="text-[10px] text-brand-400 text-center font-medium">
                Bagenailstudiobeaute.com • UCE Bilişim
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly, fixed at bottom on < md) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-100 py-1.5 px-2 flex items-center justify-around shadow-lg">
        {isAdmin ? (
          <>
            {/* Takvim */}
            <Link
              href="/admin/calendar"
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition ${
                pathname === '/admin/calendar'
                  ? 'text-brand-700 font-bold'
                  : 'text-brand-900/60 hover:text-brand-800'
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
                  ? 'text-brand-700 font-bold'
                  : 'text-brand-900/60 hover:text-brand-800'
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
                  ? 'text-brand-700 font-bold'
                  : 'text-brand-900/60 hover:text-brand-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Özet</span>
            </Link>

            {/* Menü Açıcı */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center py-1 px-3 rounded-lg text-brand-900/60 hover:text-brand-800 transition cursor-pointer"
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
                  ? 'text-brand-700 font-bold'
                  : 'text-brand-900/60 hover:text-brand-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Randevularım</span>
            </Link>

            {/* Menü Açıcı */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col items-center py-1 px-4 rounded-lg text-brand-900/60 hover:text-brand-800 transition cursor-pointer"
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
