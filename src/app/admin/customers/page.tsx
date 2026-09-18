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
} from 'lucide-react';

export default function CustomersPage() {
  const {
    customers,
    currentUser,
    getMaskedName,
    getMaskedPhone,
    addCustomer,
    customerPackages,
    staffList,
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
    const msg = `Merhaba ${customer.name}, BAGE Stüdyo'dan sevgiler! Son bakımınızın üzerinden 45 günden fazla zaman geçti. Tırnak sağlığınızı korumak ve tazelenmek için size özel bir randevu planlayalım mı?`;
    sendWhatsAppMessage(customer.phone, msg);
    alert(`WhatsApp mesajı gönderildi:\n"${msg}"`);
  };

  const handleSendBirthdayWhatsApp = (customer: any) => {
    const msg = `İyi ki doğdunuz ${customer.name}! 🎂 BAGE Stüdyo ailesi olarak yeni yaşınızı kutlarız. Bu ayki tüm tırnak ve bakım işlemlerinizde size özel %20 hediye indiriminiz hazır!`;
    sendWhatsAppMessage(customer.phone, msg);
    alert(`Doğum günü mesajı gönderildi:\n"${msg}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Müşteri Yönetimi & CRM
            </h1>
            {!isAdmin && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Lock className="w-3 h-3" />
                <span>Personel Maskelemesi Aktif</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Müşteri geçmişi, sadakat takibi, 45 gün gelmeyenler alarmı ve doğum günleri.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri Kaydet</span>
        </button>
      </div>

      {/* Staff Anti-Poaching Info Banner */}
      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start space-x-3 text-xs text-blue-800">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Müşteri Güvenlik ve Gizlilik Kalkanı</p>
            <p className="text-blue-700 mt-0.5 leading-relaxed">
              İşletme kuralları gereği, müşteri telefon numaraları ve soyisimleri personel ekranında maskelenmektedir. Tam iletişim bilgileri yalnızca salon sahibi tarafından görüntülenebilir.
            </p>
          </div>
        </div>
      )}

      {/* Retention & Churn Quick KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white border-blue-600 ring-2 ring-blue-100 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tüm Kayıtlı Müşteriler</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{customers.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">BAGE aktif müşteri portföyü</p>
        </button>

        <button
          onClick={() => setActiveTab('churn45')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'churn45'
              ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-100 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>45+ Gün Gelmeyenler</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded-full">
              Kritik
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{churnList.length}</div>
          <p className="text-[11px] text-rose-600/80 mt-1">Bakım zamanı geçmiş, geri çağrılmalı</p>
        </button>

        <button
          onClick={() => setActiveTab('birthday')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'birthday'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-100 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 flex items-center space-x-1">
              <Gift className="w-3.5 h-3.5" />
              <span>Bu Ay Doğum Günü Olanlar</span>
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">{birthdayList.length}</div>
          <p className="text-[11px] text-amber-600/80 mt-1">Kutlama mesajı & indirim hediyesi</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          placeholder="Müşteri adı, telefon veya tırnak notu ile ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm bg-transparent border-none outline-hidden text-slate-800 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Customers List & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {activeTab === 'all' && 'Tüm Müşteri Portföyü'}
              {activeTab === 'churn45' && '45+ Gündür Gelmeyen Müşteriler (Acil İletişim)'}
              {activeTab === 'birthday' && 'Bu Ay Doğum Günü Olan Müşteriler'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredCustomers.length} müşteri listeleniyor
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Müşteri Adı</th>
                <th className="px-5 py-3">Telefon</th>
                <th className="px-5 py-3">Son Ziyaret</th>
                <th className="px-5 py-3">Doğum Günü</th>
                <th className="px-5 py-3">Kapora Durumu</th>
                <th className="px-5 py-3">Toplam Ziyaret</th>
                <th className="px-5 py-3 text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => {
                const daysAgo = getDaysAgo(customer.lastVisitDate);
                const isChurn = daysAgo >= 45;
                const isBday = isBirthdaySoon(customer.birthDate);

                // Aktif seans paketi var mı?
                const activePkg = customerPackages.find(
                  (cp) => cp.customerId === customer.id && cp.status === 'ACTIVE'
                );

                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {getMaskedName(customer.name)}
                      </div>
                      {customer.notes && (
                        <p className="text-[11px] text-slate-400 truncate max-w-[220px] mt-0.5">
                          💅 {customer.notes}
                        </p>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {getMaskedPhone(customer.phone)}
                    </td>

                    {/* Last Visit & Days Ago Badge */}
                    <td className="px-5 py-3.5">
                      <div className="text-slate-800 font-medium">{customer.lastVisitDate}</div>
                      {isChurn ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-700 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{daysAgo} gün önce (Gecikmiş!)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {daysAgo === 0 ? 'Bugün' : `${daysAgo} gün önce`}
                        </span>
                      )}
                    </td>

                    {/* Birthday */}
                    <td className="px-5 py-3.5">
                      {customer.birthDate ? (
                        <div className="flex items-center space-x-1.5">
                          {isBday && <Gift className="w-3.5 h-3.5 text-amber-500" />}
                          <span className={isBday ? 'font-bold text-amber-700' : 'text-slate-600'}>
                            {customer.birthDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Deposit Status */}
                    <td className="px-5 py-3.5">
                      {customer.depositStatus === 'PAID' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Alındı ({customer.depositAmount} ₺)</span>
                        </span>
                      )}
                      {customer.depositStatus === 'WAITING' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>Kapora Bekliyor</span>
                        </span>
                      )}
                      {customer.depositStatus === 'NONE' && (
                        <span className="text-slate-400 text-[11px]">Yok</span>
                      )}
                    </td>

                    {/* Total Visits & Package Badge */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {customer.totalVisits} ziyaret
                      </div>
                      {activePkg && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {activePkg.remainingSessions} Seans Paketi Var
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Arama kriterlerinize uygun müşteri bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            {(() => {
              const cust = customers.find((c) => c.id === selectedCustomerId);
              if (!cust) return null;
              const daysAgo = getDaysAgo(cust.lastVisitDate);
              const activePkg = customerPackages.find(
                (cp) => cp.customerId === cust.id && cp.status === 'ACTIVE'
              );

              return (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {getMaskedName(cust.name)}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {getMaskedPhone(cust.phone)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomerId(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 font-medium">Toplam Ziyaret:</span>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">
                          {cust.totalVisits} kez
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Son Ziyaret:</span>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">
                          {cust.lastVisitDate} ({daysAgo} gün)
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Doğum Günü:</span>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">
                          {cust.birthDate || 'Belirtilmedi'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Kapora:</span>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">
                          {cust.depositStatus === 'PAID'
                            ? `${cust.depositAmount} ₺ Alındı`
                            : 'Alınmadı'}
                        </div>
                      </div>
                    </div>

                    {/* Active Package */}
                    {activePkg && (
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="font-bold text-purple-900">{activePkg.packageName}</div>
                        <div className="flex items-center justify-between text-[11px] text-purple-700 mt-1">
                          <span>Kalan Seans: {activePkg.remainingSessions} / {activePkg.totalSessions}</span>
                          <span>Bitiş: {activePkg.expiryDate}</span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        💅 Tırnak & Bakım Notları / Alerji Durumu:
                      </label>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        {cust.notes || 'Herhangi bir özel not eklenmemiş.'}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleSendRetentionWhatsApp(cust)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp İle Ulaş</span>
                    </button>
                    <button
                      onClick={() => setSelectedCustomerId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Yeni Müşteri Kaydı</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Ayşe Kaya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  placeholder="+90 532 000 00 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doğum Tarihi</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kapora Durumu</label>
                  <select
                    value={formData.depositStatus}
                    onChange={(e: any) => setFormData({ ...formData, depositStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                  >
                    <option value="NONE">Yok</option>
                    <option value="PAID">Alındı</option>
                    <option value="WAITING">Bekliyor</option>
                  </select>
                </div>
              </div>

              {formData.depositStatus === 'PAID' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kapora Tutarı (₺)</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={formData.depositAmount}
                    onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  💅 Tırnak / Cilt Özel Notları
                </label>
                <textarea
                  rows={2}
                  placeholder="Kare tırnak seviyor, monomere alerjisi var vb."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
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
