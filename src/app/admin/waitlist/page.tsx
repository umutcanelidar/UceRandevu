'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Plus,
  MessageSquare,
  CheckCircle2,
  Phone,
  User,
  Sparkles,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function WaitlistPage() {
  const {
    waitlist,
    addToWaitlist,
    updateWaitlistStatus,
    services,
    staffList,
    currentUser,
    getMaskedName,
    getMaskedPhone,
    sendWhatsAppMessage,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    requestedServiceId: services[0]?.id || '',
    requestedStaffId: '',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTimeSlot: 'Öğle (12:00-16:00)',
    notes: '',
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) return;

    addToWaitlist({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone || '+90 530 000 00 00',
      requestedServiceId: formData.requestedServiceId,
      requestedStaffId: formData.requestedStaffId || undefined,
      preferredDate: formData.preferredDate,
      preferredTimeSlot: formData.preferredTimeSlot,
      notes: formData.notes,
      status: 'WAITING',
    });

    setFormData({
      customerName: '',
      customerPhone: '',
      requestedServiceId: services[0]?.id || '',
      requestedStaffId: '',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTimeSlot: 'Öğle (12:00-16:00)',
      notes: '',
    });
    setIsModalOpen(false);
  };

  const handleWhatsAppContact = (entry: any) => {
    const srv = services.find((s) => s.id === entry.requestedServiceId);
    const msg = `Merhaba ${entry.customerName}, BAGE Nail Studio'da bekleme listesinde olduğunuz ${srv?.name || 'işlem'} için bugün boş bir randevu saatimiz oluştu! Randevunuzu kesinleştirmek için bize yazabilirsiniz. 🤍`;
    sendWhatsAppMessage(entry.customerPhone, msg);
    updateWaitlistStatus(entry.id, 'CONTACTED');
    alert(`Müşteriye WhatsApp bildirim mesajı gönderildi:\n"${msg}"`);
  };

  const waitingCount = waitlist.filter((w) => w.status === 'WAITING').length;
  const contactedCount = waitlist.filter((w) => w.status === 'CONTACTED').length;
  const bookedCount = waitlist.filter((w) => w.status === 'BOOKED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
            Bekleme Listesi (Waitlist)
          </h1>
          <p className="text-xs text-brand-700 mt-1">
            İptal olan saatleri anında doldurarak ciro kaybını sıfıra indiren yedek müşteri havuzu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-brand-900/10 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Bekleme Kaydı Ekle</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Sırada Bekleyenler</span>
            <Clock className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950 mt-2">{waitingCount} Kişi</div>
          <p className="text-[11px] text-brand-600 mt-1">İptal olunca haber verilecek müşteriler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Mesaj İletilenler</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-amber-900 mt-2">{contactedCount} Kişi</div>
          <p className="text-[11px] text-amber-700 mt-1">WhatsApp ile boşluk haberi verilenler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Kurtarılan Randevular</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-2">{bookedCount} Randevu</div>
          <p className="text-[11px] text-emerald-700 mt-1">Boşluğu değerlendirip gelenler</p>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-950">
            <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase tracking-wider border-b border-brand-100">
              <tr>
                <th className="px-5 py-3">Müşteri</th>
                <th className="px-5 py-3">Telefon</th>
                <th className="px-5 py-3">Talep Edilen Hizmet</th>
                <th className="px-5 py-3">İstenen Uzman</th>
                <th className="px-5 py-3">Tarih & Zaman Dilimi</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {waitlist.map((entry) => {
                const srv = services.find((s) => s.id === entry.requestedServiceId);
                const staff = staffList.find((s) => s.id === entry.requestedStaffId);

                return (
                  <tr key={entry.id} className="hover:bg-brand-50/30 transition">
                    <td className="px-5 py-3.5 font-bold text-brand-950">
                      {getMaskedName(entry.customerName)}
                      {entry.notes && (
                        <p className="text-[11px] text-slate-400 font-normal italic">
                          {entry.notes}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-brand-900">
                      {getMaskedPhone(entry.customerPhone)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-brand-800">{srv?.name || 'Hizmet'}</td>
                    <td className="px-5 py-3.5 text-brand-700">{staff ? staff.name : 'İlk Müsait'}</td>
                    <td className="px-5 py-3.5 text-brand-950">
                      {entry.preferredDate} • <span className="font-semibold">{entry.preferredTimeSlot}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          entry.status === 'WAITING'
                            ? 'bg-brand-50 text-brand-800 border border-brand-200'
                            : entry.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {entry.status === 'WAITING'
                          ? 'Sırada'
                          : entry.status === 'CONTACTED'
                          ? 'Ulaşıldı'
                          : 'Bağlandı'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {entry.status === 'WAITING' && (
                        <button
                          onClick={() => handleWhatsAppContact(entry)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition ml-auto cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Boşluk Bildir</span>
                        </button>
                      )}
                      {entry.status === 'CONTACTED' && (
                        <button
                          onClick={() => updateWaitlistStatus(entry.id, 'BOOKED')}
                          className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition ml-auto cursor-pointer"
                        >
                          Randevuya Çevir
                        </button>
                      )}
                      {entry.status === 'BOOKED' && (
                        <span className="text-[11px] text-emerald-800 font-bold">✓ Randevu Alındı</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Waitlist Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEntry}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">Bekleme Listesine Ekle</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-950 block mb-1">Müşteri Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Cansu Güler"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  placeholder="0532 000 00 00"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">İstenen Hizmet</label>
                  <select
                    value={formData.requestedServiceId}
                    onChange={(e) => setFormData({ ...formData, requestedServiceId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Tercih Edilen Uzman</label>
                  <select
                    value={formData.requestedStaffId}
                    onChange={(e) => setFormData({ ...formData, requestedStaffId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="">Fark Etmez (İlk Boş)</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Tercih Edilen Tarih</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Saat Aralığı</label>
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="Sabah (10:00-13:00)">Sabah (10:00-13:00)</option>
                    <option value="Öğle (13:00-17:00)">Öğle (13:00-17:00)</option>
                    <option value="Akşam (17:00-21:00)">Akşam (17:00-21:00)</option>
                    <option value="Farketmez / Tüm Gün">Farketmez / Tüm Gün</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Not / Esneklik Durumu</label>
                <input
                  type="text"
                  placeholder="Örn: 1 saat önceden haber verilirse gelebilir..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                Listeye Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
