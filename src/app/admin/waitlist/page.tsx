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
    const msg = `Merhaba ${entry.customerName}, BAGE Stüdyo'da bekleme listesinde olduğunuz ${srv?.name || 'işlem'} için bugün boş bir randevu slotumuz oluştu! Randevunuzu onaylamak ister misiniz?`;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Bekleme Listesi (Waitlist)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            İptal olan saatleri anında doldurarak ciro kaybını sıfıra indiren yedek müşteri havuzu.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Bekleme Listesine Ekle</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Boş Slot Bekleyenler</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600 mt-2">{waitingCount} Müşteri</div>
          <p className="text-[11px] text-purple-600/80 mt-1">İptal anında ilk aranacaklar</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">İletişime Geçilenler</span>
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{contactedCount} Müşteri</div>
          <p className="text-[11px] text-blue-600/80 mt-1">WhatsApp ile haber verilenler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Randevuya Dönüşenler</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">{bookedCount} Müşteri</div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Kurtarılan seans cirosu</p>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Müşteri Adı</th>
                <th className="px-5 py-3">Telefon</th>
                <th className="px-5 py-3">Talep Edilen Hizmet</th>
                <th className="px-5 py-3">Tercih Edilen Uzman</th>
                <th className="px-5 py-3">Uygun Saat Aralığı</th>
                <th className="px-5 py-3">Notlar</th>
                <th className="px-5 py-3">Durum</th>
                <th className="px-5 py-3 text-right">Hızlı Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {waitlist.map((entry) => {
                const serviceObj = services.find((s) => s.id === entry.requestedServiceId);
                const staffObj = staffList.find((s) => s.id === entry.requestedStaffId);

                return (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {getMaskedName(entry.customerName)}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {getMaskedPhone(entry.customerPhone)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-800">
                        {serviceObj?.name || 'Hizmet'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {staffObj ? (
                        <span className="inline-flex items-center space-x-1 text-slate-700">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{staffObj.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Fark Etmez</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {entry.preferredTimeSlot}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-[200px] truncate">
                      {entry.notes || '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      {entry.status === 'WAITING' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                          <Clock className="w-3 h-3" />
                          <span>Sırada Bekliyor</span>
                        </span>
                      )}
                      {entry.status === 'CONTACTED' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <MessageSquare className="w-3 h-3" />
                          <span>Haber Verildi</span>
                        </span>
                      )}
                      {entry.status === 'BOOKED' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Randevuya Alındı</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {entry.status === 'WAITING' && (
                          <button
                            onClick={() => handleWhatsAppContact(entry)}
                            className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp İle Çağır</span>
                          </button>
                        )}
                        {entry.status !== 'BOOKED' && (
                          <button
                            onClick={() => updateWaitlistStatus(entry.id, 'BOOKED')}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-[11px] transition cursor-pointer"
                          >
                            <span>Randevuya Al</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Waitlist Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateEntry}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Bekleme Listesi Kaydı</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Müşteri Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Cansu Güler"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefon Numarası *</label>
                <input
                  type="text"
                  required
                  placeholder="+90 535 000 00 00"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Talep Edilen Hizmet *</label>
                <select
                  value={formData.requestedServiceId}
                  onChange={(e) => setFormData({ ...formData, requestedServiceId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} dk - {s.price} ₺)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tercih Edilen Uzman (Opsiyonel)
                </label>
                <select
                  value={formData.requestedStaffId}
                  onChange={(e) => setFormData({ ...formData, requestedStaffId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                >
                  <option value="">-- Fark Etmez (En Erken Müsait Olan) --</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Uygun Olduğu Zaman Aralığı
                </label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                >
                  <option value="Sabah (09:00-12:00)">Sabah (09:00 - 12:00)</option>
                  <option value="Öğle (12:00-16:00)">Öğle (12:00 - 16:00)</option>
                  <option value="Akşam (16:00-19:00)">Akşam (16:00 - 19:00)</option>
                  <option value="Fark Etmez">Fark Etmez (Herhangi Bir Saat)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Özel Not</label>
                <input
                  type="text"
                  placeholder="İptal durumunda hemen gelebilir vb."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
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
