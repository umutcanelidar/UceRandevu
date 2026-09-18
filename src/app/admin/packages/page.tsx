'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Layers,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  User,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function PackagesPage() {
  const {
    packages,
    customerPackages,
    customers,
    services,
    buyCustomerPackage,
    usePackageSession,
    getMaskedName,
    currentUser,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [activeTab, setActiveTab] = useState<'customer_packages' | 'package_definitions'>('customer_packages');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Form State for Selling Package to Customer
  const [sellForm, setSellForm] = useState({
    customerId: customers[0]?.id || '',
    packageId: packages[0]?.id || '',
    paymentMethod: 'CREDIT_CARD' as 'CASH' | 'CREDIT_CARD' | 'HAVALE',
  });

  const handleSellPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.customerId || !sellForm.packageId) return;

    buyCustomerPackage(sellForm.customerId, sellForm.packageId, sellForm.paymentMethod);
    setIsSellModalOpen(false);
    alert('Paket satışı başarıyla tamamlandı ve kasaya ciro olarak işlendi!');
  };

  const handleDeductSession = (custPkgId: string, pkgName: string) => {
    if (confirm(`"${pkgName}" paketinden 1 seans düşmek istediğinize emin misiniz?`)) {
      usePackageSession(custPkgId);
    }
  };

  const activeCount = customerPackages.filter((cp) => cp.status === 'ACTIVE').length;
  const totalRemainingSessions = customerPackages
    .filter((cp) => cp.status === 'ACTIVE')
    .reduce((sum, cp) => sum + cp.remainingSessions, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Paketler & Seans Yönetimi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Çoklu seans paketleri satışı, seans hakkı düşme ve müşteri paket bakiyeleri.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsSellModalOpen(true)}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Müşteriye Paket Sat</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Aktif Müşteri Paketleri</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Halen seansı devam eden müşteriler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Kalan Toplam Seanslar</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {totalRemainingSessions} Seans
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Müşterilerin bekleyen randevu hakları</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tanımlı Salon Paketleri</span>
            <Tag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2">{packages.length} Paket</div>
          <p className="text-[11px] text-blue-600/80 mt-1">Katalogda satışa hazır paketler</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('customer_packages')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'customer_packages'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Satılan Paketler & Kalan Seans Takibi ({customerPackages.length})
        </button>
        <button
          onClick={() => setActiveTab('package_definitions')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'package_definitions'
              ? 'border-blue-600 text-blue-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Salon Paket Kataloğu ({packages.length})
        </button>
      </div>

      {/* Tab 1: Customer Packages Table */}
      {activeTab === 'customer_packages' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Müşteri</th>
                  <th className="px-5 py-3">Paket Adı</th>
                  <th className="px-5 py-3">Kalan / Toplam Seans</th>
                  <th className="px-5 py-3">Satın Alma Tarihi</th>
                  <th className="px-5 py-3">Son Geçerlilik</th>
                  <th className="px-5 py-3">Durum</th>
                  <th className="px-5 py-3 text-right">Seans İşlemi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerPackages.map((cp) => {
                  const percentLeft = Math.round((cp.remainingSessions / cp.totalSessions) * 100);
                  const isCompleted = cp.remainingSessions === 0;

                  return (
                    <tr key={cp.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {getMaskedName(cp.customerName)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{cp.packageName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {cp.purchasePrice} ₺ ödendi
                        </div>
                      </td>
                      <td className="px-5 py-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className={isCompleted ? 'text-slate-400' : 'text-purple-700'}>
                            {cp.remainingSessions} / {cp.totalSessions} Seans
                          </span>
                          <span className="text-[10px] text-slate-400">%{percentLeft}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-slate-300' : 'bg-purple-600'
                            }`}
                            style={{ width: `${percentLeft}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{cp.purchaseDate}</td>
                      <td className="px-5 py-4 text-slate-600">{cp.expiryDate}</td>
                      <td className="px-5 py-4">
                        {cp.status === 'ACTIVE' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Aktif</span>
                          </span>
                        )}
                        {cp.status === 'COMPLETED' && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            <span>Tamamlandı</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {cp.status === 'ACTIVE' && cp.remainingSessions > 0 ? (
                          <button
                            onClick={() => handleDeductSession(cp.id, cp.packageName)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>1 Seans Düş</span>
                          </button>
                        ) : (
                          <span className="text-slate-300 text-xs">Hakkı Bitti</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Package Definitions */}
      {activeTab === 'package_definitions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const relatedService = services.find((s) => s.id === pkg.serviceId);
            const singleTotal = relatedService ? relatedService.price * pkg.totalSessions : 0;
            const savings = singleTotal > pkg.price ? singleTotal - pkg.price : 0;

            return (
              <div
                key={pkg.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {pkg.category}
                    </span>
                    <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg">
                      {pkg.totalSessions} Seans
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-3">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900">{pkg.price} ₺</span>
                      {singleTotal > 0 && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {singleTotal} ₺
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {savings} ₺ Kazanç
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setSellForm({ ...sellForm, packageId: pkg.id });
                        setIsSellModalOpen(true);
                      }}
                      className="w-full mt-3 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Müşteriye Sat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Sell Package */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSellPackage}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Müşteriye Paket Satışı</h3>
              <button
                type="button"
                onClick={() => setIsSellModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Müşteri Seçin *</label>
                <select
                  value={sellForm.customerId}
                  onChange={(e) => setSellForm({ ...sellForm, customerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getMaskedName(c.name)} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Satılacak Paket *</label>
                <select
                  value={sellForm.packageId}
                  onChange={(e) => setSellForm({ ...sellForm, packageId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.price} ₺ ({p.totalSessions} Seans)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ödeme Yöntemi *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'CREDIT_CARD', label: 'Kredi Kartı' },
                    { key: 'CASH', label: 'Nakit' },
                    { key: 'HAVALE', label: 'Havale/EFT' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSellForm({ ...sellForm, paymentMethod: m.key as any })}
                      className={`py-2 rounded-xl border font-bold text-center transition cursor-pointer ${
                        sellForm.paymentMethod === m.key
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSellModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                Satışı Onayla & Kasaya Ekle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
