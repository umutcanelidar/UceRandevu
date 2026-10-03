'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Wallet,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  Phone,
  Headphones,
  Lock,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FCFBF9] text-slate-800 flex flex-col justify-between selection:bg-[#C5A059]/20 selection:text-[#8C6D3F]">
      {/* Top Banner */}
      <div className="bg-[#141414] text-amber-100/90 text-xs py-2 px-4 font-medium tracking-wider flex items-center justify-between border-b border-[#C5A059]/30">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>UCE Bilişim • Çok Kiracılı Randevu ve İşletme Yönetim Platformu</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold text-[#E5D5B5]">
          <span>Güzellik • Kuaför • Nail Art • Klinik</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E5D5B5]/60 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#C5A059] shadow-sm bg-white p-0.5 shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/uce_logo.jpg"
                alt="UCE Bilişim"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-lg text-slate-900 tracking-tight">
                  Uce
                </span>
                <span className="font-sans font-extrabold text-base tracking-widest uppercase bg-gradient-to-r from-[#B8860B] via-[#C5A059] to-[#8C6D3F] bg-clip-text text-transparent">
                  Randevu
                </span>
              </div>
              <span className="text-[10px] text-[#8C6D3F] font-semibold block">
                SaaS İşletme & Randevu Altyapısı
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/yonetim-paneli"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#DFBA73] via-[#C5A059] to-[#9E7B34] hover:brightness-105 text-white text-xs font-bold rounded-xl border border-[#B8860B] transition shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-100" />
              <span>Site Yönetim Paneli</span>
            </Link>

            <Link
              href="/login"
              className="px-3.5 py-2 bg-[#FCFBF9] hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition shadow-2xs"
            >
              <span>Doğrudan Giriş</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 py-14 space-y-12 flex-1 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FCFBF9] text-[#8C6D3F] border border-[#E5D5B5] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Salonunuz İçin Profesyonel Bulut Altyapısı</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            Salonunuzu ve Randevularınızı <br />
            <span className="bg-gradient-to-r from-[#B8860B] via-[#C5A059] to-[#8C6D3F] bg-clip-text text-transparent italic">
              Tek Noktadan Yönetin
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Güzellik merkezleri, kuaförler, protez tırnak stüdyoları ve klinikler için canlı ajanda, kasa/POS, personel PIN güvenliği, izin ve otomatik prim bordroları.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/yonetim-paneli"
              style={{
                background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7B34 100%)',
              }}
              className="px-6 py-3.5 text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-lg shadow-[#C5A059]/25 hover:brightness-110 flex items-center space-x-2 cursor-pointer border border-[#B8860B]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-100" />
              <span>İşletme Girişi (Site Adresiyle)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-bold rounded-2xl border border-slate-200 transition flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#8C6D3F]" />
              <span>Yönetici & Personel Girişi</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-left pt-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E5D5B5]/60 shadow-xs space-y-3 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-[#FCFBF9] text-[#8C6D3F] flex items-center justify-center border border-[#E5D5B5]">
              <Calendar className="w-5 h-5 text-[#B8860B]" />
            </div>
            <h3 className="font-bold text-slate-900 font-serif text-base">7/24 Kesintisiz Canlı Takvim</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saat sınırlaması olmadan 7/24 kesintisiz randevu planlaması. Müşteriler için online talep, yöneticiler için hızlı düzenleme.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E5D5B5]/60 shadow-xs space-y-3 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-[#FCFBF9] text-[#8C6D3F] flex items-center justify-center border border-[#E5D5B5]">
              <Wallet className="w-5 h-5 text-[#B8860B]" />
            </div>
            <h3 className="font-bold text-slate-900 font-serif text-base">Kasa, POS & Net Ciro</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kapora tahsilatı, Nakit/POS/Havale ayrımı ve paket satışlarıyla işletmenizin günlük ve aylık net kârını anlık izleyin.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E5D5B5]/60 shadow-xs space-y-3 hover:shadow-md transition">
            <div className="w-11 h-11 rounded-2xl bg-[#FCFBF9] text-[#8C6D3F] flex items-center justify-center border border-[#E5D5B5]">
              <Users className="w-5 h-5 text-[#B8860B]" />
            </div>
            <h3 className="font-bold text-slate-900 font-serif text-base">Personel PIN & İzin Bordrosu</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Her personele özel PIN kodu. Personeller yalnızca kendi randevusunu görür; kasa ve mali veriler gizli tutulur.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5D5B5]/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-800">
            UCE Bilişim • Randevu ve İşletme Yönetim Platformu
          </p>
          <div className="flex items-center space-x-3 text-xs text-[#8C6D3F] font-semibold">
            <Link href="/yonetim-paneli" className="hover:text-slate-900">Yönetim Gateway</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-900">Giriş Yap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
