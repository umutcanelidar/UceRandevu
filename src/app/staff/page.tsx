'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Lock,
  User,
} from 'lucide-react';

export default function StaffPortalPage() {
  const {
    currentUser,
    staffList,
    services,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getMaskedName,
    getMaskedPhone,
    tenant,
  } = useApp();

  const currentStaff =
    staffList.find((s) => s.staffCode === currentUser.staffId) || staffList[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // New appointment modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [startTime, setStartTime] = useState('14:00');
  const [notes, setNotes] = useState('');

  // Confidentiality Filter: Only this staff's appointments!
  const myAppointments = appointments.filter(
    (apt) => apt.staffId === currentStaff.id && apt.date === selectedDate
  );

  const completedCount = myAppointments.filter((a) => a.status === 'COMPLETED').length;
  const pendingCount = myAppointments.filter((a) => a.status === 'CONFIRMED').length;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const srv = services.find((s) => s.id === serviceId);
    const duration = srv?.durationMinutes || 60;

    const [h, m] = startTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const endH = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const endM = (totalMin % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    addAppointment({
      tenantId: tenant.id,
      customerName,
      customerPhone,
      staffId: currentStaff.id, // Strictly assigned to THIS staff member
      serviceId,
      date: selectedDate,
      startTime,
      endTime,
      status: 'CONFIRMED',
      price: srv?.price || 0,
      notes,
      depositAmount: 0,
      depositPaid: false,
    });

    setShowAddModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Staff Profile Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-xs">
            {currentStaff.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900">{currentStaff.name}</h1>
              <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">
                {currentStaff.staffCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentStaff.title}</p>
            <p className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Çalışma Saatlerim: <strong>{currentStaff.workingHours.start} - {currentStaff.workingHours.end}</strong></span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Kendi Takvimime Randevu Ekle</span>
        </button>
      </div>

      {/* Date & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">SEÇİLİ GÜN</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden block cursor-pointer"
            />
          </div>
          <CalendarIcon className="w-5 h-5 text-blue-600" />
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">GÜNLÜK RANDEVULARIM</span>
            <p className="text-xl font-bold text-slate-900">{myAppointments.length} Müşteri</p>
          </div>
          <div className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-semibold">
            {pendingCount} Bekleyen
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">TAMAMLANAN</span>
            <p className="text-xl font-bold text-emerald-600">{completedCount} Seans</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Appointment Schedule List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Randevu Listem ({currentStaff.name})</h2>
            <p className="text-xs text-slate-500">Yalnızca sizin adınıza kayıtlı olan randevular listelenir (Kasa gizliliği aktiftir)</p>
          </div>
        </div>

        {myAppointments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium">Bu tarihe ait kayıtlı randevunuz bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {myAppointments.map((apt) => {
              const srv = services.find((s) => s.id === apt.serviceId);
              const isCompleted = apt.status === 'COMPLETED';
              const isCancelled = apt.status === 'CANCELLED';

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : isCancelled
                      ? 'bg-rose-50/60 border-rose-200'
                      : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        {apt.startTime} - {apt.endTime}
                      </span>
                      <strong className="text-sm font-bold text-slate-900">{getMaskedName(apt.customerName)}</strong>
                      <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{getMaskedPhone(apt.customerPhone)}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <span className="font-medium text-slate-800">{srv?.name}</span>
                      <span className="text-slate-300">•</span>
                      <span>{srv?.durationMinutes} dk</span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic">
                        Not: {apt.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {apt.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'COMPLETED')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hizmeti Tamamla</span>
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <span>Gelmedi</span>
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1 bg-emerald-100 px-3 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tamamlandı</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="text-xs text-rose-700 font-semibold flex items-center space-x-1 bg-rose-100 px-3 py-1 rounded-lg">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>İptal Edildi</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Appointment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kendi Takvimime Randevu Ekle</h3>
                <p className="text-xs text-blue-600 font-medium">Personel: {currentStaff.name} ({currentStaff.staffCode})</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Müşteri Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Cansu Parlak"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Müşteri Telefonu *</label>
                <input
                  type="tel"
                  required
                  placeholder="0532 000 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hizmet</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} ({srv.durationMinutes} dk)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Başlangıç Saati</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                  >
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Not (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Müşteri talepleri veya özel istekler..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                />
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
                  Randevuyu Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
