'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Tag,
  PlusCircle,
  Clock,
  CheckCircle2,
  Lock,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';
import { Service } from '@/types';

export default function AdminServicesPage() {
  const { currentUser, tenant, services, addService, updateService, deleteService } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Protez Tırnak');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-100 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-950 font-serif">Yetkisiz Erişim</h2>
        <p className="text-xs text-brand-700 leading-relaxed">
          Hizmet ve fiyat tanımlamaları yalnızca <strong>BAGE Salon Sahibi</strong> tarafından yönetilebilir.
        </p>
      </div>
    );
  }

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    if (editingService) {
      updateService(editingService.id, {
        name,
        category,
        durationMinutes: Number(durationMinutes) || 60,
        price: Number(price) || 0,
        description,
      });
    } else {
      addService({
        tenantId: tenant.id,
        name,
        category,
        durationMinutes: Number(durationMinutes) || 60,
        price: Number(price) || 0,
        description,
        isActive: true,
      });
    }

    setShowAddModal(false);
    setEditingService(null);
    setName('');
    setPrice('');
    setDescription('');
  };

  const openNewModal = () => {
    setEditingService(null);
    setName('');
    setCategory('Protez Tırnak');
    setDurationMinutes('60');
    setPrice('');
    setDescription('');
    setShowAddModal(true);
  };

  const openEditModal = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setCategory(srv.category);
    setDurationMinutes(srv.durationMinutes.toString());
    setPrice(srv.price.toString());
    setDescription(srv.description || '');
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
              Hizmetler & Fiyat Listesi
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
              {services.length} Hizmet
            </span>
          </div>
          <p className="text-xs text-brand-700 mt-1">
            Hizmet ekleme, düzenleme ve silme yetkisi; randevu takviminde süre ve fiyatı belirler.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm shadow-brand-900/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-amber-200" />
          <span>Yeni Hizmet Ekle</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-brand-100 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-300 transition"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold tracking-wider text-brand-800 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md uppercase">
                  {srv.category}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-base font-bold font-serif text-brand-950">
                    {srv.price.toLocaleString('tr-TR')} {tenant.currency}
                  </span>
                  <button
                    onClick={() => openEditModal(srv)}
                    className="p-1 text-slate-400 hover:text-brand-800 ml-1.5 cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${srv.name}" hizmetini silmek istediğinize emin misiniz?`)) {
                        deleteService(srv.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-brand-950 text-sm font-serif">{srv.name}</h3>

              {srv.description && (
                <p className="text-xs text-brand-700/80 leading-relaxed line-clamp-2">
                  {srv.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-brand-900">
              <div className="flex items-center space-x-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-600" />
                <span>Uygulama: <strong>{srv.durationMinutes} dk</strong></span>
              </div>

              <span className="inline-flex items-center space-x-1 text-emerald-800 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Aktif</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Service (MÜŞTERİ TALİMATI 11) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h3 className="text-base font-bold text-brand-950 font-serif">
                {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Tanımla'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-950 mb-1">Hizmet Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Jel Protez Tırnak (Yeni Set)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium bg-white"
                  >
                    <option value="Protez Tırnak">Protez Tırnak</option>
                    <option value="Kalıcı Oje">Kalıcı Oje</option>
                    <option value="Manikür">Manikür</option>
                    <option value="Manikür/Pedikür">Manikür/Pedikür</option>
                    <option value="Kaş/Kirpik">Kaş/Kirpik</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-950 mb-1">Fiyat (TL) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">İşlem Süresi (Dakika) *</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium bg-white"
                >
                  <option value="30">30 Dakika</option>
                  <option value="45">45 Dakika</option>
                  <option value="60">60 Dakika (1 Saat)</option>
                  <option value="75">75 Dakika</option>
                  <option value="90">90 Dakika (1.5 Saat)</option>
                  <option value="120">120 Dakika (2 Saat)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">Hizmet Açıklaması</label>
                <textarea
                  rows={3}
                  placeholder="İşlem basamakları, kullanılan teknikler..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs"
                />
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
