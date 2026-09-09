'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  PlusCircle,
  Clock,
  Phone,
  Lock,
  Percent,
  CheckCircle2,
  Key,
} from 'lucide-react';

export default function AdminStaffPage() {
  const { currentUser, tenant, staffList, addStaff, appointments } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [staffCode, setStaffCode] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [commissionRate, setCommissionRate] = useState('35');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:00');

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Yetkisiz Erişim</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Personel yönetimi ve ID tanımlamaları yalnızca <strong>Salon Sahibi</strong> yetkisindedir.
        </p>
      </div>
    );
  }

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffCode || !name) return;

    addStaff({
      tenantId: tenant.id,
      staffCode: staffCode.toUpperCase(),
      name,
      title: title || 'Uzman Tırnak Teknisyeni',
      phone: phone || '+90 500 000 00 00',
      avatarColor: 'bg-blue-600',
      isActive: true,
      commissionRate: Number(commissionRate) || 0,
      workingHours: {
        start: startTime,
        end: endTime,
        days: [1, 2, 3, 4, 5, 6],
      },
    });

    setShowAddModal(false);
    setStaffCode('');
    setName('');
    setTitle('');
    setPhone('');
  };

  const autoGenerateCode = () => {
    const nextNum = staffList.length + 1;
    setStaffCode(`ST-0${nextNum}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Personeller & Özel ID Yönetimi</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {staffList.length} Aktif Çalışan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Çalışanlarınıza özel ID atayarak yalnızca kendi randevu takvimlerini görmelerini sağlayın.
          </p>
        </div>

        <button
          onClick={() => {
            autoGenerateCode();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Personel Ekle</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((staff) => {
          const staffApts = appointments.filter((a) => a.staffId === staff.id);

          return (
            <div
              key={staff.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-100">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{staff.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{staff.title}</p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {staff.staffCode}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{staff.phone}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Çalışma: <strong>{staff.workingHours.start} - {staff.workingHours.end}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Percent className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hizmet Primi: <strong>%{staff.commissionRate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Toplam Randevu: <strong className="text-slate-900">{staffApts.length}</strong>
                </span>

                <span className="text-emerald-600 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aktif</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Staff */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Yeni Personel Tanımla</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Personel ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="ST-04"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 font-mono font-bold text-xs uppercase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Elif Aksoy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Uzmanlık / Ünvan</label>
                <input
                  type="text"
                  placeholder="Örn: Protez Tırnak & Nail Art Uzmanı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="0532 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prim Oranı (%)</label>
                  <input
                    type="number"
                    placeholder="35"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mesai Başlangıç</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mesai Bitiş</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
