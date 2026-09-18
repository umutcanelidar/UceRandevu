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
} from 'lucide-react';

export default function PosPage() {
  const {
    retailProducts,
    productSales,
    staffList,
    customers,
    recordProductSale,
    currentUser,
    getMaskedName,
  } = useApp();

  const [selectedProductId, setSelectedProductId] = useState(retailProducts[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [staffId, setStaffId] = useState(staffList[0]?.id || '');
  const [customerId, setCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CREDIT_CARD');

  const selectedProduct = retailProducts.find((p) => p.id === selectedProductId);

  // Total calculated price
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

    alert('Ürün satışı başarıyla gerçekleşti, stok düşüldü ve personele prim olarak işlendi!');
    setQuantity(1);
  };

  // Toplam perakende ciro
  const totalSalesRevenue = productSales.reduce((acc, s) => acc + s.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Perakende Satış & Ürün Kasası (POS)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tırnak bakım yağı, el kremi, serum satışı ve personel prim takibi.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700">
          <TrendingUp className="w-4 h-4" />
          <span>Toplam Ürün Cirosu: {totalSalesRevenue} ₺</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Product Selector & Registration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              1. Satılacak Ürünü Seçin
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {retailProducts.map((product) => {
                const isSelected = selectedProductId === product.id;
                const isLowStock = product.stockQuantity <= product.minStockThreshold;

                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    className={`p-4 rounded-xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-600 ring-2 ring-blue-100 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {product.category}
                      </span>
                      <span className="text-sm font-black text-slate-900">{product.salePrice} ₺</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-xs mt-2 line-clamp-1">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-[11px]">
                      <span className="text-slate-400">Kalan Stok:</span>
                      {isLowStock ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-extrabold border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{product.stockQuantity} {product.unit} (Kritik!)</span>
                        </span>
                      ) : (
                        <span className="font-bold text-slate-700">
                          {product.stockQuantity} {product.unit}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sales History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Geçmiş Perakende Satışlar
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {productSales.length} işlem kaydedildi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Ürün</th>
                    <th className="px-5 py-3">Adet</th>
                    <th className="px-5 py-3">Tutar</th>
                    <th className="px-5 py-3">Satan Uzman (Prim)</th>
                    <th className="px-5 py-3">Ödeme</th>
                    <th className="px-5 py-3">Tarih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3 font-bold text-slate-900">{sale.productName}</td>
                      <td className="px-5 py-3 font-semibold text-slate-800">{sale.quantity} adet</td>
                      <td className="px-5 py-3 font-black text-slate-900">{sale.totalPrice} ₺</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <User className="w-3 h-3" />
                          <span>{sale.staffName}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {sale.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : sale.paymentMethod === 'CASH' ? 'Nakit' : 'Havale'}
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-mono text-[11px]">
                        {sale.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Checkout Terminal Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5 h-fit sticky top-20">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Hızlı Satış Fişi</h2>
          </div>

          <form onSubmit={handleCompleteSale} className="space-y-4 text-xs">
            {/* Selected Product Summary */}
            {selectedProduct ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">{selectedProduct.name}</div>
                <div className="text-slate-500 flex justify-between">
                  <span>Birim Fiyat:</span>
                  <span className="font-bold text-slate-700">{selectedProduct.salePrice} ₺</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Lütfen soldan bir ürün seçin.</p>
            )}

            {/* Quantity */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adet</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.stockQuantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-16 text-center py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-sm flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Staff Attribution for Commission */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Satan Uzman (Prim Yazılacak) *
              </label>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
              >
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer (Optional) */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Müşteri (Opsiyonel)</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-slate-800 bg-white"
              >
                <option value="">-- Ayaktan / Anonim Satış --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getMaskedName(c.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ödeme Şekli</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'CREDIT_CARD', label: 'Kart' },
                  { key: 'CASH', label: 'Nakit' },
                  { key: 'HAVALE', label: 'Havale' },
                ].map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setPaymentMethod(m.key as any)}
                    className={`py-1.5 rounded-lg border font-bold text-center transition text-[11px] cursor-pointer ${
                      paymentMethod === m.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Display & Submit */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Tahsil Edilecek:</span>
                <span className="text-xl font-black text-slate-900">{totalPrice} ₺</span>
              </div>

              <button
                type="submit"
                disabled={!selectedProduct || selectedProduct.stockQuantity < 1}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Satışı Tamamla & Fiş Kes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
