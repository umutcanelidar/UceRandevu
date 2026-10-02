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
  Trash2,
  Edit2,
} from 'lucide-react';
import { PackageDefinition } from '@/types';

export default function PackagesPage() {
  const {
    packages,
    customerPackages,
    customers,
    services,
    buyCustomerPackage,
    usePackageSession,
    addPackageDefinition,
    updatePackageDefinition,
    deletePackageDefinition,
    getMaskedName,
    currentUser,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [activeTab, setActiveTab] = useState<'customer_packages' | 'package_definitions'>('customer_packages');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isDefModalOpen, setIsDefModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<PackageDefinition | null>(null);

  // Form State for Selling Package
  const [sellForm, setSellForm] = useState({
    customerId: customers[0]?.id || '',
    packageId: packages[0]?.id || '',
    paymentMethod: 'CREDIT_CARD' as 'CASH' | 'CREDIT_CARD' | 'HAVALE',
  });

  // Form State for Package Definition CRUD (Müşteri Talimatı 6)
  const [defForm, setDefForm] = useState({
    name: '',
    category: 'Protez Tırnak',
    totalSessions: 5,
    price: 2000,
    serviceId: services[0]?.id || '',
    description: '',
    isActive: true,
  });

  const handleSellPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.customerId || !sellForm.packageId) return;

    buyCustomerPackage(sellForm.customerId, sellForm.packageId, sellForm.paymentMethod);
    setIsSellModalOpen(false);
    alert('Paket satışı başarıyla tamamlandı ve kasaya ciro olarak işlendi!');
  };

  const handleSavePackageDefinition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defForm.name) return;

    if (editingPkg) {
      updatePackageDefinition(editingPkg.id, {
        name: defForm.name,
        category: defForm.category,
        totalSessions: Number(defForm.totalSessions),
        price: Number(defForm.price),
        serviceId: defForm.serviceId,
        description: defForm.description,
        isActive: defForm.isActive,
      });
    } else {
      addPackageDefinition({
        name: defForm.name,
        category: defForm.category,
        totalSessions: Number(defForm.totalSessions),
        price: Number(defForm.price),
        serviceId: defForm.serviceId,
        description: defForm.description,
        isActive: defForm.isActive,
      });
    }

    setIsDefModalOpen(false);
    setEditingPkg(null);
  };

  const openEditModal = (pkg: PackageDefinition) => {
    setEditingPkg(pkg);
    setDefForm({
      name: pkg.name,
      category: pkg.category,
      totalSessions: pkg.totalSessions,
      price: pkg.price,
      serviceId: pkg.serviceId,
      description: pkg.description,
      isActive: pkg.isActive,
    });
    setIsDefModalOpen(true);
  };

  const openNewModal = () => {
    setEditingPkg(null);
    setDefForm({
      name: '',
      category: 'Protez Tırnak',
      totalSessions: 5,
      price: 2000,
      serviceId: services[0]?.id || '',
      description: '',
      isActive: true,
    });
    setIsDefModalOpen(true);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
            Paketler & Seans Yönetimi
          </h1>
          <p className="text-xs text-brand-700 mt-1">
            Paket ekleme/düzenleme/silme otomasyonu, seans takibi ve müşteri paket satışı.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <button
              onClick={openNewModal}
              className="inline-flex items-center justify-center space-x-1.5 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-xl border border-brand-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-700" />
              <span>Yeni Paket Tanımla</span>
            </button>

            <button
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-brand-900/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Müşteriye Paket Sat</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Aktif Müşteri Paketleri</span>
            <Layers className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950 mt-2">{activeCount}</div>
          <p className="text-[11px] text-brand-600 mt-1">Halen seansı devam eden müşteriler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Kalan Toplam Seanslar</span>
            <Sparkles className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-800 mt-2">
            {totalRemainingSessions} Seans
          </div>
          <p className="text-[11px] text-brand-700 mt-1">Müşterilerin bekleyen randevu hakları</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Tanımlı Salon Paketleri</span>
            <Tag className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950 mt-2">{packages.length} Paket</div>
          <p className="text-[11px] text-brand-600 mt-1">Katalogda satışa hazır paket modelleri</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-brand-100 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('customer_packages')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'customer_packages'
              ? 'border-brand-700 text-brand-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-brand-950'
          }`}
        >
          Satılan Müşteri Paketleri ({customerPackages.length})
        </button>
        <button
          onClick={() => setActiveTab('package_definitions')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'package_definitions'
              ? 'border-brand-700 text-brand-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-brand-950'
          }`}
        >
          Paket Tanımları & Fiyat Kataloğu ({packages.length})
        </button>
      </div>

      {/* Tab 1: Customer Packages Table */}
      {activeTab === 'customer_packages' && (
        <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-950">
              <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase tracking-wider border-b border-brand-100">
                <tr>
                  <th className="px-5 py-3">Müşteri</th>
                  <th className="px-5 py-3">Paket Adı</th>
                  <th className="px-5 py-3">Kalan / Toplam</th>
                  <th className="px-5 py-3">Satış Bedeli</th>
                  <th className="px-5 py-3">Geçerlilik</th>
                  <th className="px-5 py-3 text-right">Seans Düş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {customerPackages.map((cp) => {
                  const isCompleted = cp.remainingSessions === 0;

                  return (
                    <tr key={cp.id} className="hover:bg-brand-50/30 transition">
                      <td className="px-5 py-3.5 font-bold text-brand-950">
                        {getMaskedName(cp.customerName)}
                      </td>
                      <td className="px-5 py-3.5 text-brand-800 font-medium">{cp.packageName}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-brand-950">{cp.remainingSessions}</span>
                        <span className="text-slate-400"> / {cp.totalSessions} Seans</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold font-serif text-brand-950">{cp.purchasePrice} ₺</td>
                      <td className="px-5 py-3.5 text-brand-700">{cp.expiryDate}</td>
                      <td className="px-5 py-3.5 text-right">
                        {!isCompleted ? (
                          <button
                            onClick={() => handleDeductSession(cp.id, cp.packageName)}
                            className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-xl border border-brand-200 text-xs transition cursor-pointer"
                          >
                            -1 Seans Düş
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Bitti</span>
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

      {/* Tab 2: Package Definitions (CRUD - MÜŞTERİ TALİMATI 6) */}
      {activeTab === 'package_definitions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => {
            const relatedService = services.find((s) => s.id === pkg.serviceId);
            const singleTotal = relatedService ? relatedService.price * pkg.totalSessions : 0;
            const savings = singleTotal > pkg.price ? singleTotal - pkg.price : 0;

            return (
              <div
                key={pkg.id}
                className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
                      {pkg.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-bold text-brand-950 bg-brand-100 px-2 py-0.5 rounded-lg">
                        {pkg.totalSessions} Seans
                      </span>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => openEditModal(pkg)}
                            className="p-1 text-slate-400 hover:text-brand-800 transition cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${pkg.name}" paketini silmek istediğinize emin misiniz?`)) {
                                deletePackageDefinition(pkg.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <h3 className="font-bold text-brand-950 text-sm mt-3 font-serif">{pkg.name}</h3>
                  <p className="text-xs text-brand-700/80 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-3 border-t border-brand-100">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold font-serif text-brand-950">{pkg.price} ₺</span>
                      {singleTotal > 0 && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {singleTotal} ₺
                        </span>
                      )}
                    </div>
                    {savings > 0 && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {savings} ₺ Avantaj
                      </span>
                    )}
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setSellForm({ ...sellForm, packageId: pkg.id });
                        setIsSellModalOpen(true);
                      }}
                      className="w-full mt-3 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
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

      {/* Modal: Package Definition Add/Edit (MÜŞTERİ TALİMATI 6) */}
      {isDefModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePackageDefinition}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">
                {editingPkg ? 'Paketi Düzenle' : 'Yeni Paket Tanımla'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDefModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-950 block mb-1">Paket Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 5 Seans Kalıcı Oje Paketi"
                  value={defForm.name}
                  onChange={(e) => setDefForm({ ...defForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Kategori</label>
                  <select
                    value={defForm.category}
                    onChange={(e) => setDefForm({ ...defForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="Protez Tırnak">Protez Tırnak</option>
                    <option value="Kalıcı Oje">Kalıcı Oje</option>
                    <option value="Manikür">Manikür</option>
                    <option value="Manikür/Pedikür">Manikür/Pedikür</option>
                    <option value="Kaş/Kirpik">Kaş/Kirpik</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Seans Sayısı *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={defForm.totalSessions}
                    onChange={(e) => setDefForm({ ...defForm, totalSessions: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Paket Satış Fiyatı (TL) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={defForm.price}
                    onChange={(e) => setDefForm({ ...defForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">İlişkili Hizmet</label>
                  <select
                    value={defForm.serviceId}
                    onChange={(e) => setDefForm({ ...defForm, serviceId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-950 block mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  placeholder="Paket içeriği ve koşulları..."
                  value={defForm.description}
                  onChange={(e) => setDefForm({ ...defForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsDefModalOpen(false)}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Sell Package */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSellPackage}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">Müşteriye Paket Satışı</h3>
              <button
                type="button"
                onClick={() => setIsSellModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-brand-950 block mb-1">Müşteri Seçin *</label>
                <select
                  value={sellForm.customerId}
                  onChange={(e) => setSellForm({ ...sellForm, customerId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getMaskedName(c.name)} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-brand-950 block mb-1">Satılacak Paket *</label>
                <select
                  value={sellForm.packageId}
                  onChange={(e) => setSellForm({ ...sellForm, packageId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                >
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.price} ₺ ({p.totalSessions} Seans)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-brand-950 block mb-1">Ödeme Yöntemi *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'CREDIT_CARD', label: 'Kredi Kartı' },
                    { key: 'CASH', label: 'Nakit' },
                    { key: 'HAVALE', label: 'Havale/FAST' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setSellForm({ ...sellForm, paymentMethod: m.key as any })}
                      className={`py-2 rounded-xl border font-bold text-center transition cursor-pointer ${
                        sellForm.paymentMethod === m.key
                          ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                          : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsSellModalOpen(false)}
                className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
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
