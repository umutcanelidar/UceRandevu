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
  Heart,
  Phone,
  Instagram,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-slate-800 flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Banner */}
      <div className="bg-[#800020] text-amber-100/90 text-xs py-2 px-4 font-medium tracking-wider flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>BAGE Nail Studio | Beaute • Nişantaşı / İstanbul</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
          <a
            href="https://www.instagram.com/bage.nailstudio/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center space-x-1 transition"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@bage.nailstudio</span>
          </a>
          <span>•</span>
          <a href="tel:+902125551234" className="hover:text-white">+90 212 555 12 34</a>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-brand-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-sm border border-brand-200 bg-brand-900 shrink-0">
              <img
                src="/bage-logo.jpg"
                alt="BAGE Nail Studio"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-base text-brand-950 tracking-tight">
                  BAGE Nail Studio
                </span>
                <span className="text-brand-700 font-serif italic text-xs font-semibold">
                  | Beaute
                </span>
              </div>
              <span className="text-[10px] text-brand-600 font-medium block">
                Bagenailstudiobeaute.com
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/book/bage-studio"
              className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>BAGE Online Randevu</span>
            </Link>

            <Link
              href="/yonetim-paneli"
              className="inline-flex items-center space-x-1 px-3 py-2 bg-brand-50 hover:bg-brand-100 text-brand-900 text-xs font-bold rounded-xl border border-brand-200 transition shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>Site Yönetim Paneli</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12 flex-1 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-brand-700 fill-brand-700" />
            <span>Nişantaşı Lüks Güzellik & Tırnak Deneyimi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-950 tracking-tight leading-tight">
            BAGE Nail Studio <br />
            <span className="text-brand-700 italic">Online Randevu & İşletme Sistemi</span>
          </h1>

          <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed max-w-xl mx-auto">
            Jel protez tırnak, kalıcı oje, medikal manikür & pedikür ve lüks bakım randevularınızı 10:00 - 21:00 saatleri arasında 15 dakikalık aralıklarla kolayca planlayın.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/book/bage-studio"
              className="px-6 py-3.5 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-md shadow-brand-900/15 flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>BAGE’ye Talep Oluştur (Müşteri)</span>
            </Link>

            <Link
              href="/admin/calendar"
              className="px-6 py-3.5 bg-white hover:bg-brand-50 text-brand-900 text-xs sm:text-sm font-bold rounded-2xl border border-brand-200 transition flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>Salon Sahibi & Yönetici Paneli</span>
            </Link>

            <Link
              href="/staff"
              className="px-5 py-3.5 bg-brand-50 hover:bg-brand-100 text-brand-800 text-xs font-bold rounded-2xl border border-brand-200/60 transition cursor-pointer"
            >
              <span>Personel Girişi (Kasa Gizli)</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left pt-6">
          <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-950 font-serif text-base">İlk Müsait Uzman</h3>
            <p className="text-xs text-brand-700/80 leading-relaxed">
              Müşterilerin uzman seçimi yapmadan, en hızlı boşluğa randevu oluşturmasını sağlayan butik deneyim.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-950 font-serif text-base">Kasa & Kapora Kontrolü</h3>
            <p className="text-xs text-brand-700/80 leading-relaxed">
              Hizmeti tamamlarken ödeme yöntemi seçimi, kapora takibi ve günlük/aylık ayrışımlı net finans defteri.
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-brand-100 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-200">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-950 font-serif text-base">İzin, Rapor & Maaş</h3>
            <p className="text-xs text-brand-700/80 leading-relaxed">
              Ücretsiz izin ve hastalık raporlarına göre otomatik yevmiye kesintisi, prim hak edişi ve Excel ihracı.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-100 py-6 text-center text-xs text-brand-700">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <a
            href="https://www.instagram.com/bage.nailstudio/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 text-brand-800 hover:text-brand-950 font-semibold transition"
          >
            <Instagram className="w-3.5 h-3.5 text-brand-700" />
            <span>@bage.nailstudio</span>
          </a>
          <span>•</span>
          <a href="tel:+902125551234" className="hover:text-brand-950 font-medium">
            +90 212 555 12 34
          </a>
        </div>
        <p className="font-semibold text-brand-900">
          BAGE Nail Studio | Beaute • Bagenailstudiobeaute.com
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          UCE Bilişim • Randevu ve İşletme Yönetim Platformu
        </p>
      </footer>
    </div>
  );
}
