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
  Download,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  Building2,
  Package,
} from 'lucide-react';
import { Staff } from '@/types';

export default function AdminFinancePage() {
  const { currentUser, tenant, transactions, appointments, staffList, addTransaction, deleteTransaction } = useApp();

  const [periodMode, setPeriodMode] = useState<'DAILY' | 'MONTHLY'>('DAILY');
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedStaffForCiro, setSelectedStaffForCiro] = useState<Staff | null>(null);

  // Form State
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [category, setCategory] = useState('Randevu Geliri');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CREDIT_CARD' | 'HAVALE'>('CREDIT_CARD');
  const [staffId, setStaffId] = useState('');
  const [description, setDescription] = useState('');

  // Access check
  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-100 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-950 font-serif">Erişim Yetkisi Yok</h2>
        <p className="text-xs text-brand-700 leading-relaxed">
          Kasa, ciro ve gelir-gider kayıtları yalnızca <strong>Salon Sahibi</strong> tarafından görüntülenebilir.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7); // e.g. "2026-09"

  // Günlük veya Aylık filtrelenmiş işlemler (Müşteri Talimatı 9)
  const periodTransactions = transactions.filter((t) => {
    if (periodMode === 'DAILY') {
      return t.date === todayStr;
    } else {
      return t.date.startsWith(currentMonthStr);
    }
  });

  const periodIncome = periodTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const periodExpense = periodTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const periodNetBalance = periodIncome - periodExpense;

  // Ödeme yöntemi dağılımı
  const cashIncome = periodTransactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'CASH')
    .reduce((sum, t) => sum + t.amount, 0);

  const cardIncome = periodTransactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'CREDIT_CARD')
    .reduce((sum, t) => sum + t.amount, 0);

  const havaleIncome = periodTransactions
    .filter((t) => t.type === 'INCOME' && t.paymentMethod === 'HAVALE')
    .reduce((sum, t) => sum + t.amount, 0);

  // Hedefler
  const targetAmount = periodMode === 'DAILY' ? (tenant.dailyTarget || 7500) : (tenant.monthlyTarget || 180000);
  const targetPercent = Math.min(100, Math.round((periodIncome / targetAmount) * 100));

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

  // CSV Excel İndirme Fonksiyonu (Müşteri Talimatı 10)
  const exportStaffCiroExcel = (staff: Staff) => {
    const staffTxns = transactions.filter(
      (t) => t.type === 'INCOME' && t.staffId === staff.id
    );

    const headers = ['Tarih', 'Saat/Oluşturma', 'Açıklama', 'Kategori', 'Ödeme Yöntemi', 'Tutar (TL)', 'Prim Oranı (%)', 'Kazanılan Prim (TL)'];
    
    const rows = staffTxns.map((t) => {
      const commEarned = Math.round((t.amount * (staff.commissionRate || 35)) / 100);
      return [
        `"${t.date}"`,
        `"${t.createdAt || t.date}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        `"${t.category}"`,
        `"${t.paymentMethod}"`,
        t.amount,
        staff.commissionRate,
        commEarned,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bage_personel_ciro_${staff.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Daily/Monthly Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-950 font-serif tracking-tight">
              Kasa, Ciro & Finans Defteri
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
              BAGENailStudio
            </span>
          </div>
          <p className="text-xs text-brand-700 mt-1">
            Günlük ve aylık kasa ayrımı, personel ciro & prim dökümü ve Excel raporları.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* GÜNLÜK & AYLIK AYRIM TOGGLE (MÜŞTERİ TALİMATI 9) */}
          <div className="flex items-center bg-brand-50 p-1 rounded-xl border border-brand-200 text-xs font-bold">
            <button
              onClick={() => setPeriodMode('DAILY')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                periodMode === 'DAILY'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-brand-800 hover:text-brand-950'
              }`}
            >
              Günlük Kasa
            </button>
            <button
              onClick={() => setPeriodMode('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                periodMode === 'MONTHLY'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-brand-800 hover:text-brand-950'
              }`}
            >
              Aylık Kasa
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm shadow-brand-900/10 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>Gelir / Gider Ekle</span>
          </button>
        </div>
      </div>

      {/* Target Progress & Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Period Income */}
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-700 font-medium">
            <span>{periodMode === 'DAILY' ? 'Bugünkü Toplam Gelir' : 'Bu Ayki Toplam Gelir'}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950">
            {periodIncome.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            {periodTransactions.filter((t) => t.type === 'INCOME').length} tahsilat fişi
          </div>
        </div>

        {/* Total Period Expense */}
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-700 font-medium">
            <span>{periodMode === 'DAILY' ? 'Bugünkü Giderler' : 'Bu Ayki Giderler'}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-rose-900">
            {periodExpense.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-rose-700 font-semibold">
            Kira, fatura, malzeme & masraflar
          </div>
        </div>

        {/* Net Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-700 font-medium">
            <span>{periodMode === 'DAILY' ? 'Bugünkü Net Kasa Kârı' : 'Bu Ayki Net Kasa Kârı'}</span>
            <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold font-serif ${periodNetBalance >= 0 ? 'text-brand-950' : 'text-rose-700'}`}>
            {periodNetBalance.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-brand-800 font-semibold">
            Net Temiz Bakiye
          </div>
        </div>

        {/* Target Progress Card */}
        <div className="bg-white p-5 rounded-2xl border border-brand-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-700 font-medium">
            <span>{periodMode === 'DAILY' ? 'Günlük Hedef (7.500 ₺)' : 'Aylık Hedef (180.000 ₺)'}</span>
            <Target className="w-4 h-4 text-brand-700" />
          </div>
          <div className="text-2xl font-bold font-serif text-brand-950">
            %{targetPercent}
          </div>
          <div className="w-full bg-brand-50 h-2 rounded-full overflow-hidden border border-brand-100">
            <div
              className="bg-brand-700 h-full rounded-full transition-all duration-300"
              style={{ width: `${targetPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Payment Method Breakdown Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-100 shadow-xs">
        <h3 className="text-xs font-bold text-brand-950 uppercase tracking-wider mb-3">
          {periodMode === 'DAILY' ? 'Bugünkü Ödeme Yöntemi Dağılımı' : 'Bu Ayki Ödeme Yöntemi Dağılımı'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-brand-700" />
              <span className="text-xs font-semibold text-brand-900">Kredi Kartı / POS:</span>
            </div>
            <strong className="text-sm font-bold font-serif text-brand-950">{cardIncome.toLocaleString('tr-TR')} ₺</strong>
          </div>

          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Banknote className="w-4 h-4 text-brand-700" />
              <span className="text-xs font-semibold text-brand-900">Nakit Tahsilat:</span>
            </div>
            <strong className="text-sm font-bold font-serif text-brand-950">{cashIncome.toLocaleString('tr-TR')} ₺</strong>
          </div>

          <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-brand-700" />
              <span className="text-xs font-semibold text-brand-900">Havale / FAST:</span>
            </div>
            <strong className="text-sm font-bold font-serif text-brand-950">{havaleIncome.toLocaleString('tr-TR')} ₺</strong>
          </div>
        </div>
      </div>

      {/* PERSONEL BAZLI CİRO & PRİM BÖLÜMÜ (MÜŞTERİ TALİMATI 10) */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-brand-950 font-serif">
              Personel Bazlı Ciro & Prim Dökümü
            </h3>
            <p className="text-xs text-brand-700">
              Detayları görmek ve Excel tablosu indirmek için personelin üstüne tıklayınız.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            Detay için Satıra Dokun
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-950">
            <thead className="bg-brand-50/50 text-[11px] font-bold text-brand-800 uppercase tracking-wider border-b border-brand-100">
              <tr>
                <th className="px-5 py-3">Uzman Personel</th>
                <th className="px-5 py-3">Ünvan</th>
                <th className="px-5 py-3">Prim Oranı</th>
                <th className="px-5 py-3">{periodMode === 'DAILY' ? 'Bugünkü Ciro' : 'Bu Ayki Ciro'}</th>
                <th className="px-5 py-3">Toplam Üretilen Ciro</th>
                <th className="px-5 py-3 text-right">Tahmini Prim Hakedişi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {staffList.map((staff) => {
                // Period staff revenue
                const staffPeriodRevenue = periodTransactions
                  .filter((t) => t.type === 'INCOME' && t.staffId === staff.id)
                  .reduce((sum, t) => sum + t.amount, 0);

                // Total staff revenue all time
                const totalStaffRevenue = transactions
                  .filter((t) => t.type === 'INCOME' && t.staffId === staff.id)
                  .reduce((sum, t) => sum + t.amount, 0);

                const estimatedCommission = Math.round((totalStaffRevenue * (staff.commissionRate || 35)) / 100);

                return (
                  <tr
                    key={staff.id}
                    onClick={() => setSelectedStaffForCiro(staff)}
                    className="hover:bg-brand-50/40 transition cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-brand-950 block">{staff.name}</span>
                          <span className="text-[10px] text-brand-600 font-mono">({staff.staffCode})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-brand-800 font-medium">{staff.title}</td>
                    <td className="px-5 py-3.5 font-bold text-brand-700">%{staff.commissionRate}</td>
                    <td className="px-5 py-3.5 font-bold text-brand-950 font-serif">
                      {staffPeriodRevenue.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-800 font-serif">
                      {totalStaffRevenue.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-800 font-serif text-sm">
                      {estimatedCommission.toLocaleString('tr-TR')} ₺
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-brand-50/30">
          <div>
            <h3 className="text-xs font-bold text-brand-950 uppercase tracking-wider">
              Kasa İşlem Geçmişi & Fişler
            </h3>
            <p className="text-[11px] text-brand-700">Tüm tahsilat, harcama ve gider kayıtları</p>
          </div>

          <div className="flex items-center space-x-1.5 bg-brand-50 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-brand-700 text-white shadow-xs'
                  : 'text-brand-800 hover:text-brand-950'
              }`}
            >
              Tümü ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'INCOME'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-brand-800 hover:text-brand-950'
              }`}
            >
              Gelirler
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterType === 'EXPENSE'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-brand-800 hover:text-brand-950'
              }`}
            >
              Giderler
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-950">
            <thead className="bg-brand-50/50 border-b border-brand-100 text-[11px] font-bold text-brand-800 uppercase">
              <tr>
                <th className="py-3 px-5">Tarih / Saat</th>
                <th className="py-3 px-5">Açıklama</th>
                <th className="py-3 px-5">Kategori</th>
                <th className="py-3 px-5">Ödeme Türü</th>
                <th className="py-3 px-5 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50 font-medium">
              {filteredTransactions.map((txn) => {
                const isIncome = txn.type === 'INCOME';

                return (
                  <tr key={txn.id} className="hover:bg-brand-50/30 transition">
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {txn.createdAt || txn.date}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-brand-950">{txn.description}</td>
                    <td className="py-3.5 px-5 text-brand-700">
                      <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 text-[11px] font-semibold border border-brand-200">
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-brand-900 font-medium">
                      {txn.paymentMethod === 'CASH'
                        ? 'Nakit'
                        : txn.paymentMethod === 'CREDIT_CARD'
                        ? 'Kredi Kartı / POS'
                        : 'Havale / FAST'}
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold font-serif text-sm">
                      <span className={isIncome ? 'text-emerald-700' : 'text-rose-700'}>
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

      {/* PERSONEL CİRO & EXCEL İNDİRME MODALI (MÜŞTERİ TALİMATI 10) */}
      {selectedStaffForCiro && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {(() => {
              const staffTxns = transactions.filter(
                (t) => t.type === 'INCOME' && t.staffId === selectedStaffForCiro.id
              );
              const totalCiro = staffTxns.reduce((sum, t) => sum + t.amount, 0);
              const totalCommission = Math.round((totalCiro * (selectedStaffForCiro.commissionRate || 35)) / 100);

              return (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-brand-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-brand-950 font-serif">
                          {selectedStaffForCiro.name} - Ciro & Prim Detayı
                        </h3>
                        <span className="font-mono text-xs font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {selectedStaffForCiro.staffCode}
                        </span>
                      </div>
                      <p className="text-xs text-brand-700">
                        {selectedStaffForCiro.title} • Prim Oranı: %{selectedStaffForCiro.commissionRate}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedStaffForCiro(null)}
                      className="text-brand-400 hover:text-brand-800 text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Summary Metric Pills */}
                  <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-brand-50/50 rounded-2xl border border-brand-100 text-brand-950 text-xs">
                    <div>
                      <span className="text-brand-700 block">Tamamlanan İşlem:</span>
                      <strong className="text-sm font-bold mt-0.5 block">{staffTxns.length} Adet</strong>
                    </div>
                    <div>
                      <span className="text-brand-700 block">Üretilen Toplam Ciro:</span>
                      <strong className="text-sm font-bold font-serif text-brand-950 mt-0.5 block">
                        {totalCiro.toLocaleString('tr-TR')} ₺
                      </strong>
                    </div>
                    <div>
                      <span className="text-emerald-700 block">Kazanılan Prim (%{selectedStaffForCiro.commissionRate}):</span>
                      <strong className="text-sm font-bold font-serif text-emerald-800 mt-0.5 block">
                        {totalCommission.toLocaleString('tr-TR')} ₺
                      </strong>
                    </div>
                  </div>

                  {/* Transaction Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-brand-950 uppercase tracking-wider">
                      Gerçekleşen Randevu ve Satış İşlemleri:
                    </h4>

                    {staffTxns.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-500 text-xs">
                        Bu personele ait tamamlanmış tahsilat kaydı bulunmuyor.
                      </div>
                    ) : (
                      <div className="border border-brand-100 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-brand-50/60 text-[10px] font-bold text-brand-800 uppercase border-b border-brand-100">
                            <tr>
                              <th className="py-2 px-3">Tarih</th>
                              <th className="py-2 px-3">İşlem / Hizmet</th>
                              <th className="py-2 px-3">Ödeme Şekli</th>
                              <th className="py-2 px-3 text-right">Tutar</th>
                              <th className="py-2 px-3 text-right">Prim</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-50">
                            {staffTxns.map((t) => {
                              const comm = Math.round((t.amount * (selectedStaffForCiro.commissionRate || 35)) / 100);
                              return (
                                <tr key={t.id} className="hover:bg-brand-50/30">
                                  <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{t.date}</td>
                                  <td className="py-2 px-3 font-bold text-brand-950">{t.description}</td>
                                  <td className="py-2 px-3 text-brand-700 text-[11px]">
                                    {t.paymentMethod === 'CASH' ? 'Nakit' : t.paymentMethod === 'HAVALE' ? 'Havale' : 'Kart'}
                                  </td>
                                  <td className="py-2 px-3 text-right font-bold text-brand-950 font-serif">
                                    {t.amount} ₺
                                  </td>
                                  <td className="py-2 px-3 text-right font-bold text-emerald-800 font-serif">
                                    +{comm} ₺
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Actions: Excel İndir & Kapat */}
                  <div className="flex items-center justify-between pt-3 border-t border-brand-100">
                    <button
                      onClick={() => exportStaffCiroExcel(selectedStaffForCiro)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Excel Tablosu İndir (.csv)</span>
                    </button>

                    <button
                      onClick={() => setSelectedStaffForCiro(null)}
                      className="px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Kapat
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal: Add Transaction */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-brand-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <h3 className="text-base font-bold text-brand-950 font-serif">Kasa İşlemi Ekle</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-brand-400 hover:text-brand-800 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-brand-50 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType('INCOME');
                    setCategory('Randevu Geliri');
                  }}
                  className={`py-2 rounded-lg font-bold transition text-xs cursor-pointer ${
                    type === 'INCOME' ? 'bg-white text-emerald-800 shadow-xs' : 'text-brand-800'
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
                    type === 'EXPENSE' ? 'bg-white text-rose-800 shadow-xs' : 'text-brand-800'
                  }`}
                >
                  - Gider (Ödeme)
                </button>
              </div>

              <div>
                <label className="block font-bold text-brand-950 mb-1">Tutar (₺) *</label>
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 font-bold text-sm text-brand-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-950 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium text-brand-950 bg-white"
                  >
                    {type === 'INCOME' ? (
                      <>
                        <option value="Randevu Geliri">Randevu Geliri</option>
                        <option value="Ürün Satışı">Ürün Satışı</option>
                        <option value="Paket Satışı">Paket Satışı</option>
                        <option value="Kapora Geliri">Kapora Geliri</option>
                        <option value="Diğer Gelir">Diğer Gelir</option>
                      </>
                    ) : (
                      <>
                        <option value="Malzeme Alımı">Malzeme Alımı</option>
                        <option value="Kira">Salon Kirası</option>
                        <option value="Fatura & Aidat">Fatura & Aidat</option>
                        <option value="Mutfak & İkram">Mutfak & İkram</option>
                        <option value="Personel Avans">Personel Avans / Maaş</option>
                        <option value="Diğer Gider">Diğer Gider</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-brand-950 mb-1">Ödeme Yöntemi</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium text-brand-950 bg-white"
                  >
                    <option value="CREDIT_CARD">Kredi Kartı / POS</option>
                    <option value="CASH">Nakit</option>
                    <option value="HAVALE">Havale / FAST</option>
                  </select>
                </div>
              </div>

              {type === 'INCOME' && (
                <div>
                  <label className="block font-bold text-brand-950 mb-1">İlgili Personel (Prim İçin)</label>
                  <select
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs font-medium text-brand-950 bg-white"
                  >
                    <option value="">Genel Salon Geliri (Personelsiz)</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.staffCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-brand-950 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="İşlem detayı..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
