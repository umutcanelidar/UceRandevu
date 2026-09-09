'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Tag,
  PlusCircle,
  Clock,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function AdminServicesPage() {
  const { currentUser, tenant, services, addService } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Protez Tırnak');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Yetkisiz Erişim</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Hizmet ve fiyat tanımlamaları yalnızca <strong>Salon Sahibi</strong> tarafından yönetilebilir.
        </p>
      </div>
    );
  }

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    addService({
      tenantId: tenant.id,
      name,
      category,
      durationMinutes: Number(durationMinutes) || 60,
      price: Number(price) || 0,
      description,
      isActive: true,
    });

    setShowAddModal(false);
    setName('');
    setPrice('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hizmetler & Fiyat Listesi</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {services.length} Aktif Hizmet
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Hizmet süreleri ve fiyatları randevu takviminde otomatik hesaplama için kullanılır.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yeni Hizmet Ekle</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase">
                  {srv.category}
                </span>
                <span className="text-base font-bold text-blue-700">
                  {srv.price.toLocaleString('tr-TR')} {tenant.currency}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{srv.name}</h3>

              {srv.description && (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Süre: <strong>{srv.durationMinutes} dk</strong></span>
              </div>

              <span className="inline-flex items-center space-x-1 text-emerald-600 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aktif</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Service */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Yeni Hizmet Tanımla</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hizmet Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Jel Protez Tırnak (Yeni Set)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  >
                    <option value="Protez Tırnak">Protez Tırnak</option>
                    <option value="Manikür">Manikür</option>
                    <option value="Pedikür">Pedikür</option>
                    <option value="Tasarım">Nail Art & Tasarım</option>
                    <option value="Bakım">Kaş & Kirpik Bakım</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Süre (Dakika)</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-semibold"
                  >
                    <option value="30">30 dakika</option>
                    <option value="45">45 dakika</option>
                    <option value="60">60 dakika (1 saat)</option>
                    <option value="75">75 dakika</option>
                    <option value="90">90 dakika (1.5 saat)</option>
                    <option value="120">120 dakika (2 saat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fiyat (₺) *</label>
                <input
                  type="number"
                  required
                  placeholder="750"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Açıklama (Opsiyonel)</label>
                <textarea
                  rows={2}
                  placeholder="Hizmet detayları ve kullanılan malzemeler..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Hizmeti Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
