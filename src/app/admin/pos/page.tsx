'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  Plus,
  CreditCard,
  User,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Sparkles,
  TrendingUp,
  Trash2,
  Edit2,
  Package,
} from 'lucide-react';
import { RetailProduct } from '@/types';

export default function PosPage() {
  const {
    retailProducts,
    productSales,
    staffList,
    customers,
    recordProductSale,
    addRetailProduct,
    updateRetailProduct,
    deleteRetailProduct,
    currentUser,
    getMaskedName,
  } = useApp();

  const isAdmin = currentUser.role === 'SPECIAL_ADMIN';

  const [selectedProductId, setSelectedProductId] = useState(retailProducts[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [staffId, setStaffId] = useState(staffList[0]?.id || '');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CREDIT_CARD');

  // Product CRUD Modal State (Müşteri Talimatı 7)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RetailProduct | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Tırnak Bakım',
    barcode: '',
    salePrice: 300,
    costPrice: 100,
    stockQuantity: 10,
    minStockThreshold: 3,
    unit: 'şişe',
  });

  const selectedProduct = retailProducts.find((p) => p.id === selectedProductId);
  const totalPrice = selectedProduct ? selectedProduct.salePrice * quantity : 0;

  const handleCompleteSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (selectedProduct.stockQuantity < quantity) {
      alert(`Yetersiz stok! Bu üründen yalnızca ${selectedProduct.stockQuantity} adet mevcuttur.`);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const customerObj = customers.find((c) => c.id === customerId);

    recordProductSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      unitPrice: selectedProduct.salePrice,
      totalPrice,
      staffId,
      customerId: customerObj?.id,
      customerName: customerObj?.name,
      paymentMethod,
      date: todayStr,
    });

    alert('Ürün satışı başarıyla gerçekleşti, stoktan düşüldü ve kasaya ciro olarak işlendi!');
    setQuantity(1);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name) return;

    if (editingProduct) {
      updateRetailProduct(editingProduct.id, {
        name: prodForm.name,
        category: prodForm.category,
        barcode: prodForm.barcode,
        salePrice: Number(prodForm.salePrice),
        costPrice: Number(prodForm.costPrice),
        stockQuantity: Number(prodForm.stockQuantity),
        minStockThreshold: Number(prodForm.minStockThreshold),
        unit: prodForm.unit,
      });
    } else {
      addRetailProduct({
        name: prodForm.name,
        category: prodForm.category,
        barcode: prodForm.barcode || `868000${Math.floor(1000 + Math.random() * 9000)}`,
        salePrice: Number(prodForm.salePrice),
        costPrice: Number(prodForm.costPrice),
        stockQuantity: Number(prodForm.stockQuantity),
        minStockThreshold: Number(prodForm.minStockThreshold),
        unit: prodForm.unit,
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'Tırnak Bakım',
      barcode: '',
      salePrice: 300,
      costPrice: 100,
      stockQuantity: 10,
      minStockThreshold: 3,
      unit: 'şişe',
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: RetailProduct) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      category: prod.category,
      barcode: prod.barcode || '',
      salePrice: prod.salePrice,
      costPrice: prod.costPrice,
      stockQuantity: prod.stockQuantity,
      minStockThreshold: prod.minStockThreshold,
      unit: prod.unit,
    });
    setIsProductModalOpen(true);
  };

  const totalSalesRevenue = productSales.reduce((acc, s) => acc + s.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
            Perakende Ürün Satışı & Mini POS
          </h1>
          <p className="text-xs text-brand-700 mt-1">
            Ürün ekleme/silme otomasyonu, hızlı barkodlu satış, stok düşüşü ve personel prim kaydı.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <button
              onClick={openNewProductModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-semibold rounded-xl border border-brand-200 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-brand-700" />
              <span>Yeni Ürün Ekle</span>
            </button>
          )}

          <div className="inline-flex items-center space-x-1.5 bg-brand-100/70 border border-brand-200 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-950">
            <TrendingUp className="w-4 h-4 text-brand-700" />
            <span>Ürün Cirosu: {totalSalesRevenue.toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Product Selector & Registration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Grid */}
          <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-brand-700 uppercase tracking-wider">
                1. Satılacak Ürünü Seçin ({retailProducts.length} Ürün)
              </h2>
              <span className="text-[11px] text-slate-400">Ürüne dokunarak sepete ekleyin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {retailProducts.map((product) => {
                const isSelected = selectedProductId === product.id;
                const isLowStock = product.stockQuantity <= product.minStockThreshold;

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? 'bg-brand-50/80 border-brand-700 ring-2 ring-brand-200 shadow-xs'
                        : 'bg-white border-brand-100 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 border border-brand-200">
                        {product.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-bold font-serif text-brand-950">{product.salePrice} ₺</span>
                        {isAdmin && (
                          <div className="flex items-center ml-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => openEditProductModal(product)}
                              className="p-1 text-slate-400 hover:text-brand-800"
                              title="Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${product.name}" ürününü silmek istediğinize emin misiniz?`)) {
                                  deleteRetailProduct(product.id);
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
                    </div>

                    <h3 className="font-bold text-brand-950 text-xs mt-2 line-clamp-1 font-serif">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <span className="text-slate-400">Kalan Stok:</span>
                      {isLowStock ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-bold border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>{product.stockQuantity} {product.unit} (Kritik)</span>
                        </span>
                      ) : (
                        <span className="font-bold text-brand-950">
                          {product.stockQuantity} {product.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales History Table */}
          <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-100 flex items-center justify-between bg-brand-50/30">
              <h3 className="text-xs font-bold text-brand-950 uppercase tracking-wider">
                Geçmiş Perakende Satış Fişleri
              </h3>
              <span className="text-[11px] font-semibold text-brand-700">
                {productSales.length} Satış
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-brand-950">
                <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase border-b border-brand-100">
                  <tr>
                    <th className="px-5 py-3">Tarih</th>
                    <th className="px-5 py-3">Ürün</th>
                    <th className="px-5 py-3">Müşteri</th>
                    <th className="px-5 py-3">Satan Personel</th>
                    <th className="px-5 py-3 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {productSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-brand-50/30 transition">
                      <td className="px-5 py-3 font-mono text-[11px] text-slate-500">{sale.date}</td>
                      <td className="px-5 py-3 font-bold text-brand-950">
                        {sale.productName} ({sale.quantity} adet)
                      </td>
                      <td className="px-5 py-3 text-brand-800">{sale.customerName || 'Genel Müşteri'}</td>
                      <td className="px-5 py-3 text-brand-700 font-medium">{sale.staffName}</td>
                      <td className="px-5 py-3 text-right font-bold font-serif text-brand-950">
                        {sale.totalPrice} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Sale Checkout Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-4 h-fit">
          <div className="flex items-center space-x-2 border-b border-brand-100 pb-3">
            <Receipt className="w-4 h-4 text-brand-700" />
            <h2 className="text-sm font-bold text-brand-950 font-serif">Satış İşlemi</h2>
          </div>

          <form onSubmit={handleCompleteSale} className="space-y-4 text-xs">
            {/* Selected Product Summary */}
            <div className="p-3.5 bg-brand-50/60 rounded-xl border border-brand-100 space-y-2">
              <span className="text-[10px] text-brand-700 font-bold uppercase tracking-wider block">
                Seçili Ürün
              </span>
              <div className="font-bold text-brand-950 text-sm">
                {selectedProduct?.name || 'Ürün seçilmedi'}
              </div>
              <div className="flex items-center justify-between text-xs text-brand-800">
                <span>Birim Fiyat: <strong>{selectedProduct?.salePrice} ₺</strong></span>
                <span>Stok: <strong>{selectedProduct?.stockQuantity} {selectedProduct?.unit}</strong></span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-bold text-brand-950 block mb-1">Adet</label>
              <input
                type="number"
                min={1}
                max={selectedProduct?.stockQuantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 font-bold text-sm bg-white"
              />
            </div>

            {/* Staff Selector */}
            <div>
              <label className="font-bold text-brand-950 block mb-1">Satışı Yapan Personel (Prim)</label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.staffCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Selector */}
            <div>
              <label className="font-bold text-brand-950 block mb-1">Müşteri (Opsiyonel)</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
              >
                <option value="">Genel Müşteri / Kayıtsız</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getMaskedName(c.name)} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="font-bold text-brand-950 block mb-1">Ödeme Yöntemi</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'CREDIT_CARD', label: 'Kart' },
                  { key: 'CASH', label: 'Nakit' },
                  { key: 'HAVALE', label: 'Havale' },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key as any)}
                    className={`py-2 rounded-xl border font-bold text-xs text-center transition cursor-pointer ${
                      paymentMethod === m.key
                        ? 'bg-brand-700 text-white border-brand-700 shadow-xs'
                        : 'bg-white text-brand-900 border-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Price Checkout */}
            <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 flex items-center justify-between">
              <span className="font-bold text-brand-950 text-sm">Toplam Tutar:</span>
              <span className="font-bold font-serif text-brand-950 text-xl">{totalPrice} ₺</span>
            </div>

            <button
              type="submit"
              disabled={!selectedProduct || selectedProduct.stockQuantity < 1}
              className="w-full py-3 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-900/10 transition cursor-pointer"
            >
              Satışı Tamamla & Fiş Kes
            </button>
          </form>
        </div>
      </div>

      {/* MODAL: YENİ ÜRÜN EKLE / DÜZENLE (MÜŞTERİ TALİMATI 7) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100"
          >
            <div className="flex items-center justify-between border-b border-brand-100 pb-3">
              <h3 className="text-base font-bold text-brand-950 font-serif">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Perakende Ürün Tanımla'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-brand-950 block mb-1">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: BAGE Doğal Kütikül Yağı (30ml)"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 text-brand-950 focus:outline-hidden focus:border-brand-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Kategori</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="Tırnak Bakım">Tırnak Bakım</option>
                    <option value="El/Ayak Kremi">El/Ayak Kremi</option>
                    <option value="Kozmetik">Kozmetik</option>
                    <option value="Serum">Serum</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Birim</label>
                  <select
                    value={prodForm.unit}
                    onChange={(e) => setProdForm({ ...prodForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 text-brand-950 bg-white"
                  >
                    <option value="şişe">şişe</option>
                    <option value="tüp">tüp</option>
                    <option value="adet">adet</option>
                    <option value="kutu">kutu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Satış Fiyatı (TL) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodForm.salePrice}
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Maliyet Fiyatı (TL)</label>
                  <input
                    type="number"
                    min={0}
                    value={prodForm.costPrice}
                    onChange={(e) => setProdForm({ ...prodForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Başlangıç Stoğu *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={prodForm.stockQuantity}
                    onChange={(e) => setProdForm({ ...prodForm, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-brand-950 block mb-1">Kritik Stok Eşiği</label>
                  <input
                    type="number"
                    min={1}
                    value={prodForm.minStockThreshold}
                    onChange={(e) => setProdForm({ ...prodForm, minStockThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-200 text-brand-950"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-brand-100">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
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
