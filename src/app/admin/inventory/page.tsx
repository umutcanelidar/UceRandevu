'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Boxes,
  AlertTriangle,
  Plus,
  Minus,
  CheckCircle2,
  Search,
  RotateCcw,
  Sparkles,
  Trash2,
  Edit2,
  PackageCheck,
} from 'lucide-react';
import { InventoryItem } from '@/types';

export default function InventoryPage() {
  const {
    inventoryItems,
    updateInventoryStock,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    currentUser,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State for Inventory CRUD (Müşteri Talimatı 8)
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Jel Grubu',
    quantity: 5,
    unit: 'şişe',
    minThreshold: 3,
  });

  // Categories
  const categories = ['all', 'Jel Grubu', 'Kalıcı Oje', 'Sarf & Hijyen', 'Alet & Uç'];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const criticalItems = inventoryItems.filter((item) => item.quantity <= item.minThreshold);

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name) return;

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        name: itemForm.name,
        category: itemForm.category,
        quantity: Number(itemForm.quantity),
        unit: itemForm.unit,
        minThreshold: Number(itemForm.minThreshold),
      });
    } else {
      addInventoryItem({
        name: itemForm.name,
        category: itemForm.category,
        quantity: Number(itemForm.quantity),
        unit: itemForm.unit,
        minThreshold: Number(itemForm.minThreshold),
        lastRestockedAt: new Date().toISOString().split('T')[0],
      });
    }

    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const openNewItemModal = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category: 'Jel Grubu',
      quantity: 5,
      unit: 'şişe',
      minThreshold: 3,
    });
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minThreshold: item.minThreshold,
    });
    setIsItemModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
            Malzeme Stokları & Salon Envanteri
          </h1>
          <p className="text-xs text-brand-700 mt-1">
            Jel, oje, aseton, eldiven, freze uçları ve sarf malzemelerinin kritik stok otomasyonu.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {criticalItems.length > 0 && (
            <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>{criticalItems.length} malzeme kritik seviyenin altında!</span>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={openNewItemModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl shadow-sm shadow-brand-900/10 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-200" />
              <span>Yeni Malzeme Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-700">Takip Edilen Malzemeler</span>
            <Boxes className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950 mt-2">{inventoryItems.length} Kalem</div>
          <p className="text-[11px] text-brand-600 mt-1">Salon içi aktif sarf listesi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Kritik Stok Uyarısı</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-600 text-white rounded-full">
              Sipariş Geç
            </span>
          </div>
          <div className="text-2xl font-bold font-serif text-rose-900 mt-2">{criticalItems.length} Kalem</div>
          <p className="text-[11px] text-rose-700 mt-1">Tükenmek üzere olan sarf ürünler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Yeterli Stok Durumu</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-2">
            {inventoryItems.length - criticalItems.length} Kalem
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">Güvenli eşikte olan malzemeler</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-white p-2.5 rounded-xl border border-brand-200 flex items-center space-x-2">
          <Search className="w-4 h-4 text-brand-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Malzeme adı ile ara (örn: jel, aseton, eldiven)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none outline-hidden text-brand-950 placeholder-brand-400"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'bg-white text-brand-900 hover:bg-brand-50 border border-brand-200'
              }`}
            >
              {cat === 'all' ? 'Tüm Kategoriler' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isCritical = item.quantity <= item.minThreshold;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between space-y-3 transition ${
                isCritical ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : 'border-brand-100 hover:border-brand-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
                    {item.category}
                  </span>
                  {isCritical && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Kritik Eşik ({item.minThreshold})</span>
                    </span>
                  )}
                  {isAdmin && (
                    <div className="flex items-center space-x-1 ml-auto">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1 text-slate-400 hover:text-brand-800"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`"${item.name}" malzemesini silmek istediğinize emin misiniz?`)) {
                            deleteInventoryItem(item.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-sm text-brand-950 font-serif line-clamp-1">{item.name}</h3>
                <p className="text-[11px] text-slate-400">Son İkmal: {item.lastRestockedAt || 'Yakın Tarihte'}</p>
              </div>

              {/* Quantity Controls */}
              <div className="pt-2 border-t border-brand-100 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold font-serif text-brand-950">{item.quantity}</span>
                  <span className="text-xs text-brand-700 ml-1 font-medium">{item.unit}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => updateInventoryStock(item.id, Math.max(0, item.quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold flex items-center justify-center transition border border-brand-200 cursor-pointer"
                    title="1 Azalt"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => updateInventoryStock(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold flex items-center justify-center transition shadow-xs cursor-pointer"
                    title="1 Arttır"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: YENİ MALZEME EKLE / DÜZENLE (MÜŞTERİ TALİMATI 8) */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItem}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">
                {editingItem ? 'Malzemeyi Düzenle' : 'Yeni Sarf Malzeme Tanımla'}
              </h3>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-950 block mb-1">Malzeme Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Rubber Base Coat Şeffaf (15ml)"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Kategori</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="Jel Grubu">Jel Grubu</option>
                    <option value="Kalıcı Oje">Kalıcı Oje</option>
                    <option value="Sarf & Hijyen">Sarf & Hijyen</option>
                    <option value="Alet & Uç">Alet & Uç</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Birim</label>
                  <select
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="şişe">şişe</option>
                    <option value="adet">adet</option>
                    <option value="kutu">kutu</option>
                    <option value="bidon">bidon</option>
                    <option value="paket">paket</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Mevcut Stok Miktarı *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Kritik Alarm Eşiği *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={itemForm.minThreshold}
                    onChange={(e) => setItemForm({ ...itemForm, minThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
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
    </div>
  );
}
