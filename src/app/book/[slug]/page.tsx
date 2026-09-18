'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  MessageSquare,
} from 'lucide-react';

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  const { tenant, services, staffList, addAppointment } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('ANY');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStaff = staffList.find((s) => s.id === selectedStaffId);

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = selectedCategory === 'ALL'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  const availableHours = ['09:30', '10:30', '11:30', '13:00', '14:00', '15:30', '16:30', '17:30', '18:30'];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    let assignedStaffId = selectedStaffId;
    if (assignedStaffId === 'ANY') {
      assignedStaffId = staffList[0]?.id || 'staff-1';
    }

    const duration = selectedService?.durationMinutes || 60;
    const [h, m] = selectedTime.split(':').map(Number);
    const totalMin = h * 60 + m + duration;
    const endH = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const endM = (totalMin % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    addAppointment({
      tenantId: tenant.id,
      customerName,
      customerPhone,
      staffId: assignedStaffId,
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      status: 'CONFIRMED',
      price: selectedService.price,
      notes,
      depositAmount: 0,
      depositPaid: false,
    });

    setStep(5);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 leading-tight">{tenant.name}</h1>
              <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{tenant.address}</span>
              </p>
            </div>
          </div>

          <a
            href={`tel:${tenant.phone}`}
            className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs flex items-center space-x-1.5 transition"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline font-semibold">Ara</span>
          </a>
        </div>
      </header>

      {/* Main Booking Container */}
      <main className="max-w-2xl w-full mx-auto px-4 py-6 flex-1">
        {/* Step Progress */}
        {step < 5 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-blue-600' : ''}>1. Hizmet</span>
              <span className={step >= 2 ? 'text-blue-600' : ''}>2. Uzman</span>
              <span className={step >= 3 ? 'text-blue-600' : ''}>3. Saat</span>
              <span className={step >= 4 ? 'text-blue-600' : ''}>4. Onay</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Hizmet Seçiniz</h2>
                <p className="text-xs text-slate-500">Almak istediğiniz bakım veya uygulama türünü belirleyin</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tümü' : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredServices.map((srv) => {
                const isSelected = selectedServiceId === srv.id;

                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedServiceId(srv.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-sm text-slate-900">{srv.name}</h3>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {srv.durationMinutes} dk
                        </span>
                      </div>
                      {srv.description && (
                        <p className="text-xs text-slate-500 line-clamp-1">{srv.description}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-sm font-bold text-blue-700">
                        {srv.price} {tenant.currency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer mt-4"
            >
              <span>Uzman Seçimiyle Devam Et</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Select Staff */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="text-base font-bold text-slate-900">Uzman / Personel Seçiniz</h2>
              <p className="text-xs text-slate-500">Hizmeti almak istediğiniz uzmanı seçebilir veya ilk boş uzmanı tercih edebilirsiniz.</p>
            </div>

            <div className="space-y-2.5">
              {/* Any Staff Option */}
              <div
                onClick={() => setSelectedStaffId('ANY')}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center space-x-3.5 ${
                  selectedStaffId === 'ANY'
                    ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">İlk Müsait Uzman (Farketmez)</h3>
                  <p className="text-xs text-slate-500">En erken boşlukta en hızlı randevu</p>
                </div>
              </div>

              {/* Specific Staff */}
              {staffList.map((staff) => {
                const isSelected = selectedStaffId === staff.id;

                return (
                  <div
                    key={staff.id}
                    onClick={() => setSelectedStaffId(staff.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center space-x-3.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{staff.name}</h3>
                      <p className="text-xs text-slate-500">{staff.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>Tarih & Saat Seç</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date & Time */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">Tarih ve Saat Seçiniz</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Randevu Tarihi</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Müsait Başlangıç Saatleri</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableHours.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>İletişim Bilgilerine Geç</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Customer Details & Confirmation */}
        {step === 4 && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">İletişim Bilgileriniz</h2>
              <p className="text-xs text-slate-500">Randevu teyidi WhatsApp üzerinden cep telefonunuza iletilecektir.</p>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ayşe Yılmaz"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cep Telefonu Numaranız *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Özel İstek / Not (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    placeholder="Tırnak modeli, referans görsel veya özel talepleriniz..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Hizmet:</span>
                <strong>{selectedService.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Uzman:</span>
                <strong>{selectedStaffId === 'ANY' ? 'İlk Müsait Uzman' : selectedStaff?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarih & Saat:</span>
                <strong>{selectedDate} • {selectedTime}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-900">Toplam Ücret:</span>
                <strong className="text-blue-700">{selectedService.price} {tenant.currency}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Geri
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Randevuyu Onayla & Tamamla
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Success Screen */}
        {step === 5 && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-5 shadow-xs max-w-lg mx-auto my-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Randevunuz Alındı!</h2>
              <p className="text-xs text-slate-500">
                Sayın <strong>{customerName}</strong>, randevu kaydınız başarıyla oluşturulmuştur.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Hizmet:</span>
                <strong>{selectedService.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tarih & Saat:</span>
                <strong>{selectedDate} • {selectedTime}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tutar:</span>
                <strong className="text-blue-700">{selectedService.price} {tenant.currency}</strong>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center space-x-2 text-left">
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Randevu detaylarınız <strong>{customerPhone}</strong> numaralı WhatsApp hattınıza gönderilmiştir.</span>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setCustomerName('');
                setCustomerPhone('');
                setNotes('');
              }}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Yeni Bir Randevu Oluştur
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-[11px] text-slate-400 bg-white">
        Altyapı: <strong className="text-slate-600">UCE Bilişim Randevu Sistemi</strong> • Tüm Hakları Saklıdır
      </footer>
    </div>
  );
}
