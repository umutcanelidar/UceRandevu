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
  // Realized revenue today (Transactions of type INCOME on today's date)
  const realizedRevenueToday = transactions
    .filter((t) => t.type === 'INCOME' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  // Expected revenue today (Sum of confirmed + completed appointments today + products sold)
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

  // Active waitlist count
  const activeWaitlistCount = waitlist.filter((w) => w.status === 'WAITING').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              BAGE Yönetici Paneli
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Canlı Takip
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tenant.name} • Günlük randevu, ciro, hedef ve operasyonel göstergeler
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/calendar"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Takvime Git</span>
          </Link>
          <Link
            href="/admin/pos"
            className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
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
                <h4 className="text-xs font-extrabold text-rose-900">
                  ⚠️ 45+ Gündür Gelmeyen {churnCustomers.length} Müşteri Var!
                </h4>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                  Tırnak bakım döngüsü geçmiş müşterileri WhatsApp ile geri çağırarak cironuzu artırabilirsiniz.
                </p>
              </div>
            </div>
            <Link
              href="/admin/customers"
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] rounded-lg transition shrink-0 ml-3 cursor-pointer"
            >
              İncele & Çağır
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
                <h4 className="text-xs font-extrabold text-amber-900">
                  📦 {criticalStockItems.length} Sarf Malzeme Kritik Seviyede!
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Builder jel, top coat veya sarf malzemeleri tükenmek üzere. Lütfen tedarik siparişini kontrol edin.
                </p>
              </div>
            </div>
            <Link
              href="/admin/inventory"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg transition shrink-0 ml-3 cursor-pointer"
            >
              Stokları Gör
            </Link>
          </div>
        )}
      </div>

      {/* Target Progress Bar (Hedef Ciro) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bugünkü Günlük Hedef Ciro
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-slate-900">{realizedRevenueToday} ₺</span>
                <span className="text-xs text-slate-400">/ Hedef: {dailyTarget} ₺</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-emerald-600">%{targetPercent}</span>
            <p className="text-[10px] text-slate-400">Tamamlanma Oranı</p>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${targetPercent}%` }}
          />
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Bugünkü Randevular */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Bugünkü Randevular</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{todayAppointments.length} Müşteri</div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="text-emerald-600 font-bold">{completedToday.length} Tamamlandı</span>
            <span className="text-amber-600 font-bold">{confirmedToday.length} Bekliyor</span>
          </div>
        </div>

        {/* 2. Bugünkü Gerçekleşen Ciro */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Gerçekleşen Ciro</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{realizedRevenueToday} ₺</div>
          <p className="text-[11px] text-slate-400">Bugün kasaya giren net tahsilat</p>
        </div>

        {/* 3. Bugünkü Beklenen Ciro */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Beklenen Ciro</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-700">{expectedRevenueToday} ₺</div>
          <p className="text-[11px] text-purple-600/80">Kayıtlı randevuların toplam potansiyeli</p>
        </div>

        {/* 4. Bekleme Listesi (Waitlist) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Bekleme Listesi</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600">{activeWaitlistCount} Sırada</div>
          <p className="text-[11px] text-indigo-600/80">İptal olduğunda hemen doldurulacak</p>
        </div>
      </div>

      {/* Secondary Dashboard Modules: Today's Schedule & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Bugünkü Randevu Akışı ({todayStr})
              </h3>
            </div>
            <Link
              href="/admin/calendar"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Tüm Takvim</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Saat</th>
                  <th className="px-5 py-3">Müşteri</th>
                  <th className="px-5 py-3">İşlem & Süre</th>
                  <th className="px-5 py-3">Uzman</th>
                  <th className="px-5 py-3">Tutar / Ödeme</th>
                  <th className="px-5 py-3 text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayAppointments.map((apt) => {
                  const srv = services.find((s) => s.id === apt.serviceId);
                  const staff = staffList.find((s) => s.id === apt.staffId);

                  return (
                    <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900 font-mono">
                        {apt.startTime} - {apt.endTime}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{getMaskedName(apt.customerName)}</div>
                        <div className="text-[11px] text-slate-400">{getMaskedPhone(apt.customerPhone)}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{srv?.name || 'Hizmet'}</div>
                        <div className="text-[10px] text-slate-400">{srv?.durationMinutes} dakika</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center space-x-1 font-semibold text-slate-700">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              staff ? staff.avatarColor : 'bg-slate-400'
                            }`}
                          />
                          <span>{staff?.name || 'Uzman'}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-black text-slate-900">{apt.price} ₺</div>
                        {apt.paymentMethod === 'PACKAGE' && (
                          <span className="text-[10px] font-bold text-purple-600">Paketten Düşecek</span>
                        )}
                        {apt.depositPaid && (
                          <span className="text-[10px] font-semibold text-emerald-600 block">
                            (Kapora: {apt.depositAmount} ₺)
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {apt.status === 'COMPLETED' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tamamlandı</span>
                          </span>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Bekliyor</span>
                          </span>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            <span>İptal</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {todayAppointments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      Bugün için henüz kayıtlı bir randevu bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Modules Summary */}
        <div className="space-y-4">
          {/* Monthly Finance Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Eylül Ayı Kasa & Net Kâr
              </span>
              <Wallet className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Toplam Ciro (Gelir):</span>
                <span className="font-extrabold text-slate-900">{totalMonthlyIncome} ₺</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Toplam Giderler:</span>
                <span className="font-extrabold text-rose-600">-{totalMonthlyExpense} ₺</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-xs">Net Kalan Tutar (Kâr):</span>
                <span className="font-black text-emerald-600 text-base">
                  {netMonthlyProfit > 0 ? `+${netMonthlyProfit}` : netMonthlyProfit} ₺
                </span>
              </div>
            </div>

            <Link
              href="/admin/finance"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 text-center block transition cursor-pointer"
            >
              Detaylı Finans & Gider Raporu
            </Link>
          </div>

          {/* Quick Staff Commission Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Bugünkü Uzman Ciroları
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-2 text-xs">
              {staffList.map((s) => {
                // Bugunki cirosu
                const staffRevenue = transactions
                  .filter((t) => t.type === 'INCOME' && t.staffId === s.id && t.date === todayStr)
                  .reduce((sum, t) => sum + t.amount, 0);

                return (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${s.avatarColor} shrink-0`} />
                      <span className="font-bold text-slate-800 truncate">{s.name}</span>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">{staffRevenue} ₺</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
