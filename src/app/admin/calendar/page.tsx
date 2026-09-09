'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';

export default function AdminCalendarPage() {
  const { staffList, services, appointments, addAppointment, updateAppointmentStatus, tenant } = useApp();

  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // New appointment form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [newStaffId, setNewStaffId] = useState(staffList[0]?.id || '');
  const [newServiceId, setNewServiceId] = useState(services[0]?.id || '');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [notes, setNotes] = useState('');

  const hours = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const displayedStaff = selectedStaffFilter === 'ALL'
    ? staffList
    : staffList.filter((s) => s.id === selectedStaffFilter);

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleSlotClick = (staffId: string, time: string) => {
    setNewStaffId(staffId);
    setNewStartTime(time);
    setShowAddModal(true);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    const srv = services.find((s) => s.id === newServiceId);
    const duration = srv?.durationMinutes || 60;

    const [h, m] = newStartTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const endH = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const endM = (totalMin % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    addAppointment({
      tenantId: tenant.id,
      customerName: custName,
      customerPhone: custPhone,
      staffId: newStaffId,
      serviceId: newServiceId,
      date: selectedDate,
      startTime: newStartTime,
      endTime,
      status: 'CONFIRMED',
      price: srv?.price || 0,
      notes,
    });

    setShowAddModal(false);
    setCustName('');
    setCustPhone('');
    setNotes('');
  };

  // Date formatting for header
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Calendar Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-2 hover:bg-slate-200 text-slate-600 transition"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 border-x border-slate-200 transition"
            >
              Bugün
            </button>
            <button
              onClick={() => changeDateByDays(1)}
              className="p-2 hover:bg-slate-200 text-slate-600 transition"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-900 capitalize">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Staff Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStaffFilter}
              onChange={(e) => setSelectedStaffFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">Tüm Personeller</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.staffCode})
                </option>
              ))}
            </select>
          </div>

          {/* New Appointment Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Randevu</span>
          </button>
        </div>
      </div>

      {/* Interactive Planla.co Style Schedule Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Staff Columns Header */}
          <div className="grid grid-cols-[80px_repeat(auto-fit,_minmax(220px,_1fr))] border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
            <div className="p-3 text-center border-r border-slate-200 text-xs font-bold text-slate-400">
              SAAT
            </div>
            {displayedStaff.map((staff) => (
              <div key={staff.id} className="p-3 border-r border-slate-200 last:border-r-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{staff.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">
                      {staff.staffCode} • {staff.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hour Rows */}
          <div className="divide-y divide-slate-100">
            {hours.map((timeStr) => {
              const [hourNum] = timeStr.split(':').map(Number);

              return (
                <div key={timeStr} className="grid grid-cols-[80px_repeat(auto-fit,_minmax(220px,_1fr))] min-h-[72px]">
                  {/* Time label */}
                  <div className="p-2.5 text-center border-r border-slate-200 text-xs font-semibold text-slate-400 bg-slate-50/50 flex items-start justify-center">
                    {timeStr}
                  </div>

                  {/* Staff Slots */}
                  {displayedStaff.map((staff) => {
                    // Find appointments matching this staff, date, and hour
                    const slotAppointments = appointments.filter((apt) => {
                      if (apt.staffId !== staff.id || apt.date !== selectedDate) return false;
                      const [aptHour] = apt.startTime.split(':').map(Number);
                      return aptHour === hourNum;
                    });

                    return (
                      <div
                        key={staff.id}
                        className="p-1.5 border-r border-slate-100 last:border-r-0 relative group hover:bg-slate-50/70 transition"
                      >
                        {slotAppointments.length > 0 ? (
                          <div className="space-y-1.5">
                            {slotAppointments.map((apt) => {
                              const srv = services.find((s) => s.id === apt.serviceId);
                              const isCompleted = apt.status === 'COMPLETED';
                              const isCancelled = apt.status === 'CANCELLED';

                              return (
                                <div
                                  key={apt.id}
                                  onClick={() => setSelectedAppointment(apt)}
                                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition shadow-xs ${
                                    isCompleted
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
                                      : isCancelled
                                      ? 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100/70'
                                      : 'bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-100/70'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs tracking-tight truncate">
                                      {apt.customerName}
                                    </span>
                                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/80 border border-slate-200/60">
                                      {apt.startTime}
                                    </span>
                                  </div>

                                  <div className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                                    {srv?.name}
                                  </div>

                                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                                    <span>{srv?.durationMinutes} dk</span>
                                    <span className="font-bold text-slate-900">{apt.price} {tenant.currency}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSlotClick(staff.id, timeStr)}
                            className="w-full h-full min-h-[48px] rounded-lg border border-transparent hover:border-dashed hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[11px] font-semibold text-blue-600 cursor-pointer"
                          >
                            + Randevu
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  selectedAppointment.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedAppointment.status === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedAppointment.status === 'COMPLETED' ? 'Tamamlandı' : selectedAppointment.status === 'CANCELLED' ? 'İptal Edildi' : 'Onaylandı'}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedAppointment.customerName}</h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span>{selectedAppointment.customerPhone}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Hizmet:</span>
                <strong className="text-slate-900">{services.find(s => s.id === selectedAppointment.serviceId)?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Personel:</span>
                <strong className="text-slate-900">{staffList.find(s => s.id === selectedAppointment.staffId)?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saat:</span>
                <strong className="text-slate-900">{selectedAppointment.startTime} - {selectedAppointment.endTime}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ücret:</span>
                <strong className="text-blue-700 font-bold">{selectedAppointment.price} {tenant.currency}</strong>
              </div>
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Not:</span>
                  <p className="text-slate-800 italic">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 pt-2">
              {selectedAppointment.status === 'CONFIRMED' && (
                <>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'COMPLETED');
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hizmeti Tamamla</span>
                  </button>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'CANCELLED');
                      setSelectedAppointment(null);
                    }}
                    className="py-2 px-3 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
                  >
                    İptal Et
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="py-2 px-4 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition cursor-pointer ml-auto"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Appointment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Yeni Randevu Oluştur</h3>
                <p className="text-xs text-slate-500">Müşteri ve saat bilgilerini giriniz</p>
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
                  placeholder="Örn: Ayşe Kaya"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefon Numarası *</label>
                <input
                  type="tel"
                  required
                  placeholder="0532 123 45 67"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Personel</label>
                  <select
                    value={newStaffId}
                    onChange={(e) => setNewStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  >
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.staffCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hizmet</label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.price} ₺)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Saat</label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                  >
                    {hours.map((h) => (
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
                  placeholder="Örn: Kısa tırnak, french model..."
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
                  Randevuyu Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
