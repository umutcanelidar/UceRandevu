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
  Phone,
  Lock,
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, tenant, staffList, services, appointments, transactions, updateAppointmentStatus } = useApp();

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Erişim Kısıtlı</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Bu panel yalnızca <strong>Salon Sahibi</strong> erişimine açıktır. Personel hesabı ({currentUser.staffId}) ile kasa ve mali yönetim paneline erişilemez.
        </p>
        <div className="pt-2">
          <Link
            href="/staff"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            <span>Personel Randevu Takvimi</span>
          </Link>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedCount = todayAppointments.filter((a) => a.status === 'COMPLETED').length;
  const pendingCount = todayAppointments.filter((a) => a.status === 'CONFIRMED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Genel Bakış & Özet</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {tenant.name} • Günlük randevu ve kasa durum özeti
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/calendar"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Takvimi Aç</span>
          </Link>
          <Link
            href="/admin/finance"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
          >
            <span>Kasa Detayı</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bugünkü Randevular</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{todayAppointments.length} Müşteri</p>
          <p className="text-[11px] text-blue-600 font-medium">{pendingCount} Randevu Bekliyor</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tamamlanan Hizmet</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{completedCount} Seans</p>
          <p className="text-[11px] text-emerald-600 font-medium">Hizmeti Bitenler</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bugünkü Ciro</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalIncome.toLocaleString('tr-TR')} {tenant.currency}</p>
          <p className="text-[11px] text-indigo-600 font-medium">Kasa Toplam Gelir</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Aktif Personeller</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{staffList.length} Çalışan</p>
          <p className="text-[11px] text-slate-500 font-medium">Özel ID Tanımlı</p>
        </div>
      </div>

      {/* Today's Appointments List & Staff Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Günün Randevuları</h3>
              <p className="text-xs text-slate-500">Bugün hizmet alacak müşteriler ve durumları</p>
            </div>
            <Link
              href="/admin/calendar"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Tüm Takvim</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {todayAppointments.map((apt) => {
              const srv = services.find((s) => s.id === apt.serviceId);
              const staff = staffList.find((s) => s.id === apt.staffId);
              const isCompleted = apt.status === 'COMPLETED';

              return (
                <div key={apt.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {apt.startTime}
                      </span>
                      <strong className="text-slate-900 text-sm">{apt.customerName}</strong>
                      <span className="text-slate-400 font-normal">({apt.customerPhone})</span>
                    </div>

                    <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
                      <span>{srv?.name}</span>
                      <span>•</span>
                      <span>Uzman: <strong>{staff?.name}</strong></span>
                      <span>•</span>
                      <strong className="text-slate-800">{apt.price} {tenant.currency}</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tamamlandı</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition cursor-pointer shadow-xs"
                      >
                        Tamamla
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Personel Durumu</h3>
              <p className="text-xs text-slate-500">Bugünkü seans dağılımı</p>
            </div>
            <Link
              href="/admin/staff"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Yönet
            </Link>
          </div>

          <div className="space-y-3">
            {staffList.map((staff) => {
              const staffApts = todayAppointments.filter((a) => a.staffId === staff.id);

              return (
                <div key={staff.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{staff.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-1.5">({staff.staffCode})</span>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {staffApts.length} Randevu
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{staff.title}</span>
                    <span>Mesai: {staff.workingHours.start} - {staff.workingHours.end}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
