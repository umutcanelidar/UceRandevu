'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  Lock,
  Filter,
} from 'lucide-react';

export default function AdminFinancePage() {
  const { currentUser, tenant, transactions, addTransaction } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  // Form State
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState('Hizmet Ödemesi');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CASH');
  const [description, setDescription] = useState('');

  // Access check for special admin
  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Erişim Yetkisi Yok</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Kasa, ciro ve gelir-gider kayıtları yalnızca <strong>Salon Sahibi</strong> tarafından görüntülenebilir.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const cashIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'CASH')
    .reduce((sum, t) => sum + t.amount, 0);

  const cardIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'CREDIT_CARD')
    .reduce((sum, t) => sum + t.amount, 0);

  const havaleIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'HAVALE')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      tenantId: tenant.id,
      type,
      category,
      amount: Number(amount),
      paymentMethod,
      description: description || (type === 'INCOME' ? 'Elden Giriş' : 'Genel Gider'),
      date: todayStr,
    });

    setShowModal(false);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kasa & Gelir-Gider Defteri</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            İşletmenizin anlık kasa durumu, ciro ve harcama dengesi
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gelir / Gider Ekle</span>
        </button>
      </div>

      {/* Main KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Bugünkü Ciro (Toplam Gelir)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {totalIncome.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold">Randevu ve ürün satışları dahil</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Toplam Gider (Harcamalar)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {totalExpense.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-rose-600 font-semibold">Malzeme, kira ve ikram giderleri</p>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net Kasa Bakiyesi</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {netBalance.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">Gelirler eksi giderler</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Eldeki Nakit Kasa</span>
            <p className="text-base font-bold text-slate-900">{cashIncome.toLocaleString('tr-TR')} {tenant.currency}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Kredi Kartı / POS</span>
            <p className="text-base font-bold text-slate-900">{cardIncome.toLocaleString('tr-TR')} {tenant.currency}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Havale / FAST</span>
            <p className="text-base font-bold text-slate-900">{havaleIncome.toLocaleString('tr-TR')} {tenant.currency}</p>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Kasa İşlem Geçmişi</h3>
            <p className="text-xs text-slate-500">Bugüne ait tüm tahsilat ve harcama kayıtları</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                filterType === 'INCOME' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                filterType === 'EXPENSE' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Giderler
            </button>
          </div>
        </div>

        {/* Mobile View: Transaction Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredTransactions.map((txn) => {
            const isIncome = txn.type === 'INCOME';
            return (
              <div key={txn.id} className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-900">{txn.description}</span>
                  <span className={`font-bold text-xs ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isIncome ? '+' : '-'}{txn.amount.toLocaleString('tr-TR')} {tenant.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[10px]">
                    {txn.category} • {txn.paymentMethod === 'CASH' ? 'Nakit' : txn.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">{txn.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4">Tarih / Saat</th>
                <th className="py-3 px-4">Açıklama</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Ödeme Türü</th>
                <th className="py-3 px-4 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map((txn) => {
                const isIncome = txn.type === 'INCOME';

                return (
                  <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {txn.createdAt}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {txn.description}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {txn.paymentMethod === 'CASH' ? 'Nakit' : txn.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı / POS' : 'Havale / EFT'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-sm">
                      <span className={isIncome ? 'text-emerald-600' : 'text-rose-600'}>
                        {isIncome ? '+' : '-'}{txn.amount.toLocaleString('tr-TR')} {tenant.currency}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Kasa İşlemi Ekle</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType('INCOME');
                    setCategory('Hizmet Ödemesi');
                  }}
                  className={`py-2 rounded-lg font-bold transition text-xs ${
                    type === 'INCOME' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  + Gelir (Tahsilat)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('EXPENSE');
                    setCategory('Malzeme Alımı');
                  }}
                  className={`py-2 rounded-lg font-bold transition text-xs ${
                    type === 'EXPENSE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  - Gider (Ödeme)
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tutar (₺) *</label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 font-bold text-sm"
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
                    {type === 'INCOME' ? (
                      <>
                        <option value="Hizmet Ödemesi">Hizmet Ödemesi</option>
                        <option value="Ürün Satışı">Ürün Satışı</option>
                        <option value="Diğer Gelir">Diğer Gelir</option>
                      </>
                    ) : (
                      <>
                        <option value="Malzeme Alımı">Malzeme Alımı</option>
                        <option value="Kira & Fatura">Kira & Fatura</option>
                        <option value="Mutfak & İkram">Mutfak & İkram</option>
                        <option value="Personel Avans">Personel Avans</option>
                        <option value="Diğer Gider">Diğer Gider</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ödeme Yöntemi</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs font-medium"
                  >
                    <option value="CASH">Nakit</option>
                    <option value="CREDIT_CARD">Kredi Kartı / POS</option>
                    <option value="HAVALE">Havale / FAST</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="Örn: Oje ve solüsyon alımı..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Kasaya İşle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
