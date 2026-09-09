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
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, tenant } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const adminNav = [
    { name: 'Randevu Takvimi', href: '/admin/calendar', icon: Calendar },
    { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
    { name: 'Kasa & Gelir-Gider', href: '/admin/finance', icon: Wallet, badge: 'Kasa' },
    { name: 'Personeller', href: '/admin/staff', icon: Users },
    { name: 'Hizmetler & Fiyatlar', href: '/admin/services', icon: Tag },
    { name: 'WhatsApp Otomasyonu', href: '/admin/automations', icon: MessageSquare, badge: 'Aktif' },
  ];

  const staffNav = [
    { name: 'Randevularım', href: '/staff', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 text-slate-700">
      <div className="space-y-5">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
              isAdmin ? 'bg-blue-600 shadow-xs' : 'bg-slate-700'
            }`}>
              {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-blue-600' : 'bg-emerald-500'}`} />
                <span className="text-[11px] text-slate-500 font-medium">
                  {isAdmin ? 'Salon Sahibi (Yönetici)' : `Personel: ${currentUser.staffId}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            {isAdmin ? 'YÖNETİM MENÜSÜ' : 'ÇALIŞAN ALANI'}
          </div>
          <nav className="space-y-1">
            {isAdmin
              ? adminNav.map((item) => {
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
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })
              : staffNav.map((item) => {
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

      {/* Footer */}
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
  );
}
