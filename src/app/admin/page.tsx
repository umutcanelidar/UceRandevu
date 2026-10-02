'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Wallet,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Gift,
  Boxes,
  Layers,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser,
    tenant,
    staffList,
    services,
    appointments,
    transactions,
    customers,
    inventoryItems,
    customerPackages,
    waitlist,
    productSales,
    getMaskedName,
    getMaskedPhone,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';
  const todayStr = new Date().toISOString().split('T')[0];

  // Appointments today
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const completedToday = todayAppointments.filter((a) => a.status === 'COMPLETED');
  const cancelledToday = todayAppointments.filter((a) => a.status === 'CANCELLED');
  const confirmedToday = todayAppointments.filter((a) => a.status === 'CONFIRMED');

  // Revenue calculations
  const realizedRevenueToday = transactions
    .filter((t) => t.type === 'INCOME' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const expectedRevenueToday = todayAppointments.reduce((sum, a) => sum + a.price, 0);

  // Target Progress
  const dailyTarget = tenant.dailyTarget || 7500;
  const targetPercent = Math.min(100, Math.round((realizedRevenueToday / dailyTarget) * 100));

  // Monthly Revenue
  const totalMonthlyIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMonthlyExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netMonthlyProfit = totalMonthlyIncome - totalMonthlyExpense;

  // 45 Days Retention Alert
  const todayDate = new Date();
  const churnCustomers = customers.filter((c) => {
    if (!c.lastVisitDate) return false;
    const diffDays = Math.floor(
      (todayDate.getTime() - new Date(c.lastVisitDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays >= 45;
  });

  // Critical Low Stock Items
  const criticalStockItems = inventoryItems.filter((i) => i.quantity <= i.minThreshold);
  const activeWaitlistCount = waitlist.filter((w) => w.status === 'WAITING').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
              BAGE Yönetici Paneli
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-800 border border-brand-200">
              Bagenailstudiobeaute.com
            </span>
          </div>
          <p className="text-xs text-brand-700 mt-1">
            BAGE Nail Studio | Beaute • Günlük randevu, ciro, hedef ve operasyonel göstergeler
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/calendar"
            className="px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-sm shadow-brand-900/10 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-200" />
            <span>Takvime Git</span>
          </Link>
          <Link
            href="/admin/pos"
            className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-xl border border-brand-200 transition flex items-center space-x-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-brand-700" />
            <span>Hızlı Satış (POS)</span>
          </Link>
        </div>
      </div>

      {/* Critical Alert Banners (45 Days & Stock) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 45 Days Retention Banner */}
        {churnCustomers.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-950">
                  ⚠️ 45+ Gündür Gelmeyen {churnCustomers.length} Müşteri Var!
                </h4>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                  Tırnak bakım döngüsü geçmiş müşterileri WhatsApp ile geri çağırarak cironuzu artırabilirsiniz.
                </p>
              </div>
            </div>
            <Link
              href="/admin/customers"
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-xl transition shrink-0 ml-3 cursor-pointer"
            >
              Geri Çağır
            </Link>
          </div>
        )}

        {/* Critical Stock Warning Banner */}
        {criticalStockItems.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start justify-between shadow-xs">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  📦 {criticalStockItems.length} Sarf Malzeme Kritik Seviyede!
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Builder jel, top coat veya sarf malzemeleri tükenmek üzere. Lütfen stokları kontrol edin.
                </p>
              </div>
            </div>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-xl transition shrink-0 ml-3 cursor-pointer"
            >
              Stokları Gör
            </Link>
          </div>
        )}
      </div>

      {/* Target Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                Bugünkü Günlük Ciro Hedefi
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-bold font-serif text-brand-950">{realizedRevenueToday.toLocaleString('tr-TR')} ₺</span>
                <span className="text-xs text-brand-700/70">/ Hedef: {dailyTarget.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-brand-800 font-serif">%{targetPercent}</span>
            <p className="text-[10px] text-brand-700">Gerçekleşme Oranı</p>
          </div>
        </div>

        <div className="w-full bg-brand-50 rounded-full h-2.5 overflow-hidden border border-brand-100">
          <div
            className="h-full bg-gradient-to-r from-brand-700 to-brand-800 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Bugünkü Randevular */}
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Bugünkü Randevular</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950">{todayAppointments.length} Müşteri</div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-emerald-800 font-bold">{completedToday.length} Tamamlandı</span>
            <span className="text-brand-700 font-bold">{confirmedToday.length} Bekliyor</span>
          </div>
        </div>

        {/* 2. Bugünkü Gerçekleşen Ciro */}
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Gerçekleşen Ciro</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950">{realizedRevenueToday.toLocaleString('tr-TR')} ₺</div>
          <p className="text-[11px] text-brand-700">Bugün kasaya giren net tahsilat</p>
        </div>

        {/* 3. Bugünkü Beklenen Ciro */}
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Beklenen Ciro</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-brand-800">{expectedRevenueToday.toLocaleString('tr-TR')} ₺</div>
          <p className="text-[11px] text-brand-700">Bugünkü randevuların toplam potansiyeli</p>
        </div>

        {/* 4. Bekleme Listesi (Waitlist) */}
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Bekleme Listesi</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950">{activeWaitlistCount} Sırada</div>
          <p className="text-[11px] text-brand-700">İptal olduğunda hemen çağrılacak</p>
        </div>
      </div>

      {/* Today's Appointments Table */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-100 flex items-center justify-between bg-brand-50/30">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-brand-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-950">
              Bugünkü Randevu Akışı ({todayStr})
            </h3>
          </div>
          <Link
            href="/admin/calendar"
            className="text-xs font-bold text-brand-800 hover:text-brand-950 flex items-center space-x-1"
          >
            <span>Tüm Takvim</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-950">
            <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase tracking-wider border-b border-brand-100">
              <tr>
                <th className="px-5 py-3">Saat</th>
                <th className="px-5 py-3">Müşteri</th>
                <th className="px-5 py-3">İşlem & Süre</th>
                <th className="px-5 py-3">Uzman</th>
                <th className="px-5 py-3">Tutar / Ödeme</th>
                <th className="px-5 py-3 text-right">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {todayAppointments.map((apt) => {
                const srv = services.find((s) => s.id === apt.serviceId);
                const staff = staffList.find((s) => s.id === apt.staffId);
                const isCompleted = apt.status === 'COMPLETED';
                const isCancelled = apt.status === 'CANCELLED';

                return (
                  <tr key={apt.id} className="hover:bg-brand-50/30 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-brand-800">
                      {apt.startTime} - {apt.endTime}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-950">
                      {getMaskedName(apt.customerName)}
                    </td>
                    <td className="px-5 py-3.5 text-brand-800 font-medium">
                      {srv?.name} ({srv?.durationMinutes} dk)
                    </td>
                    <td className="px-5 py-3.5 text-brand-700">{staff?.name}</td>
                    <td className="px-5 py-3.5 font-bold font-serif text-brand-950">
                      {apt.price} ₺
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-brand-50 text-brand-800 border border-brand-200'
                        }`}
                      >
                        {isCompleted ? 'Tamamlandı' : isCancelled ? 'İptal' : 'Onaylandı'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {todayAppointments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-400">
                    Bugün için henüz randevu bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
