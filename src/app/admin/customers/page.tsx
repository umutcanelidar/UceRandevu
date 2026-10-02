'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  Plus,
  Calendar,
  Phone,
  Gift,
  Clock,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Banknote,
  Building2,
  Package,
  Trash2,
} from 'lucide-react';

export default function CustomersPage() {
  const {
    customers,
    currentUser,
    getMaskedName,
    getMaskedPhone,
    addCustomer,
    deleteCustomer,
    customerPackages,
    staffList,
    services,
    appointments,
    sendWhatsAppMessage,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'churn45' | 'birthday'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // New Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    notes: '',
    depositStatus: 'NONE' as 'NONE' | 'PAID' | 'WAITING',
    depositAmount: 0,
    favoriteStaffId: '',
  });

  const today = new Date();

  // Helper: calculate days since date
  const getDaysAgo = (dateStr: string) => {
    if (!dateStr) return 999;
    const past = new Date(dateStr);
    const diffTime = Math.abs(today.getTime() - past.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: is birthday this month / week
  const isBirthdaySoon = (birthDateStr?: string) => {
    if (!birthDateStr) return false;
    const bday = new Date(birthDateStr);
    return bday.getMonth() === today.getMonth();
  };

  // 45 gün gelmeyen müşteriler
  const churnList = customers.filter((c) => getDaysAgo(c.lastVisitDate) >= 45);
  const birthdayList = customers.filter((c) => isBirthdaySoon(c.birthDate));

  // Filtered list based on active tab and search
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'churn45') {
      return getDaysAgo(c.lastVisitDate) >= 45;
    }
    if (activeTab === 'birthday') {
      return isBirthdaySoon(c.birthDate);
    }
    return true;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addCustomer({
      tenantId: 'tenant-bage',
      name: formData.name,
      phone: formData.phone || '+90 530 000 00 00',
      birthDate: formData.birthDate,
      notes: formData.notes,
      totalVisits: 1,
      totalSpent: 0,
      lastVisitDate: new Date().toISOString().split('T')[0],
      depositStatus: formData.depositStatus,
      depositAmount: Number(formData.depositAmount) || 0,
      favoriteStaffId: formData.favoriteStaffId,
    });

    setFormData({
      name: '',
      phone: '',
      birthDate: '',
      notes: '',
      depositStatus: 'NONE',
      depositAmount: 0,
      favoriteStaffId: '',
    });
    setIsAddModalOpen(false);
  };

  const handleSendRetentionWhatsApp = (customer: any) => {
    const msg = `Merhaba ${customer.name}, BAGE Stüdyo'dan sevgiler! Son bakımınızın üzerinden 45 günden fazla zaman geçti. Tırnak sağlığınızı korumak ve tazelenmek için size özel bir randevu planlayalım mı? 🤍`;
    sendWhatsAppMessage(customer.phone, msg);
    alert(`WhatsApp mesajı gönderildi:\n"${msg}"`);
  };

  const handleSendBirthdayWhatsApp = (customer: any) => {
    const msg = `İyi ki doğdunuz ${customer.name}! 🎂 BAGE Nail Studio ailesi olarak yeni yaşınızı kutlarız. Bu ayki tüm tırnak ve bakım işlemlerinizde size özel %20 hediye indiriminiz hazır! ✨`;
    sendWhatsAppMessage(customer.phone, msg);
    alert(`Doğum günü mesajı gönderildi:\n"${msg}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
              Müşteri Yönetimi & CRM
            </h1>
            {!isAdmin && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Lock className="w-3 h-3" />
                <span>Gizlilik Aktif</span>
              </span>
            )}
          </div>
          <p className="text-xs text-brand-700 mt-1">
            Ziyaret geçmişi, ödeme yöntemleri, 45 gün gelmeyen müşteri alarmı ve sadakat takibi.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold rounded-xl text-xs shadow-sm shadow-brand-900/10 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-200" />
          <span>Yeni Müşteri Ekle</span>
        </button>
      </div>

      {/* Retention & Birthday Alarm Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 45 Days Churn Alarm Card */}
        <div
          onClick={() => setActiveTab('churn45')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            activeTab === 'churn45'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white hover:bg-rose-50/30 border-rose-100'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-brand-950">45+ Gün Gelmeyenler</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                  {churnList.length} Müşteri
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Tırnak ve bakım süresi doldu! WhatsApp ile hemen randevu teklif edin.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-400" />
        </div>

        {/* Birthday Alarm Card */}
        <div
          onClick={() => setActiveTab('birthday')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
            activeTab === 'birthday'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white hover:bg-amber-50/30 border-amber-100'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-brand-950">Bu Ay Doğum Günü Olanlar</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {birthdayList.length} Kişi
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Doğum günü hediyesi & %20 kutlama indirimi mesajı gönderin.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-brand-50 text-brand-800 hover:bg-brand-100'
              }`}
            >
              Tüm Müşteriler ({customers.length})
            </button>
            <button
              onClick={() => setActiveTab('churn45')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                activeTab === 'churn45'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <span>45 Gün Alarmı</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                {churnList.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('birthday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1 ${
                activeTab === 'birthday'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span>Doğum Günleri</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                {birthdayList.length}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="İsim, telefon veya not ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-brand-200 text-xs font-medium focus:outline-hidden focus:border-brand-700 text-brand-950"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-950">
            <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase tracking-wider border-b border-brand-100">
              <tr>
                <th className="px-5 py-3">Müşteri</th>
                <th className="px-5 py-3">Telefon</th>
                <th className="px-5 py-3">Son Geliş</th>
                <th className="px-5 py-3">Toplam Ziyaret</th>
                <th className="px-5 py-3">Toplam Harcama</th>
                <th className="px-5 py-3 text-right">İşlem & Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {filteredCustomers.map((customer) => {
                const daysAgo = getDaysAgo(customer.lastVisitDate);
                const isChurn = daysAgo >= 45;
                const isBday = isBirthdaySoon(customer.birthDate);
                const activePkg = customerPackages.find(
                  (cp) => cp.customerId === customer.id && cp.status === 'ACTIVE'
                );

                return (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className="hover:bg-brand-50/40 transition cursor-pointer"
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-brand-950">
                            {getMaskedName(customer.name)}
                          </div>
                          {customer.notes && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 font-mono text-brand-900">
                      {getMaskedPhone(customer.phone)}
                    </td>

                    {/* Last Visit */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-brand-950">{customer.lastVisitDate}</span>
                        {isChurn && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            {daysAgo} gün!
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Visits & Package Badge */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-brand-900">
                        {customer.totalVisits} ziyaret
                      </div>
                      {activePkg && (
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-md text-[10px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                          {activePkg.remainingSessions} Seans Paketi
                        </span>
                      )}
                    </td>

                    {/* Total Spent */}
                    <td className="px-5 py-3.5 font-bold font-serif text-brand-800">
                      {(customer.totalSpent || 0).toLocaleString('tr-TR')} ₺
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {isChurn && (
                          <button
                            onClick={() => handleSendRetentionWhatsApp(customer)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                            title="WhatsApp Geri Çağırma Mesajı At"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Geri Çağır</span>
                          </button>
                        )}
                        {isBday && (
                          <button
                            onClick={() => handleSendBirthdayWhatsApp(customer)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                            title="Doğum Günü Kutlama Mesajı At"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span>Kutla</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className="px-2 py-1 rounded-lg text-brand-800 bg-brand-50 hover:bg-brand-100 text-xs font-semibold transition cursor-pointer"
                        >
                          Geçmiş
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${customer.name} müşterisini silmek istediğinize emin misiniz?`)) {
                              deleteCustomer(customer.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Müşteriyi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-brand-400">
                    Arama kriterlerinize uygun müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL & PAST VISITS MODAL (MÜŞTERİ TALİMATI 5) */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const cust = customers.find((c) => c.id === selectedCustomerId);
              if (!cust) return null;
              const daysAgo = getDaysAgo(cust.lastVisitDate);
              const activePkg = customerPackages.find(
                (cp) => cp.customerId === cust.id && cp.status === 'ACTIVE'
              );

              // Bu müşteriye ait geçmiş tüm randevular & işlemler
              const customerAppointments = appointments
                .filter((a) => a.customerId === cust.id || (cust.phone && a.customerPhone === cust.phone))
                .sort((a, b) => b.date.localeCompare(a.date));

              return (
                <>
                  <div className="flex items-center justify-between border-b border-brand-100 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-brand-950 font-serif">
                        {getMaskedName(cust.name)}
                      </h3>
                      <p className="text-xs text-brand-700 font-mono mt-0.5">
                        {getMaskedPhone(cust.phone)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomerId(null)}
                      className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Summary Badges */}
                    <div className="grid grid-cols-3 gap-2.5 p-3 bg-brand-50/50 rounded-2xl border border-brand-100 text-brand-950">
                      <div>
                        <span className="text-brand-700 font-medium block">Toplam Ziyaret:</span>
                        <div className="font-bold text-sm mt-0.5">
                          {cust.totalVisits || customerAppointments.length} kez
                        </div>
                      </div>
                      <div>
                        <span className="text-brand-700 font-medium block">Toplam Harcama:</span>
                        <div className="font-bold font-serif text-brand-800 text-sm mt-0.5">
                          {(cust.totalSpent || 0).toLocaleString('tr-TR')} ₺
                        </div>
                      </div>
                      <div>
                        <span className="text-brand-700 font-medium block">Son Ziyaret:</span>
                        <div className="font-bold text-sm mt-0.5">
                          {cust.lastVisitDate} ({daysAgo} gün)
                        </div>
                      </div>
                    </div>

                    {/* Active Package */}
                    {activePkg && (
                      <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200">
                        <div className="font-bold text-brand-950">{activePkg.packageName}</div>
                        <div className="flex items-center justify-between text-[11px] text-brand-800 mt-1">
                          <span>Kalan Seans: <strong>{activePkg.remainingSessions} / {activePkg.totalSessions}</strong></span>
                          <span>Geçerlilik: {activePkg.expiryDate}</span>
                        </div>
                      </div>
                    )}

                    {/* Müşteri Notları */}
                    {cust.notes && (
                      <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-amber-950">
                        <label className="font-bold block mb-1">
                          💅 Tırnak & Bakım Notları / Alerji Durumu:
                        </label>
                        <p className="italic">{cust.notes}</p>
                      </div>
                    )}

                    {/* GEÇMİŞ ZİYARET VE ÖDEME GEÇMİŞİ LİSTESİ (MÜŞTERİ TALİMATI 5) */}
                    <div>
                      <h4 className="font-bold text-sm text-brand-950 font-serif mb-2 flex items-center justify-between">
                        <span>Ziyaret & İşlem Geçmişi</span>
                        <span className="text-xs font-normal text-brand-700">
                          {customerAppointments.length} Kayıt
                        </span>
                      </h4>

                      {customerAppointments.length === 0 ? (
                        <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-xs">
                          Bu müşteriye ait geçmiş randevu kaydı bulunamadı.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {customerAppointments.map((apt) => {
                            const srv = services.find((s) => s.id === apt.serviceId);
                            const staff = staffList.find((s) => s.id === apt.staffId);

                            return (
                              <div
                                key={apt.id}
                                className="p-3 rounded-xl border border-brand-100 bg-white hover:bg-brand-50/30 transition flex items-center justify-between"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-brand-950">{srv?.name || 'Özel Bakım'}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                      apt.status === 'COMPLETED'
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                        : 'bg-brand-50 text-brand-800'
                                    }`}>
                                      {apt.status === 'COMPLETED' ? 'Tamamlandı' : 'Onaylandı'}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-brand-700 flex items-center space-x-2">
                                    <span>Tarih: <strong>{apt.date}</strong> ({apt.startTime})</span>
                                    <span>•</span>
                                    <span>Uzman: <strong>{staff?.name || 'Salon'}</strong></span>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-bold font-serif text-brand-950 text-sm">
                                    {apt.price} ₺
                                  </div>
                                  <div className="text-[10px] font-semibold text-brand-700 mt-0.5">
                                    Ödeme: <span className="underline">{apt.paymentMethod === 'CASH' ? 'Nakit' : apt.paymentMethod === 'HAVALE' ? 'Havale' : apt.paymentMethod === 'PACKAGE' ? 'Paket Seansı' : 'Kredi Kartı'}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-brand-100">
                    <button
                      onClick={() => handleSendRetentionWhatsApp(cust)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp İle İletişim</span>
                    </button>
                    <button
                      onClick={() => setSelectedCustomerId(null)}
                      className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Kapat
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">Yeni Müşteri Kaydı</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-950 block mb-1">Müşteri Adı Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Yasemin Yıldız"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  placeholder="0532 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Doğum Tarihi</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Özel Tırnak / Bakım Notları</label>
                <textarea
                  rows={2}
                  placeholder="Örn: Hassas kütikül, badem form protez tercih ediyor..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 border border-brand-200 text-brand-800 rounded-xl font-bold cursor-pointer hover:bg-brand-50"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold rounded-xl shadow-md shadow-brand-900/10 cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
