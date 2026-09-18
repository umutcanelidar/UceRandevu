'use client';

import React, { useState, useEffect } from 'react';
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
  List,
  LayoutGrid,
  MessageCircle,
  Lock,
} from 'lucide-react';

export default function AdminCalendarPage() {
  const {
    staffList,
    services,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    reassignAppointmentSpecialist,
    getMaskedName,
    getMaskedPhone,
    tenant,
    currentUser,
  } = useApp();

  const isStaffOff = (staff: any, dateStr: string) => {
    const d = new Date(dateStr);
    const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay();
    const isWeeklyOff = staff.offDays && staff.offDays.includes(dayOfWeek);
    const isSpecialLeave = staff.leaveDates && staff.leaveDates.includes(dateStr);
    return isWeeklyOff || isSpecialLeave;
  };

  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode('LIST');
    }
  }, []);

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
      depositAmount: 0,
      depositPaid: false,
    });

    setShowAddModal(false);
    setCustName('');
    setCustPhone('');
    setNotes('');
  };

  // Appointments sorted for list view
  const appointmentsForDay = appointments
    .filter((apt) => {
      if (apt.date !== selectedDate) return false;
      if (selectedStaffFilter !== 'ALL' && apt.staffId !== selectedStaffFilter) return false;
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Date formatting for header
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Calendar Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Left: Date Navigation */}
        <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-1.5 sm:p-2 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 border-x border-slate-200 transition cursor-pointer"
            >
              Bugün
            </button>
            <button
              onClick={() => changeDateByDays(1)}
              className="p-1.5 sm:p-2 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
            <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-900 capitalize truncate">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Right: View Toggle (Grid / List) & Actions */}
        <div className="flex items-center justify-between sm:justify-end space-x-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tablo Görünümü"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablo</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'LIST'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Liste / Ajanda Görünümü"
            >
              <List className="w-3.5 h-3.5" />
              <span className="text-[11px]">Liste ({appointmentsForDay.length})</span>
            </button>
          </div>

          {/* New Appointment Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Randevu</span>
          </button>
        </div>
      </div>

      {/* Staff Quick Pills Bar (Swipeable on Mobile) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedStaffFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
            selectedStaffFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Tüm Ekip ({appointments.filter((a) => a.date === selectedDate).length})
        </button>
        {staffList.map((s) => {
          const count = appointments.filter(
            (a) => a.date === selectedDate && a.staffId === s.id
          ).length;
          const isSelected = selectedStaffFilter === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedStaffFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{s.name.split(' ')[0]}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: AGENDA LIST VIEW (Ideal for mobile screens & quick checking) */}
      {viewMode === 'LIST' ? (
        <div className="space-y-3">
          {appointmentsForDay.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Bu Tarihte Planlanmış Randevu Yok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {formattedDate} tarihi için seçili filtrede kayıtlı bir randevu bulunmuyor.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                + Yeni Randevu Oluştur
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {appointmentsForDay.map((apt) => {
                const srv = services.find((s) => s.id === apt.serviceId);
                const staff = staffList.find((s) => s.id === apt.staffId);
                const isCompleted = apt.status === 'COMPLETED';
                const isCancelled = apt.status === 'CANCELLED';

                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-blue-200 transition"
                  >
                    {/* Time & Price Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {apt.startTime} - {apt.endTime}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isCompleted ? 'Tamamlandı' : isCancelled ? 'İptal' : 'Onaylandı'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-slate-900">
                          {apt.price} {tenant.currency}
                        </span>
                        <p className="text-[10px] text-slate-400">{srv?.durationMinutes} dk</p>
                      </div>
                    </div>

                    {/* Customer & Service Info */}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{getMaskedName(apt.customerName)}</h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{srv?.name}</p>
                    </div>

                    {/* Staff & Direct Communication Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                          {staff?.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{staff?.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({staff?.staffCode})
                        </span>
                      </div>

                      {currentUser.role !== 'STAFF' ? (
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${apt.customerPhone}`}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Telefonla Ara"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/90${apt.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                            title="WhatsApp Mesajı Gönder"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">Gizli No</span>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center space-x-2 pt-1">
                      {apt.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'COMPLETED')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Hizmeti Tamamla</span>
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                            className="py-1.5 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-lg transition cursor-pointer"
                          >
                            İptal
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="py-1.5 px-3 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-lg transition cursor-pointer ml-auto"
                      >
                        Detay
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: INTERACTIVE STAFF SCHEDULE GRID */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <div className={selectedStaffFilter === 'ALL' ? 'min-w-[800px]' : 'min-w-full'}>
            {/* Staff Columns Header */}
            <div className="grid grid-cols-[70px_repeat(auto-fit,_minmax(200px,_1fr))] border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
              <div className="p-2.5 text-center border-r border-slate-200 text-xs font-bold text-slate-400">
                SAAT
              </div>
              {displayedStaff.map((staff) => (
                <div key={staff.id} className="p-2.5 border-r border-slate-200 last:border-r-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{staff.name}</h3>
                        {isStaffOff(staff, selectedDate) && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 shrink-0">
                            İzinli
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono font-semibold truncate">
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
                  <div
                    key={timeStr}
                    className="grid grid-cols-[70px_repeat(auto-fit,_minmax(200px,_1fr))] min-h-[64px]"
                  >
                    {/* Time label */}
                    <div className="p-2 text-center border-r border-slate-200 text-xs font-semibold text-slate-400 bg-slate-50/50 flex items-start justify-center">
                      {timeStr}
                    </div>

                    {/* Staff Slots */}
                    {displayedStaff.map((staff) => {
                      if (isStaffOff(staff, selectedDate)) {
                        return (
                          <div
                            key={staff.id}
                            className="p-1.5 border-r border-slate-100 last:border-r-0 bg-slate-50/80 flex items-center justify-center text-[10px] text-slate-400 font-medium select-none"
                          >
                            <span className="flex items-center space-x-1 opacity-70">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>İzinli Gün</span>
                            </span>
                          </div>
                        );
                      }

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
                                    className={`p-2 rounded-lg border text-left cursor-pointer transition shadow-xs ${
                                      isCompleted
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
                                        : isCancelled
                                        ? 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100/70'
                                        : 'bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-100/70'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs tracking-tight truncate">
                                        {getMaskedName(apt.customerName)}
                                      </span>
                                      <span className="text-[10px] font-mono font-semibold px-1 rounded bg-white/80 border border-slate-200/60">
                                        {apt.startTime}
                                      </span>
                                    </div>

                                    <div className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                                      {srv?.name}
                                    </div>

                                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                                      <span>{srv?.durationMinutes} dk</span>
                                      <span className="font-bold text-slate-900">
                                        {apt.price} {tenant.currency}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSlotClick(staff.id, timeStr)}
                              className="w-full h-full min-h-[44px] rounded-lg border border-dashed border-slate-200/60 md:border-transparent hover:border-blue-300 bg-slate-50/30 md:bg-transparent hover:bg-blue-50/50 flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition text-[11px] font-semibold text-blue-600 cursor-pointer"
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
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
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
                <h3 className="text-base font-bold text-slate-900 mt-1">{getMaskedName(selectedAppointment.customerName)}</h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5 font-mono">
                  <Phone className="w-3 h-3" />
                  <span>{getMaskedPhone(selectedAppointment.customerPhone)}</span>
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
              <div className="flex justify-between">
                <span className="text-slate-500">Kapora:</span>
                <strong className="text-emerald-700 font-bold">
                  {selectedAppointment.depositPaid
                    ? `${selectedAppointment.depositAmount} ₺ Alındı`
                    : 'Alınmadı'}
                </strong>
              </div>
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Not:</span>
                  <p className="text-slate-800 italic">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Uzman Değişikliği (Personel Devri) */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 flex items-center justify-between">
                <span>Uzman Değişikliği:</span>
                {selectedAppointment.specialistChangedFrom && (
                  <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
                    Önceki: {selectedAppointment.specialistChangedFrom}
                  </span>
                )}
              </label>
              <select
                value={selectedAppointment.staffId}
                onChange={(e) => {
                  const targetStaffId = e.target.value;
                  reassignAppointmentSpecialist(selectedAppointment.id, targetStaffId);
                  setSelectedAppointment({ ...selectedAppointment, staffId: targetStaffId });
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 text-xs"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.title})
                  </option>
                ))}
              </select>
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
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
