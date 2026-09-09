'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Wallet,
  Users,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight">UCE Randevu</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/calendar"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center space-x-1.5"
            >
              <span>Yönetim Paneline Gir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Küçük Esnaf ve Salonlar İçin Akıllı Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Randevu, Personel ve Kasa Yönetimi <br className="hidden sm:inline" />
            <span className="text-blue-600">Tek Bir Ekranda.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            İşletmenizin tüm randevu akışını, personel takvimlerini ve gelir-gider kasasını tek bir ekrandan kolayca yönetin; müşterilerinize modern ve hızlı bir randevu deneyimi yaşatın.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin/calendar"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Yönetici Takvimini İncele</span>
            </Link>

            <Link
              href="/book/glamour-nail"
              target="_blank"
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center space-x-2"
            >
              <span>Müşteri Randevu Sayfasını Dene</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/staff"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              <span>Personel Görünümü (Kasa Gizli)</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Features Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Akıllı Randevu Takvimi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tüm çalışanlarınızın saatlik çalışma planını yan yana görün, boş saatlere tek tıkla randevu oluşturun.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Kasa & Gelir-Gider</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nakit, POS kart çekimleri ve havale dengesini anlık takip edin. Harcamalarınızı tek tıkla kaydedin.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Özel Personel ID & Gizlilik</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Çalışanlar sisteme kendi ID leriyle girer. Yalnızca kendi randevularını görür, kasanızı asla göremezler.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Sıfır Masraflı WhatsApp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              SMS paketi satın almadan, dükkanınızın WhatsApp numarasından müşterilere otomatik teyit mesajları gönderin.
            </p>
          </div>
        </div>

        {/* Pricing & Value Section */}
        <div className="bg-white rounded-2xl border border-blue-200 p-8 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">UCE Bilişim Güvencesiyle</span>
            <h2 className="text-2xl font-extrabold text-slate-900">İşletmenizi Kolayca Dijitalleştirin</h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
              Yüksek komisyonlar ve karmaşık sözleşmeler olmadan; randevu takvimi, kasa takibi ve WhatsApp otomasyonuyla işletmenizin verimliliğini anında artırın.
            </p>
          </div>

          <div className="shrink-0 text-center bg-blue-50 border border-blue-100 p-5 rounded-xl">
            <span className="text-xs text-slate-500">Aylık Abonelik</span>
            <div className="text-3xl font-extrabold text-blue-700">399 ₺ <span className="text-xs font-normal text-slate-500">/ ay</span></div>
            <Link
              href="/admin/calendar"
              className="mt-3 block px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 UCE Bilişim • Randevu ve Yönetim Platformu</span>
          <span>Tüm Hakları Saklıdır</span>
        </div>
      </footer>
    </div>
  );
}
