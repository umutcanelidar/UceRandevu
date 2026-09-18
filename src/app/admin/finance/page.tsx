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
  Target,
  TrendingUp,
  Users,
  PieChart,
  Tag,
} from 'lucide-react';

export default function AdminFinancePage() {
  const { currentUser, tenant, transactions, appointments, staffList, addTransaction } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  // Form State
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState('Hizmet Ödemesi');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CASH');
  const [staffId, setStaffId] = useState('');
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

  // Revenue & Expense Stats
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  // Today stats
  const todayIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.date === todayStr)
    .reduce((sum, t) => sum + t.amount, 0);

  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayExpectedRevenue = todayAppointments.reduce((sum, a) => sum + a.price, 0);

  // Targets
  const dailyTarget = tenant.dailyTarget || 7500;
  const monthlyTarget = tenant.monthlyTarget || 180000;
  const dailyTargetPercent = Math.min(100, Math.round((todayIncome / dailyTarget) * 100));
  const monthlyTargetPercent = Math.min(100, Math.round((totalIncome / monthlyTarget) * 100));

  // Payment Breakdown
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
      type,
      category,
      amount: Number(amount),
      paymentMethod,
      description: description || (type === 'INCOME' ? 'Tahsilat' : 'Gider Ödemesi'),
      staffId: staffId || undefined,
      date: todayStr,
    });

    setShowModal(false);
    setAmount('');
    setDescription('');
    setStaffId('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kasa, Ciro & Finans Defteri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            BAGE Stüdyo anlık ciro, hedef gerçekleşme, giderler ve net kâr dökümü.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gelir / Gider Ekle</span>
        </button>
      </div>

      {/* Target Progress & Expected Revenue Dual Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Target Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Günlük Ciro Hedefi
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-lg font-black text-slate-900">{todayIncome} ₺</span>
                  <span className="text-xs text-slate-400">/ Hedef: {dailyTarget} ₺</span>
                </div>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              %{dailyTargetPercent}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${dailyTargetPercent}%` }}
            />
          </div>
        </div>

        {/* Expected vs Realized Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bugünkü Beklenen Ciro
                </span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-lg font-black text-purple-700">{todayExpectedRevenue} ₺</span>
                  <span className="text-xs text-slate-400">({todayAppointments.length} randevu)</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
              Potansiyel
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Kayıtlı randevuların tamamı tamamlandığında kasaya girecek tahmini tutardır.
          </p>
        </div>
      </div>

      {/* Main KPI Stats (Income, Expense, Net Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Toplam Ciro (Tüm Gelirler)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">
            {totalIncome.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">Randevu, paket ve ürün satışları</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Toplam Giderler</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600">
            {totalExpense.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-rose-600/80 font-bold">Kira, sarf malzeme, fatura ve ikram</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Net Kalan Tutar (Net Kâr)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black ${netBalance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
            {netBalance.toLocaleString('tr-TR')} {tenant.currency}
          </p>
          <p className="text-[11px] text-slate-500 font-bold">Gelirler eksi tüm işletme giderleri</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Eldeki Nakit Kasa</span>
            <p className="text-base font-black text-slate-900">
              {cashIncome.toLocaleString('tr-TR')} {tenant.currency}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Kredi Kartı / POS Tahsilatı</span>
            <p className="text-base font-black text-slate-900">
              {cardIncome.toLocaleString('tr-TR')} {tenant.currency}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Havale / FAST & Kapora</span>
            <p className="text-base font-black text-slate-900">
              {havaleIncome.toLocaleString('tr-TR')} {tenant.currency}
            </p>
          </div>
        </div>
      </div>

      {/* Staff Revenue Contribution Table (Personel Bazlı Ciro Dağılımı) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Personel Bazlı Ciro & Prim Dağılımı
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Uzmanların kasaya katkısı</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Uzman Adı</th>
                <th className="px-5 py-3">Ünvan</th>
                <th className="px-5 py-3">Prim Oranı</th>
                <th className="px-5 py-3">Bugünkü Ciro</th>
                <th className="px-5 py-3">Toplam Üretilen Ciro</th>
                <th className="px-5 py-3 text-right">Tahmini Prim Hakedişi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffList.map((staff) => {
                // Today staff revenue
                const todayStaffRevenue = transactions
                  .filter((t) => t.type === 'INCOME' && t.staffId === staff.id && t.date === todayStr)
                  .reduce((sum, t) => sum + t.amount, 0);

                // Total staff revenue
                const totalStaffRevenue = transactions
                  .filter((t) => t.type === 'INCOME' && t.staffId === staff.id)
                  .reduce((sum, t) => sum + t.amount, 0);

                const estimatedCommission = Math.round((totalStaffRevenue * staff.commissionRate) / 100);

                return (
                  <tr key={staff.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${staff.avatarColor}`} />
                        <span className="font-bold text-slate-900">{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{staff.title}</td>
                    <td className="px-5 py-3.5 font-bold text-purple-700">%{staff.commissionRate}</td>
                    <td className="px-5 py-3.5 font-black text-slate-900">{todayStaffRevenue} ₺</td>
                    <td className="px-5 py-3.5 font-black text-blue-700">{totalStaffRevenue} ₺</td>
                    <td className="px-5 py-3.5 text-right font-black text-emerald-600 text-sm">
                      {estimatedCommission} ₺
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kasa İşlem Geçmişi & Fişler
            </h3>
            <p className="text-[11px] text-slate-500">Tüm tahsilat, harcama ve gider kayıtları</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'INCOME'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                filterType === 'EXPENSE'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Giderler
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-5">Tarih / Saat</th>
                <th className="py-3 px-5">Açıklama</th>
                <th className="py-3 px-5">Kategori</th>
                <th className="py-3 px-5">Ödeme Türü</th>
                <th className="py-3 px-5 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTransactions.map((txn) => {
                const isIncome = txn.type === 'INCOME';

                return (
                  <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {txn.createdAt}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{txn.description}</td>
                    <td className="py-3.5 px-5 text-slate-600">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-medium">
                      {txn.paymentMethod === 'CASH'
                        ? 'Nakit'
                        : txn.paymentMethod === 'CREDIT_CARD'
                        ? 'Kredi Kartı / POS'
                        : 'Havale / EFT'}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-sm">
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Kasa İşlemi Ekle</h3>
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
                  className={`py-2 rounded-lg font-bold transition text-xs cursor-pointer ${
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
                  className={`py-2 rounded-lg font-bold transition text-xs cursor-pointer ${
                    type === 'EXPENSE' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  - Gider (Ödeme)
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tutar (₺) *</label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 font-bold text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-xs font-medium text-slate-800 bg-white"
                  >
                    {type === 'INCOME' ? (
                      <>
                        <option value="Hizmet Ödemesi">Hizmet Ödemesi</option>
                        <option value="Ürün Satışı">Ürün Satışı</option>
                        <option value="Paket Satışı">Paket Satışı</option>
                        <option value="Kapora Tahsilatı">Kapora Tahsilatı</option>
                        <option value="Diğer Gelir">Diğer Gelir</option>
                      </>
                    ) : (
                      <>
                        <option value="Malzeme Alımı">Malzeme Alımı</option>
                        <option value="Kira">Kira</option>
                        <option value="Fatura & Aidat">Fatura & Aidat</option>
                        <option value="Mutfak & İkram">Mutfak & İkram</option>
                        <option value="Maaş / Personel Prim">Maaş / Personel Prim</option>
                        <option value="Diğer Gider">Diğer Gider</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ödeme Yöntemi</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="CASH">Nakit</option>
                    <option value="CREDIT_CARD">Kredi Kartı / POS</option>
                    <option value="HAVALE">Havale / FAST</option>
                  </select>
                </div>
              </div>

              {type === 'INCOME' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    İlgili Uzman (Prim Dağıtımı İçin)
                  </label>
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-xs font-medium text-slate-800 bg-white"
                  >
                    <option value="">-- Genel Salon Cirosu --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.title})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="Örn: Oje ve solüsyon alımı..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
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
