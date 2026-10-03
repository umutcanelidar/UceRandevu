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
  Trash2,
  ShieldCheck,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  BadgeAlert,
  Sparkles,
  Calculator,
  KeyRound,
} from 'lucide-react';
import { StaffLeaveRecord } from '@/types';

export default function AdminStaffPage() {
  const {
    currentUser,
    tenant,
    staffList,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffServicePermission,
    toggleStaffOffDay,
    addStaffLeaveRecord,
    deleteStaffLeaveRecord,
    appointments,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedStaffIdForLeave, setSelectedStaffIdForLeave] = useState<string>(staffList[0]?.id || '');
  const [leaveDate, setLeaveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [leaveType, setLeaveType] = useState<'PAID' | 'UNPAID' | 'SICK'>('UNPAID');
  const [leaveNotes, setLeaveNotes] = useState<string>('');

  const [staffCode, setStaffCode] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('1234');
  const [baseSalary, setBaseSalary] = useState('32000');
  const [commissionRate, setCommissionRate] = useState('35');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('20:00');

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-100 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-950 font-serif">Yetkisiz Erişim</h2>
        <p className="text-xs text-brand-700 leading-relaxed">
          Personel yönetimi, izinler ve maaş hesaplamaları yalnızca <strong>BAGE Salon Sahibi</strong> yetkisindedir.
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
      title: title || 'Protez Tırnak & Nail Art Uzmanı',
      phone: phone || '+90 530 000 00 00',
      pinCode: pinCode.trim() || '1234',
      avatarColor: 'bg-brand-700',
      isActive: true,
      canPerformServices: true,
      baseSalary: Number(baseSalary) || 30000,
      commissionRate: Number(commissionRate) || 35,
      workingHours: {
        start: startTime,
        end: endTime,
        days: [1, 2, 3, 4, 5, 6],
      },
      offDays: [7], // Pazar izinli
      leaveDates: [],
      leaveRecords: [],
    });

    setShowAddModal(false);
    setStaffCode('');
    setName('');
    setTitle('');
    setPhone('');
    setPinCode('1234');
  };

  const autoGenerateCode = () => {
    const nextNum = staffList.length + 1;
    setStaffCode(`ST-0${nextNum}`);
  };

  const handleAddLeaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffIdForLeave || !leaveDate) return;

    addStaffLeaveRecord(selectedStaffIdForLeave, {
      date: leaveDate,
      type: leaveType,
      notes: leaveNotes || (leaveType === 'UNPAID' ? 'Ücretsiz İzin' : leaveType === 'PAID' ? 'Ücretli Yıllık İzin' : 'Hastalık/Rapor'),
    });

    setShowLeaveModal(false);
    setLeaveNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-brand-950 font-serif tracking-tight">
              Personeller, İzinler & Maaş Hesaplama
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
              {staffList.length} Uzman
            </span>
          </div>
          <p className="text-xs text-brand-700 mt-1">
            İşlem yetkisi açma/kapatma, rapor ve izin günlerine göre otomatik net maaş ve prim hesaplaması.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedStaffIdForLeave(staffList[0]?.id || '');
              setShowLeaveModal(true);
            }}
            className="px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-xl border border-brand-200 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-brand-700" />
            <span>İzin / Rapor Ekle</span>
          </button>

          <button
            onClick={() => {
              autoGenerateCode();
              setShowAddModal(true);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 shadow-sm shadow-brand-900/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>Yeni Personel</span>
          </button>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffList.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border-2 border-dashed border-brand-200 space-y-4 my-2">
            <div className="w-14 h-14 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-brand-950 font-serif">Henüz Personel Eklenmedi</h3>
            <p className="text-xs text-brand-700 max-w-md mx-auto leading-relaxed">
              İşletmenizin uzmanlarını, çalışma saatlerini, maaş/prim oranlarını ve giriş PIN kodlarını belirlemek için ilk personelinizi ekleyin.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-200" />
              <span>İlk Personeli Ekle</span>
            </button>
          </div>
        ) : (
          staffList.map((staff) => {
            const staffApts = appointments.filter((a) => a.staffId === staff.id);
          const completedApts = staffApts.filter((a) => a.status === 'COMPLETED');
          const totalStaffTurnover = completedApts.reduce((sum, a) => sum + a.price, 0);
          const commissionEarned = Math.round(totalStaffTurnover * ((staff.commissionRate || 35) / 100));

          // Maaş ve İzin Hesaplama
          const salary = staff.baseSalary || 32000;
          const dailyRate = Math.round(salary / 30);
          const unpaidLeaveDays = (staff.leaveRecords || []).filter((r) => r.type === 'UNPAID').length;
          const unpaidDeduction = unpaidLeaveDays * dailyRate;
          const netPayableSalary = Math.max(0, salary - unpaidDeduction + commissionEarned);

          const canPerform = staff.canPerformServices !== false;

          return (
            <div
              key={staff.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                canPerform ? 'border-brand-100 hover:border-brand-300' : 'border-slate-200 bg-slate-50/60 opacity-90'
              }`}
            >
              <div className="space-y-3">
                {/* Staff Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 font-serif font-bold flex items-center justify-center text-base border border-brand-200">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-brand-950 font-serif">{staff.name}</h3>
                        <span className="font-mono text-[10px] font-bold text-brand-800 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                          {staff.staffCode}
                        </span>
                      </div>
                      <p className="text-xs text-brand-700 font-medium">{staff.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* Delete Staff Button */}
                    <button
                      onClick={() => {
                        if (confirm(`${staff.name} isimli personeli sistemden silmek istediğinize emin misiniz?`)) {
                          deleteStaff(staff.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Personeli Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* İşlem Yetkisi Toggle (Müşteri Talimatı 15) */}
                <div className="p-2.5 rounded-xl bg-brand-50/50 border border-brand-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-brand-950 block">İşlem Yapma Yetkisi:</span>
                    <span className="text-[11px] text-brand-700">
                      {canPerform ? 'Müşteri randevuları bu uzmana atanabilir' : 'Randevu alımı geçici olarak durduruldu'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStaffServicePermission(staff.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      canPerform
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {canPerform ? 'Yetki: Açık' : 'Yetki: Kapalı'}
                  </button>
                </div>

                {/* Contact & Hours */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center space-x-1.5 text-brand-900">
                    <Phone className="w-3.5 h-3.5 text-brand-600" />
                    <span className="font-mono">{staff.phone}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-brand-900">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>{staff.workingHours.start} - {staff.workingHours.end}</span>
                  </div>
                </div>

                {/* Personel Giriş PIN Kodu */}
                <div className="p-2.5 rounded-xl bg-brand-50/70 border border-brand-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-4 h-4 text-brand-700" />
                    <div>
                      <span className="font-bold text-brand-950 block">Giriş PIN Kodu:</span>
                      <span className="text-[11px] text-brand-700">
                        Personel sisteme giriş yaparken bu PIN'i kullanır.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-1 bg-white font-mono font-bold text-xs text-brand-950 rounded-lg border border-brand-200 shadow-2xs tracking-widest">
                      {staff.pinCode || '1234'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const newPin = prompt(`${staff.name} için yeni 4-6 haneli PIN kodu belirleyiniz:`, staff.pinCode || '1234');
                        if (newPin && newPin.trim()) {
                          updateStaff(staff.id, { pinCode: newPin.trim() });
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-[11px] font-semibold transition cursor-pointer"
                    >
                      PIN Değiştir
                    </button>
                  </div>
                </div>

                {/* Maaş & Hakediş Hesap Tablosu (Müşteri Talimatı 3) */}
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-1.5 text-xs text-brand-950">
                  <div className="flex items-center justify-between font-bold pb-1 border-b border-amber-200/60">
                    <span className="flex items-center space-x-1">
                      <Calculator className="w-3.5 h-3.5 text-brand-700" />
                      <span>Maaş & Prim Hesaplaması:</span>
                    </span>
                    <span className="text-brand-800 font-serif">
                      Net: {netPayableSalary.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-0.5">
                    <div>
                      <span className="text-slate-500 block">Sabit Maaş:</span>
                      <strong>{salary.toLocaleString('tr-TR')} ₺</strong>
                    </div>
                    <div>
                      <span className="text-rose-600 block">Ücretsiz Kesinti ({unpaidLeaveDays} gün):</span>
                      <strong className="text-rose-700">-{unpaidDeduction.toLocaleString('tr-TR')} ₺</strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Kazanılan Prim (%{staff.commissionRate}):</span>
                      <strong className="text-emerald-800">+{commissionEarned.toLocaleString('tr-TR')} ₺</strong>
                    </div>
                  </div>
                </div>

                {/* Haftalık İzin Günleri */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                    Haftalık İzin Günleri:
                  </span>
                  <div className="flex items-center space-x-1">
                    {[
                      { num: 1, label: 'Pzt' },
                      { num: 2, label: 'Sal' },
                      { num: 3, label: 'Çar' },
                      { num: 4, label: 'Per' },
                      { num: 5, label: 'Cum' },
                      { num: 6, label: 'Cmt' },
                      { num: 7, label: 'Paz' },
                    ].map((day) => {
                      const isOff = staff.offDays && staff.offDays.includes(day.num);
                      return (
                        <button
                          key={day.num}
                          type="button"
                          onClick={() => toggleStaffOffDay(staff.id, day.num)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                            isOff
                              ? 'bg-brand-700 text-white shadow-xs'
                              : 'bg-brand-50 text-brand-800 hover:bg-brand-100'
                          }`}
                          title={isOff ? `${day.label} İzinli (Takvimde Kilitli)` : `${day.label} Çalışıyor`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detaylı İzin Kayıtları (Hastalık, Ücretli, Ücretsiz) */}
                {staff.leaveRecords && staff.leaveRecords.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">
                      Kayıtlı İzin & Raporlar:
                    </span>
                    <div className="space-y-1">
                      {staff.leaveRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className={`text-[11px] p-2 rounded-xl border flex items-center justify-between ${
                            rec.type === 'UNPAID'
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : rec.type === 'SICK'
                              ? 'bg-amber-50 border-amber-200 text-amber-900'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <div>
                            <span className="font-bold mr-1.5">{rec.date}</span>
                            <span className="font-semibold px-1 py-0.2 rounded text-[10px] bg-white/80 border">
                              {rec.type === 'UNPAID' ? 'Ücretsiz İzin' : rec.type === 'SICK' ? 'Rapor / Hastalık' : 'Ücretli İzin'}
                            </span>
                            {rec.notes && <span className="ml-1 text-[10px] opacity-80">({rec.notes})</span>}
                          </div>
                          <button
                            onClick={() => deleteStaffLeaveRecord(staff.id, rec.id)}
                            className="text-slate-400 hover:text-rose-700 font-bold px-1.5 cursor-pointer"
                            title="İzin Kaydını Sil"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-brand-900">
                <span>
                  Toplam Randevu: <strong>{staffApts.length}</strong>
                </span>

                <span className="text-brand-800 font-semibold flex items-center space-x-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sistemde Aktif</span>
                </span>
              </div>
            </div>
          );
        }))}
      </div>

      {/* MODAL: İZİN / RAPOR EKLE (MÜŞTERİ TALİMATI 3) */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div>
                <h3 className="text-base font-bold text-brand-950 font-serif">Personel İzin / Rapor Ekle</h3>
                <p className="text-xs text-brand-700">İzin tipine göre maaştan otomatik düşüş hesaplanır</p>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeaveRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-950 mb-1">Personel Seçiniz *</label>
                <select
                  value={selectedStaffIdForLeave}
                  onChange={(e) => setSelectedStaffIdForLeave(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white font-medium text-brand-950 text-xs shadow-2xs"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.staffCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">İzin Tarihi *</label>
                <input
                  type="date"
                  required
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 bg-white font-medium text-brand-950 text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">İzin Türü *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLeaveType('UNPAID')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      leaveType === 'UNPAID'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Ücretsiz İzin
                    <span className="block text-[10px] font-normal opacity-80">(Maaştan Düşer)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaveType('SICK')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      leaveType === 'SICK'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Hastalık / Rapor
                    <span className="block text-[10px] font-normal opacity-80">(Raporlu)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLeaveType('PAID')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      leaveType === 'PAID'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Ücretli İzin
                    <span className="block text-[10px] font-normal opacity-80">(Yıllık İzin)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Açıklama / Not</label>
                <input
                  type="text"
                  placeholder="Örn: Doktor raporu, özel mazeret..."
                  value={leaveNotes}
                  onChange={(e) => setLeaveNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-xs shadow-2xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-brand-200 text-brand-800 hover:bg-brand-50 font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold cursor-pointer shadow-md shadow-brand-900/10"
                >
                  İzni Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: YENİ PERSONEL EKLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h3 className="text-base font-bold text-brand-950 font-serif">Yeni Personel Tanımla</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block font-semibold text-brand-950 mb-1">Personel ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="ST-05"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 font-mono font-bold text-xs uppercase shadow-2xs"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-brand-950 mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Elif Aksoy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs font-medium shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Uzmanlık / Ünvan</label>
                <input
                  type="text"
                  placeholder="Örn: Protez Tırnak & Nail Art Uzmanı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Telefon</label>
                  <input
                    type="tel"
                    placeholder="0532 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">
                    Giriş PIN Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 font-mono font-bold text-xs text-brand-950 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Sabit Maaş (TL)</label>
                  <input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs font-bold shadow-2xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Prim Oranı (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs font-bold shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Mesai Başlangıç</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Mesai Bitiş</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-xs shadow-2xs"
                  />
                </div>
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
