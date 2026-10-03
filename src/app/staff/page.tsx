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

  if (!currentStaff) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-100 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-950 font-serif">Aktif Personel Girişi Bulunamadı</h2>
        <p className="text-xs text-brand-700 leading-relaxed">
          Personel ajandasına erişebilmek için lütfen geçerli bir personel hesabı ve PIN kodu ile giriş yapınız.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
        >
          Giriş Sayfasına Git
        </a>
      </div>
    );
  }

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
      <div className="bg-white rounded-2xl border border-brand-100 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white font-bold flex items-center justify-center text-base shadow-sm border border-brand-600/30 font-serif">
            {currentStaff.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-brand-950 font-serif">{currentStaff.name}</h1>
              <span className="text-xs font-mono font-bold bg-brand-50 text-brand-800 border border-brand-200 px-2 py-0.5 rounded-md">
                {currentStaff.staffCode}
              </span>
            </div>
            <p className="text-xs text-brand-700 mt-0.5">{currentStaff.title}</p>
            <p className="text-[11px] text-brand-800/80 flex items-center space-x-1.5 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>Çalışma Saatlerim: <strong>{currentStaff.workingHours.start} - {currentStaff.workingHours.end}</strong></span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm shadow-brand-900/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>Kendi Takvimime Randevu Ekle</span>
        </button>
      </div>

      {/* Date & Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-400 uppercase">SEÇİLİ GÜN</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-brand-950 bg-transparent focus:outline-hidden block cursor-pointer"
            />
          </div>
          <CalendarIcon className="w-5 h-5 text-brand-700" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-400 uppercase">GÜNLÜK RANDEVULARIM</span>
            <p className="text-xl font-bold font-serif text-brand-950">{myAppointments.length} Müşteri</p>
          </div>
          <div className="px-2 py-1 bg-brand-50 text-brand-800 border border-brand-200 rounded-lg text-xs font-semibold">
            {pendingCount} Bekleyen
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-brand-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-400 uppercase">TAMAMLANAN</span>
            <p className="text-xl font-bold font-serif text-emerald-700">{completedCount} Seans</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* Appointment Schedule List */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-brand-100">
          <div>
            <h2 className="text-sm font-bold text-brand-950 font-serif">Randevu Listem ({currentStaff.name})</h2>
            <p className="text-xs text-brand-700">Yalnızca sizin adınıza kayıtlı olan randevular listelenir (Kasa gizliliği aktiftir)</p>
          </div>
        </div>

        {myAppointments.length === 0 ? (
          <div className="py-12 text-center text-brand-400 space-y-2">
            <Clock className="w-8 h-8 mx-auto text-brand-300" />
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
                      : 'bg-brand-50/40 hover:bg-brand-50/80 border-brand-100'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-xs font-bold text-brand-800 bg-brand-100/70 border border-brand-200 px-2 py-0.5 rounded-md">
                        {apt.startTime} - {apt.endTime}
                      </span>
                      <strong className="text-sm font-bold text-brand-950">{getMaskedName(apt.customerName)}</strong>
                      <span className="text-xs text-brand-700 flex items-center space-x-1 font-mono">
                        <Phone className="w-3 h-3 text-brand-400" />
                        <span>{getMaskedPhone(apt.customerPhone)}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-brand-800">
                      <span className="font-semibold text-brand-950">{srv?.name}</span>
                      <span className="text-brand-300">•</span>
                      <span>{srv?.durationMinutes} dk</span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-brand-700 italic">
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
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hizmeti Tamamla</span>
                        </button>
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                        >
                          <span>Gelmedi</span>
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-emerald-800 font-semibold flex items-center space-x-1 bg-emerald-100/80 px-3 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tamamlandı</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="text-xs text-rose-800 font-semibold flex items-center space-x-1 bg-rose-100/80 px-3 py-1 rounded-xl border border-rose-200">
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
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div>
                <h3 className="text-base font-bold text-brand-950 font-serif">Kendi Takvimime Randevu Ekle</h3>
                <p className="text-xs text-brand-700 font-medium">Personel: {currentStaff.name} ({currentStaff.staffCode})</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-950 mb-1">Müşteri Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Cansu Parlak"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Müşteri Telefonu *</label>
                <input
                  type="tel"
                  required
                  placeholder="0532 000 00 00"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Hizmet</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs bg-white"
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
                  <label className="block font-semibold text-brand-950 mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs shadow-2xs bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Başlangıç Saati (15 dk)</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-mono font-bold shadow-2xs bg-white"
                  >
                    {(() => {
                      const slots: string[] = [];
                      for (let hour = 10; hour <= 20; hour++) {
                        for (let min = 0; min < 60; min += 15) {
                          slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
                        }
                      }
                      slots.push('21:00');
                      return slots.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ));
                    })()}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Not (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Müşteri talepleri veya özel istekler..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs shadow-2xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-brand-200 text-brand-800 hover:bg-brand-50 font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-semibold cursor-pointer shadow-md shadow-brand-900/10"
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
