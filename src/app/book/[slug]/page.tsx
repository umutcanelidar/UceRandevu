'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Check,
  ChevronRight,
  ChevronLeft,
  Heart,
  Instagram,
  ShieldCheck,
} from 'lucide-react';

type Step = 1 | 2 | 3;

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  const { tenant, services, staffList, addAppointment, loadStoreBySlug } = useApp();

  const [step, setStep] = useState<Step>(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('11:00');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Load store data by slug from cloud on mount
  useEffect(() => {
    if (params.slug) {
      loadStoreBySlug(params.slug);
    }
  }, [params.slug]);

  // Sync selected service if list changes
  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredServices = selectedCategory === 'ALL'
    ? services
    : services.filter((s) => s.category === selectedCategory);

  // 7/24 Kesintisiz 15 dakika aralıklı randevu saatleri (00:00 - 23:45)
  const generate15MinIntervals = () => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const hStr = hour.toString().padStart(2, '0');
        const mStr = min.toString().padStart(2, '0');
        slots.push(`${hStr}:${mStr}`);
      }
    }
    return slots;
  };

  const availableHours = generate15MinIntervals();

  // Randevu Talebi gönderildiğinde
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedService) return;

    // Otomatik "İlk Müsait Uzman" ataması (İşlem yetkisi aktif olanlar arasından)
    const eligibleStaff = staffList.filter((s) => s.isActive && (s.canPerformServices !== false));
    const assignedStaffId = eligibleStaff[0]?.id || staffList[0]?.id || 'staff-unassigned';

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
      notes: notes ? `[Online Talep] ${notes}` : '[Online Talep - İlk Müsait Uzman]',
      depositAmount: 0,
      depositPaid: false,
    });

    setShowSuccessModal(true);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    setStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-slate-800 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Mağaza Üst Bilgi Barı */}
      <div className="bg-[#800020] text-amber-100/90 text-[11px] py-1.5 px-4 font-medium tracking-wider flex items-center justify-between">
        <div className="flex items-center space-x-3 mx-auto sm:mx-0">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>{tenant.city || tenant.address || 'Türkiye'}</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">7/24 Kesintisiz Online Randevu</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px]">
          {tenant.instagramHandle && (
            <a
              href={`https://www.instagram.com/${tenant.instagramHandle.replace('@', '')}/`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center space-x-1 transition"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>{tenant.instagramHandle}</span>
            </a>
          )}
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`} className="hover:text-white font-semibold">
              {tenant.phone}
            </a>
          )}
        </div>
      </div>

      {/* Boutique Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-brand-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-sm border border-brand-200 bg-brand-900 shrink-0 flex items-center justify-center p-0.5">
              <img
                src={tenant.logoUrl || '/uce_logo.jpg'}
                alt={tenant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-serif font-bold text-base sm:text-lg text-brand-950 tracking-tight">
                  {tenant.name}
                </h1>
              </div>
              <p className="text-[11px] text-brand-700 font-medium tracking-wide">
                Online Randevu Portalı
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {tenant.instagramHandle && (
              <a
                href={`https://instagram.com/${tenant.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold flex items-center transition border border-brand-200"
                title={`Instagram: ${tenant.instagramHandle}`}
              >
                <Instagram className="w-4 h-4 text-brand-700" />
              </a>
            )}
            <a
              href={`tel:${tenant.phone || '+905000000000'}`}
              className="px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold flex items-center space-x-1.5 transition border border-brand-200"
            >
              <Phone className="w-3.5 h-3.5 text-brand-700" />
              <span className="hidden sm:inline">İletişim</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Booking Container (Mobile-First Centered Card) */}
      <main className="max-w-xl w-full mx-auto px-4 py-5 flex-1">
        {/* Banner Title */}
        <div className="text-center mb-6 pt-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-brand-700" />
            <span>{tenant.name} Online Randevu</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-950 tracking-tight">
            Özel Randevu Talebi
          </h2>
          <p className="text-xs text-brand-800/80 max-w-sm mx-auto mt-1 font-normal leading-relaxed">
            İstediğiniz bakımı ve size en uygun saat dilimini seçerek saniyeler içinde talep oluşturun.
          </p>
        </div>

        {/* Step Progress Pill */}
        <div className="mb-6 bg-white p-2.5 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold px-2 mb-1.5">
            <span className={step >= 1 ? 'text-brand-800 font-bold' : 'text-slate-400'}>
              1. Hizmet Seçimi
            </span>
            <span className={step >= 2 ? 'text-brand-800 font-bold' : 'text-slate-400'}>
              2. Tarih & Saat
            </span>
            <span className={step >= 3 ? 'text-brand-800 font-bold' : 'text-slate-400'}>
              3. İletişim & Talep
            </span>
          </div>
          <div className="w-full bg-brand-50 h-2 rounded-full overflow-hidden p-0.5 border border-brand-100">
            <div
              className="bg-brand-700 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm sm:text-base font-serif font-bold text-brand-950">
                  Uygulama & Hizmet Kataloğu
                </h3>
                <p className="text-xs text-brand-700/70">
                  Almak istediğiniz bakımı aşağıdan seçin
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-700 text-white shadow-xs'
                        : 'bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200/50'
                    }`}
                  >
                    {cat === 'ALL' ? 'Tüm Hizmetler' : cat}
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
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-50/80 border-brand-600 shadow-xs ring-1 ring-brand-600'
                        : 'bg-white hover:bg-brand-50/30 border-brand-100'
                    }`}
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-brand-950">{srv.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-brand-700">
                        <span className="bg-brand-100/70 px-2 py-0.5 rounded-md font-medium">
                          {srv.durationMinutes} dakika
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-brand-800 font-medium">{srv.category}</span>
                      </div>
                      {srv.description && (
                        <p className="text-xs text-slate-500 pt-0.5 leading-relaxed">
                          {srv.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-brand-800 font-serif">
                        {srv.price} {tenant.currency}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand-700 text-white flex items-center justify-center ml-auto mt-1">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredServices.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-brand-100 space-y-1">
                  <p className="font-semibold text-sm text-slate-700">Bu işletmede henüz hizmet listesi tanımlanmamış.</p>
                  <p className="text-xs text-slate-400">Lütfen daha sonra tekrar deneyiniz.</p>
                </div>
              )}
            </div>

            <button
              disabled={!selectedService}
              onClick={() => selectedService && setStep(2)}
              className={`w-full py-3.5 text-white font-bold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center space-x-2 shadow-md shadow-brand-900/10 mt-4 ${
                !selectedService
                  ? 'bg-slate-300 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 cursor-pointer'
              }`}
            >
              <span>Tarih ve Saat Seçimiyle Devam Et</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Select Date & 15-Minute Time Slot */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-brand-950">
                    Randevu Tarihi
                  </h3>
                  <p className="text-xs text-brand-700/70">
                    Geleceğiniz günü belirleyin
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
                  <span>İlk Müsait Uzman</span>
                </div>
              </div>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 bg-white text-xs sm:text-sm font-semibold text-brand-950 focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 shadow-2xs"
                />
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-serif font-bold text-brand-950">
                  Müsait Saat Dilimi (10:00 - 21:00)
                </label>
                <span className="text-[11px] font-medium text-brand-700">15 dk aralıklarla</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-64 overflow-y-auto pr-1">
                {availableHours.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer border text-center ${
                        isSelected
                          ? 'bg-brand-700 text-white border-brand-700 shadow-xs ring-1 ring-brand-700'
                          : 'bg-brand-50/50 text-brand-900 border-brand-100 hover:bg-brand-100/60'
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
                onClick={() => setStep(1)}
                className="w-1/3 py-3.5 rounded-2xl border border-brand-200 bg-white font-semibold text-xs text-brand-800 hover:bg-brand-50 transition cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center space-x-2 shadow-md shadow-brand-900/10 cursor-pointer"
              >
                <span>İletişim & Talep Oluştur</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Customer Details & "BAGE’ye Talep Oluştur" */}
        {step === 3 && (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs space-y-3">
              <h3 className="text-sm sm:text-base font-serif font-bold text-brand-950">
                İletişim & Onay Bilgileri
              </h3>
              <p className="text-xs text-brand-700/80">
                Randevunuzun teyidi ve detaylı bilgilendirme için iletişim bilgilerinizi giriniz.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Buse Yıldız"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">
                    Cep Telefonu Numaranız *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0532 123 45 67"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">
                    Özel İstek / Not (Opsiyonel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tırnak modeli, referans tasarım veya özel istekleriniz..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-600 focus:ring-1 focus:ring-brand-600 text-xs text-slate-900 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Selected Booking Summary */}
            <div className="bg-white p-4 rounded-2xl border border-brand-200 space-y-2.5 text-xs text-brand-900 shadow-xs">
              <div className="flex justify-between items-center pb-2 border-b border-brand-100">
                <span className="text-brand-700/80">Seçilen Hizmet:</span>
                <strong className="text-brand-950 font-bold">{selectedService.name}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-brand-100">
                <span className="text-brand-700/80">Uzman:</span>
                <span className="px-2 py-0.5 bg-brand-50 border border-brand-200 text-brand-800 rounded-md font-semibold text-[11px]">
                  İlk Müsait Uzman
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-brand-100">
                <span className="text-brand-700/80">Tarih & Saat:</span>
                <strong className="text-brand-950 font-semibold">{selectedDate} • {selectedTime}</strong>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm">
                <span className="font-serif font-bold text-brand-950">Toplam Tutar:</span>
                <strong className="text-brand-800 font-serif font-bold text-base">
                  {selectedService.price} {tenant.currency}
                </strong>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3.5 rounded-2xl border border-brand-200 bg-white font-semibold text-xs text-brand-800 hover:bg-brand-50 transition cursor-pointer"
              >
                Geri
              </button>
              {/* Exact button requested: "BAGE’ye Talep Oluştur" */}
              <button
                type="submit"
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-brand-900/15 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>BAGE’ye Talep Oluştur</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* SUCCESS CONFIRMATION MODAL - EXACT TEXT REQUESTED BY CLIENT */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Heart / Sparkle Icon */}
            <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto border border-brand-200 shadow-inner">
              <Heart className="w-8 h-8 fill-brand-700 text-brand-700" />
            </div>

            {/* Exact Client Text */}
            <div className="space-y-3 text-slate-800 text-xs sm:text-sm leading-relaxed text-center px-1">
              <p className="font-serif font-bold text-base sm:text-lg text-brand-950">
                Talebiniz alındı. BAGE’ye göstermiş olduğunuz ilgi için teşekkür ederiz 🤍
              </p>

              <div className="py-2 px-3 bg-brand-50/70 rounded-2xl border border-brand-100/80 text-brand-900 space-y-2 text-xs">
                <p className="font-semibold text-brand-800">
                  Randevu talebiniz başarıyla alınmıştır.
                </p>
                <p>
                  Randevunuzun kesin onayı için en kısa sürede sizinle iletişime geçeceğiz ღ
                </p>
              </div>

              <p className="text-slate-600 text-[11px] italic">
                Onay mesajınız tarafınıza iletilmeden randevunuz kesinleşmiş sayılmamaktadır.
              </p>

              <div className="pt-2 text-brand-900">
                <p className="font-medium">
                  Sizi BAGE’de ağırlamak için sabırsızlanıyoruz.
                </p>
                <p className="font-serif font-bold text-sm sm:text-base text-brand-800 mt-1">
                  BAGE Nail Studio | Beaute ✨
                </p>
              </div>

              {/* Instagram Follow Button */}
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/bage.nailstudio/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-semibold border border-brand-200 transition"
                >
                  <Instagram className="w-4 h-4 text-brand-700" />
                  <span>Instagram: @bage.nailstudio</span>
                </a>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-900/10 transition cursor-pointer"
              >
                Anladım, Teşekkür Ederim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boutique Footer */}
      <footer className="py-4 border-t border-brand-100 text-center text-[11px] text-brand-800/60 bg-white">
        <div className="flex items-center justify-center space-x-3 mb-1">
          <a
            href="https://www.instagram.com/bage.nailstudio/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1 text-brand-700 hover:text-brand-900 font-semibold transition"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@bage.nailstudio</span>
          </a>
          <span>•</span>
          <a href="tel:+902125551234" className="hover:text-brand-900 font-medium">
            +90 212 555 12 34
          </a>
        </div>
        <p className="font-medium">
          <strong className="text-brand-900">BAGE Nail Studio | Beaute</strong> • Bagenailstudiobeaute.com
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          UCE Bilişim Altyapısı ile Güvenli Randevu Sistemi
        </p>
      </footer>
    </div>
  );
}
