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
} from 'lucide-react';

export default function InventoryPage() {
  const { inventoryItems, updateInventoryStock, currentUser } = useApp();
  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories
  const categories = ['all', 'Jel Grubu', 'Kalıcı Oje', 'Sarf & Hijyen', 'Alet & Uç'];

  const filteredItems = inventoryItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const criticalItems = inventoryItems.filter((item) => item.quantity <= item.minThreshold);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Malzeme Stokları & Salon Envanteri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jel, oje, aseton, eldiven ve sarf malzemelerinin kritik stok takibi.
          </p>
        </div>

        {criticalItems.length > 0 && (
          <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>{criticalItems.length} malzeme kritik seviyenin altında!</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Takip Edilen Malzeme</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{inventoryItems.length} Kalem</div>
          <p className="text-[11px] text-slate-400 mt-1">Salon içi aktif sarf listesi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Kritik Stok Uyarısı</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-rose-600 text-white rounded-full">
              Sipariş Geç
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{criticalItems.length} Kalem</div>
          <p className="text-[11px] text-rose-600/80 mt-1">Tükenmek üzere olan malzemeler</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Yeterli Stok Durumu</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">
            {inventoryItems.length - criticalItems.length} Kalem
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1">Güvenli eşikte olan malzemeler</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Malzeme adı ile ara (örn: jel, aseton, eldiven)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none outline-hidden text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tüm Kategoriler' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Malzeme Adı</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3">Mevcut Miktar</th>
                <th className="px-5 py-3">Kritik Eşik</th>
                <th className="px-5 py-3">Stok Durumu</th>
                <th className="px-5 py-3">Son Tedarik</th>
                <th className="px-5 py-3 text-right">Hızlı Stok Sayımı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const isCritical = item.quantity <= item.minThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-900 text-sm">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-5 py-3.5">
                      {isCritical ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Kritik Stok!</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Yeterli</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                      {item.lastRestockedAt}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateInventoryStock(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 0}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                          title="1 Azalt"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-slate-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateInventoryStock(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 cursor-pointer"
                          title="1 Artır"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    Arama kriterine uygun malzeme bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
