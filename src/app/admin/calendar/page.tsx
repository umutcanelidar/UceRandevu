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
  CreditCard,
  Banknote,
  Building2,
  Sparkles,
  AlertCircle,
  Package,
} from 'lucide-react';
import { Appointment } from '@/types';

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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Hizmeti tamamlarken ödeme yöntemi modalı
  const [appointmentToComplete, setAppointmentToComplete] = useState<Appointment | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE' | 'PACKAGE'>('CREDIT_CARD');

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
  const [newStartTime, setNewStartTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  // Kapora Bilgileri
  const [depositPaid, setDepositPaid] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(200);
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CREDIT_CARD');

  // 10:00 dan başlayan ve 21:00'e kadar süren takvim saat dilimleri
  const hours = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  // Randevu oluşturma ekranı için 15 dakika aralıklı saat listesi (10:00 - 20:45)
  const generate15MinIntervals = () => {
    const slots: string[] = [];
    for (let hour = 10; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const hStr = hour.toString().padStart(2, '0');
        const mStr = min.toString().padStart(2, '0');
        slots.push(`${hStr}:${mStr}`);
      }
    }
    slots.push('21:00');
    return slots;
  };
  const interval15MinList = generate15MinIntervals();

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
      depositAmount: depositPaid ? Number(depositAmount) : 0,
      depositPaid,
      depositPaymentMethod: depositPaid ? depositPaymentMethod : undefined,
    });

    setShowAddModal(false);
    setCustName('');
    setCustPhone('');
    setNotes('');
    setDepositPaid(false);
    setDepositAmount(200);
  };

  // Ödeme yöntemi seçilerek tamamlama
  const handleConfirmCompletionWithPayment = () => {
    if (!appointmentToComplete) return;

    updateAppointmentStatus(
      appointmentToComplete.id,
      'COMPLETED',
      selectedPaymentMethod
    );

    setAppointmentToComplete(null);
    if (selectedAppointment && selectedAppointment.id === appointmentToComplete.id) {
      setSelectedAppointment(null);
    }
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

  const selectedStaffObj = staffList.find((s) => s.id === newStaffId);
  const isSelectedStaffOff = selectedStaffObj ? isStaffOff(selectedStaffObj, selectedDate) : false;

  return (
    <div className="space-y-4">
      {/* Calendar Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-100 shadow-xs">
        {/* Left: Date Navigation */}
        <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-3">
          <div className="flex items-center border border-brand-200 rounded-xl overflow-hidden bg-brand-50/50 shrink-0">
            <button
              onClick={() => changeDateByDays(-1)}
              className="p-1.5 sm:p-2 hover:bg-brand-100 text-brand-800 transition cursor-pointer"
              title="Önceki Gün"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-brand-900 hover:bg-brand-100 border-x border-brand-200 transition cursor-pointer"
            >
              Bugün
            </button>
            <button
              onClick={() => changeDateByDays(1)}
              className="p-1.5 sm:p-2 hover:bg-brand-100 text-brand-800 transition cursor-pointer"
              title="Sonraki Gün"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs sm:text-sm font-bold text-brand-950 bg-white border border-brand-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-brand-700 shadow-2xs"
            />
            <span className="hidden lg:inline text-xs font-medium text-brand-800/80 capitalize">
              ({formattedDate})
            </span>
          </div>
        </div>

        {/* Right: View Toggles & New Appointment Button */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
          <div className="flex items-center bg-brand-50 p-1 rounded-xl border border-brand-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('GRID')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'GRID'
                  ? 'bg-white text-brand-800 font-bold shadow-xs border border-brand-200'
                  : 'text-brand-700 hover:text-brand-950'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Takvim</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition cursor-pointer ${
                viewMode === 'LIST'
                  ? 'bg-white text-brand-800 font-bold shadow-xs border border-brand-200'
                  : 'text-brand-700 hover:text-brand-950'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="text-[11px]">Liste ({appointmentsForDay.length})</span>
            </button>
          </div>

          {/* New Appointment Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 shadow-sm shadow-brand-900/10 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-200" />
            <span>Yeni Randevu</span>
          </button>
        </div>
      </div>

      {/* Staff Quick Pills Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedStaffFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
            selectedStaffFilter === 'ALL'
              ? 'bg-brand-700 text-white shadow-xs'
              : 'bg-white text-brand-900 border border-brand-200 hover:bg-brand-50'
          }`}
        >
          Tüm Ekip ({appointments.filter((a) => a.date === selectedDate).length})
        </button>
        {staffList.map((s) => {
          const count = appointments.filter(
            (a) => a.date === selectedDate && a.staffId === s.id
          ).length;
          const isSelected = selectedStaffFilter === s.id;
          const isOff = isStaffOff(s, selectedDate);

          return (
            <button
              key={s.id}
              onClick={() => setSelectedStaffFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 shrink-0 ${
                isSelected
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-brand-900 border border-brand-200 hover:bg-brand-50'
              }`}
            >
              <span>{s.name.split(' ')[0]}</span>
              {isOff ? (
                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                  isSelected ? 'bg-amber-400 text-brand-950' : 'bg-amber-100 text-amber-800'
                }`}>
                  İzinli
                </span>
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-brand-800 text-white' : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW MODE 1: AGENDA LIST VIEW */}
      {viewMode === 'LIST' ? (
        <div className="space-y-3">
          {appointmentsForDay.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-100 p-8 text-center space-y-3 shadow-xs">
              <CalendarIcon className="w-10 h-10 text-brand-200 mx-auto" />
              <h3 className="text-sm font-bold text-brand-950">Bu Tarihte Planlanmış Randevu Yok</h3>
              <p className="text-xs text-brand-700/80 max-w-sm mx-auto">
                {formattedDate} tarihi için seçili filtrede kayıtlı bir randevu bulunmuyor.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
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
                    className="bg-white rounded-2xl border border-brand-100 p-4 shadow-xs space-y-3 hover:border-brand-300 transition"
                  >
                    {/* Time & Price Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs px-2 py-1 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
                          {apt.startTime} - {apt.endTime}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : isCancelled
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-brand-50 text-brand-800 border border-brand-200'
                          }`}
                        >
                          {isCompleted ? 'Tamamlandı' : isCancelled ? 'İptal' : 'Onaylandı'}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-brand-950 font-serif">
                          {apt.price} {tenant.currency}
                        </span>
                        <p className="text-[10px] text-brand-600 font-medium">{srv?.durationMinutes} dk</p>
                      </div>
                    </div>

                    {/* Customer & Service Info */}
                    <div>
                      <h4 className="font-bold text-sm text-brand-950">{getMaskedName(apt.customerName)}</h4>
                      <p className="text-xs text-brand-800 font-medium mt-0.5">{srv?.name}</p>
                      {apt.depositPaid && (
                        <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                          {apt.depositAmount} ₺ Kapora Alındı ({apt.depositPaymentMethod === 'CASH' ? 'Nakit' : apt.depositPaymentMethod === 'HAVALE' ? 'Havale' : 'Kart'})
                        </span>
                      )}
                    </div>

                    {/* Staff & Direct Communication Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-brand-50 text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-bold text-[10px] flex items-center justify-center">
                          {staff?.name.charAt(0)}
                        </div>
                        <span className="font-medium text-brand-900">{staff?.name}</span>
                        <span className="text-[10px] text-brand-400 font-mono">
                          ({staff?.staffCode})
                        </span>
                      </div>

                      {currentUser.role !== 'STAFF' ? (
                        <div className="flex items-center space-x-1.5">
                          <a
                            href={`tel:${apt.customerPhone}`}
                            className="p-1.5 text-brand-800 hover:bg-brand-50 rounded-lg transition"
                            title="Telefonla Ara"
                          >
                            <Phone className="w-3.5 h-3.5 text-brand-700" />
                          </a>
                          {(() => {
                            const digits = apt.customerPhone.replace(/[^0-9]/g, '');
                            const normalized = digits.startsWith('90')
                              ? digits
                              : digits.startsWith('0')
                              ? '9' + digits
                              : '90' + digits;
                            const text = encodeURIComponent(
                              `Sayın ${apt.customerName}, ${tenant.name} bünyesindeki ${apt.date} saat ${apt.startTime} randevunuz ile ilgili bilgilendirmedir.`
                            );
                            return (
                              <a
                                href={`https://wa.me/${normalized}?text=${text}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                title="WhatsApp'tan Doğrudan Mesaj Gönder"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            );
                          })()}
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
                            onClick={() => {
                              setAppointmentToComplete(apt);
                              setSelectedPaymentMethod('CREDIT_CARD');
                            }}
                            className="flex-1 py-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                            <span>Hizmeti Tamamla</span>
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                            className="py-1.5 px-3 border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold rounded-xl transition cursor-pointer"
                          >
                            İptal
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="py-1.5 px-3 border border-brand-200 text-brand-800 hover:bg-brand-50 text-xs font-semibold rounded-xl transition cursor-pointer ml-auto"
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
        <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-x-auto">
          <div className={selectedStaffFilter === 'ALL' ? 'min-w-[800px]' : 'min-w-full'}>
            {/* Staff Columns Header */}
            <div className="grid grid-cols-[70px_repeat(auto-fit,_minmax(200px,_1fr))] border-b border-brand-100 bg-brand-50/50 sticky top-0 z-10">
              <div className="p-2.5 text-center border-r border-brand-100 text-xs font-bold text-brand-600">
                SAAT
              </div>
              {displayedStaff.map((staff) => (
                <div key={staff.id} className="p-2.5 border-r border-brand-100 last:border-r-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1">
                        <h3 className="text-xs font-bold text-brand-950 truncate">{staff.name}</h3>
                        {isStaffOff(staff, selectedDate) && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 shrink-0">
                            İzinli
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-brand-600 font-mono font-semibold truncate">
                        {staff.staffCode} • {staff.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hour Rows: 10:00 to 21:00 */}
            <div className="divide-y divide-brand-50">
              {hours.map((timeStr) => {
                const [hourNum] = timeStr.split(':').map(Number);

                return (
                  <div
                    key={timeStr}
                    className="grid grid-cols-[70px_repeat(auto-fit,_minmax(200px,_1fr))] min-h-[64px]"
                  >
                    {/* Time label */}
                    <div className="p-2 text-center border-r border-brand-100 text-xs font-bold font-mono text-brand-700 bg-brand-50/30 flex items-start justify-center">
                      {timeStr}
                    </div>

                    {/* Staff Slots */}
                    {displayedStaff.map((staff) => {
                      if (isStaffOff(staff, selectedDate)) {
                        return (
                          <div
                            key={staff.id}
                            className="p-1.5 border-r border-brand-50 last:border-r-0 bg-brand-50/40 flex items-center justify-center text-[10px] text-brand-700/60 font-medium select-none"
                          >
                            <span className="flex items-center space-x-1 opacity-70">
                              <Lock className="w-3 h-3 text-brand-600" />
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
                          className="p-1.5 border-r border-brand-50 last:border-r-0 relative group hover:bg-brand-50/40 transition"
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
                                    className={`p-2 rounded-xl border text-left cursor-pointer transition shadow-2xs ${
                                      isCompleted
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 hover:bg-emerald-100/70'
                                        : isCancelled
                                        ? 'bg-rose-50 border-rose-200 text-rose-950 hover:bg-rose-100/70'
                                        : 'bg-brand-50/80 border-brand-200 text-brand-950 hover:bg-brand-100/70'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs tracking-tight truncate">
                                        {getMaskedName(apt.customerName)}
                                      </span>
                                      <span className="text-[10px] font-mono font-semibold px-1 rounded bg-white/90 border border-brand-200">
                                        {apt.startTime}
                                      </span>
                                    </div>

                                    <div className="text-[11px] font-medium text-brand-800 truncate mt-0.5">
                                      {srv?.name}
                                    </div>

                                    <div className="flex items-center justify-between mt-1 text-[10px] text-brand-700">
                                      <span>{srv?.durationMinutes} dk</span>
                                      <span className="font-bold text-brand-950 font-serif">
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
                              className="w-full h-full min-h-[44px] rounded-xl border border-dashed border-brand-200/70 md:border-transparent hover:border-brand-400 bg-brand-50/20 md:bg-transparent hover:bg-brand-50/60 flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition text-[11px] font-semibold text-brand-700 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-brand-100">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  selectedAppointment.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedAppointment.status === 'CANCELLED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-brand-100 text-brand-800'
                }`}>
                  {selectedAppointment.status === 'COMPLETED' ? 'Tamamlandı' : selectedAppointment.status === 'CANCELLED' ? 'İptal Edildi' : 'Onaylandı'}
                </span>
                <h3 className="text-base font-bold text-brand-950 mt-1">{getMaskedName(selectedAppointment.customerName)}</h3>
                <p className="text-xs text-brand-700 flex items-center space-x-1 mt-0.5 font-mono">
                  <Phone className="w-3 h-3 text-brand-600" />
                  <span>{getMaskedPhone(selectedAppointment.customerPhone)}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-brand-900 bg-brand-50/50 p-3.5 rounded-2xl border border-brand-100">
              <div className="flex justify-between">
                <span className="text-brand-700">Hizmet:</span>
                <strong className="text-brand-950">{services.find(s => s.id === selectedAppointment.serviceId)?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-700">Personel:</span>
                <strong className="text-brand-950">{staffList.find(s => s.id === selectedAppointment.staffId)?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-700">Saat:</span>
                <strong className="text-brand-950">{selectedAppointment.startTime} - {selectedAppointment.endTime}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-700">Ücret:</span>
                <strong className="text-brand-800 font-serif font-bold text-sm">{selectedAppointment.price} {tenant.currency}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-700">Kapora:</span>
                <strong className="text-emerald-800 font-bold">
                  {selectedAppointment.depositPaid
                    ? `${selectedAppointment.depositAmount} ₺ Alındı (${selectedAppointment.depositPaymentMethod === 'CASH' ? 'Nakit' : selectedAppointment.depositPaymentMethod === 'HAVALE' ? 'Havale' : 'Kart'})`
                    : 'Alınmadı'}
                </strong>
              </div>
              {selectedAppointment.paymentMethod && selectedAppointment.status === 'COMPLETED' && (
                <div className="flex justify-between pt-1 border-t border-brand-100">
                  <span className="text-brand-700">Ödeme Şekli:</span>
                  <span className="font-bold text-brand-900">
                    {selectedAppointment.paymentMethod === 'CASH'
                      ? 'Nakit'
                      : selectedAppointment.paymentMethod === 'HAVALE'
                      ? 'Havale'
                      : selectedAppointment.paymentMethod === 'PACKAGE'
                      ? 'Paket Seansı'
                      : 'Kredi Kartı'}
                  </span>
                </div>
              )}
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-brand-100">
                  <span className="text-brand-700 block mb-0.5 font-medium">Not:</span>
                  <p className="text-brand-950 italic">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            {/* Uzman Değişikliği (Personel Devri) */}
            <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-100 space-y-1.5 text-xs">
              <label className="font-bold text-brand-950 flex items-center justify-between">
                <span>Uzman Değişikliği:</span>
                {selectedAppointment.specialistChangedFrom && (
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100 px-1.5 py-0.5 rounded">
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
                className="w-full px-2.5 py-1.5 rounded-xl border border-brand-200 bg-white font-medium text-brand-950 text-xs shadow-2xs"
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
                      setAppointmentToComplete(selectedAppointment);
                      setSelectedPaymentMethod('CREDIT_CARD');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center space-x-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                    <span>Hizmeti Tamamla</span>
                  </button>
                  <button
                    onClick={() => {
                      updateAppointmentStatus(selectedAppointment.id, 'CANCELLED');
                      setSelectedAppointment(null);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
                  >
                    İptal Et
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedAppointment(null)}
                className="py-2.5 px-4 rounded-xl border border-brand-200 text-brand-800 hover:bg-brand-50 font-semibold text-xs transition cursor-pointer ml-auto"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HİZMETİ TAMAMLARKEN ÖDEME ŞEKLİ SEÇİMİ (MÜŞTERİ TALİMATI 1) */}
      {appointmentToComplete && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-brand-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-950">Ödeme Şekli Seçiniz</h3>
                  <p className="text-[11px] text-brand-700">Hizmet Tamamlama & Kasa Kaydı</p>
                </div>
              </div>
              <button
                onClick={() => setAppointmentToComplete(null)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 text-xs space-y-1 text-brand-900">
              <div className="flex justify-between font-semibold">
                <span>Müşteri:</span>
                <span>{getMaskedName(appointmentToComplete.customerName)}</span>
              </div>
              <div className="flex justify-between">
                <span>İşlem Bedeli:</span>
                <span className="font-bold text-brand-950">{appointmentToComplete.price} ₺</span>
              </div>
              {appointmentToComplete.depositPaid && (
                <div className="flex justify-between text-emerald-800">
                  <span>Önceden Alınan Kapora:</span>
                  <span>- {appointmentToComplete.depositAmount} ₺</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-brand-800 pt-1 border-t border-brand-200">
                <span>Tahsil Edilecek Kalan:</span>
                <span>
                  {appointmentToComplete.depositPaid
                    ? Math.max(0, appointmentToComplete.price - appointmentToComplete.depositAmount)
                    : appointmentToComplete.price}{' '}
                  ₺
                </span>
              </div>
            </div>

            {/* Ödeme Yöntemi Seçenekleri */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-brand-950">Ödeme Şekli:</label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('CREDIT_CARD')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    selectedPaymentMethod === 'CREDIT_CARD'
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Kredi Kartı / POS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('CASH')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    selectedPaymentMethod === 'CASH'
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Nakit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('HAVALE')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    selectedPaymentMethod === 'HAVALE'
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Havale / FAST</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('PACKAGE')}
                  className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition cursor-pointer ${
                    selectedPaymentMethod === 'PACKAGE'
                      ? 'bg-brand-700 text-white border-brand-700 shadow-sm'
                      : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Paket / Seans</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setAppointmentToComplete(null)}
                className="w-1/3 py-2.5 rounded-xl border border-brand-200 text-brand-800 hover:bg-brand-50 text-xs font-semibold cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCompletionWithPayment}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold shadow-md shadow-brand-900/10 cursor-pointer"
              >
                Tahsil Et & Tamamla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: YENİ RANDEVU OLUŞTUR (15 DK ARALIKLAR + KAPORA BİLGİSİ) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div>
                <h3 className="text-base font-bold text-brand-950 font-serif">Yeni Randevu Oluştur</h3>
                <p className="text-xs text-brand-700">Müşteri, 15 dk saat aralığı ve kapora bilgileri</p>
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
                  placeholder="Örn: Ayşe Kaya"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Telefon Numarası *</label>
                <input
                  type="tel"
                  required
                  placeholder="0532 123 45 67"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Personel</label>
                  <select
                    value={newStaffId}
                    onChange={(e) => setNewStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs bg-white"
                  >
                    {staffList.length === 0 ? (
                      <option value="">Lütfen önce personel ekleyin</option>
                    ) : (
                      staffList.map((s) => {
                        const isOff = isStaffOff(s, selectedDate);
                        return (
                          <option key={s.id} value={s.id}>
                            {s.name} {isOff ? '⚠️ (İzinli)' : `(${s.staffCode})`}
                          </option>
                        );
                      })
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Hizmet</label>
                  <select
                    value={newServiceId}
                    onChange={(e) => setNewServiceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs bg-white"
                  >
                    {services.length === 0 ? (
                      <option value="">Lütfen önce hizmet tanımlayın</option>
                    ) : (
                      services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.price} ₺)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {isSelectedStaffOff && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Dikkat:</strong> Seçilen personel ({selectedStaffObj?.name}) bu tarihte izinlidir!
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Tarih</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium shadow-2xs bg-white"
                  />
                </div>

                {/* 15 Dakika Aralıklarla Saat Seçimi */}
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">
                    Saat (15 dk aralık)
                  </label>
                  <select
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-mono font-bold shadow-2xs bg-white"
                  >
                    {interval15MinList.map((timeSlot) => (
                      <option key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* KAPORA BİLGİSİ BÖLÜMÜ (MÜŞTERİ TALİMATI 2) */}
              <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-950">Kapora Alındı mı?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={depositPaid}
                      onChange={(e) => setDepositPaid(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-700"></div>
                  </label>
                </div>

                {depositPaid && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-100">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-800 mb-1">
                        Kapora Tutarı (TL)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-brand-200 bg-white font-bold text-brand-950 text-xs shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-800 mb-1">
                        Ödeme Şekli
                      </label>
                      <select
                        value={depositPaymentMethod}
                        onChange={(e) => setDepositPaymentMethod(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-brand-200 bg-white font-semibold text-brand-950 text-xs shadow-2xs"
                      >
                        <option value="CREDIT_CARD">Kredi Kartı</option>
                        <option value="HAVALE">Havale/FAST</option>
                        <option value="CASH">Nakit</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Not (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Örn: Kısa kare tırnak, nude renk..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs shadow-2xs"
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
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold cursor-pointer shadow-md shadow-brand-900/10"
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
