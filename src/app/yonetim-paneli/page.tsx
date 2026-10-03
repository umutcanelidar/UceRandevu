'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Calendar,
  Wallet,
  Users,
  AlertCircle,
  ExternalLink,
  Cpu,
  Layers,
} from 'lucide-react';

export default function UceBilisimManagementGateway() {
  const router = useRouter();
  const [storeSlug, setStoreSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRedirectToPanel = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanSlug = storeSlug
      .toLowerCase()
      .trim()
      .replace('.ucebilisim.com', '')
      .replace('.ucebilişim.com', '')
      .replace('https://', '')
      .replace('http://', '')
      .replace(/[^a-z0-9-_]/g, '');

    if (!cleanSlug) {
      setErrorMessage('Lütfen işletmenizin alt alan adını (site adresini) giriniz.');
      return;
    }

    setIsLoading(true);
    setSuccessMessage(`${cleanSlug}.ucebilisim.com yönetim paneli girişine aktarılıyorsunuz...`);

    if (typeof window !== 'undefined') {
      localStorage.setItem('uce_tenant_slug', cleanSlug);
    }

    setTimeout(() => {
      router.push(`/login?store=${encodeURIComponent(cleanSlug)}`);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#c5a059]/20 selection:text-[#8c6d3f]">
      {/* 1. UCE BİLİŞİM KURUMSAL HEADER (Orijinal Altın & Obsidyen Kimliği) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#e5d5b5]/50 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-3 group">
            {/* Orijinal UCE Bilişim Logosu */}
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-[#c5a059] shadow-md bg-white p-0.5 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src="/uce_logo.jpg"
                alt="UCE Bilişim"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#1a1a1a]">
                  Uce
                </span>
                <span className="font-sans font-extrabold text-lg sm:text-xl tracking-widest uppercase bg-gradient-to-r from-[#b8860b] via-[#c5a059] to-[#8c6d3f] bg-clip-text text-transparent">
                  Bilişim
                </span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#fcfbf9] text-[#8c6d3f] border border-[#e5d5b5]">
                  Yönetim Gateway
                </span>
              </div>
              <p className="text-[11px] text-[#444444] font-medium hidden sm:block">
                Merkezi Mağaza & Salon Yönetim Portalı
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://wa.me/905329998877"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-[#444444] hover:text-[#b8860b] transition"
          >
            <Headphones className="w-4 h-4 text-[#c5a059]" />
            <span>Müşteri Desteği</span>
          </a>
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl border border-[#e5d5b5] text-[#1a1a1a] hover:bg-[#f7f4ee] text-xs font-semibold transition"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      {/* 2. ANA GİRİŞ GÖVDESİ (IdeaSoft / UceBilisim Split Screen) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white rounded-3xl border border-[#e5d5b5]/70 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* SOL: IdeaSoft Modeli Form Alanı (7 Kolon) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Başlık ve Açıklama */}
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#fcfbf9] border border-[#e5d5b5] text-[#8c6d3f] text-xs font-semibold mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" />
                  <span>UCE Bilişim Güvenli Giriş Kapısı</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a1a] tracking-tight">
                  Site Yönetim Paneli
                </h1>
                <p className="text-xs sm:text-sm text-[#555555] mt-1 leading-relaxed">
                  İşletmenizle ilgili tüm randevu, kasa, personel ve müşteri işlemlerini yapabileceğiniz yönetim panelinize bağlanın.
                </p>
              </div>

              {/* Bildirim Alanı */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 animate-pulse" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form (IdeaSoft Birebir Deneyimi) */}
              <form onSubmit={handleRedirectToPanel} className="space-y-4 text-xs">
                {/* 1. Subdomain Input */}
                <div>
                  <label className="block font-bold text-[#1a1a1a] mb-1.5">
                    İşletme / Site Adresiniz *
                  </label>
                  <div className="flex items-center rounded-xl border-2 border-[#e5d5b5] focus-within:border-[#c5a059] focus-within:ring-2 focus-within:ring-[#c5a059]/20 overflow-hidden bg-white shadow-2xs transition">
                    <span className="pl-3.5 pr-1 text-[#8c6d3f]">
                      <Globe className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="isletme-adiniz"
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      className="w-full py-3 px-2 text-xs sm:text-sm font-semibold text-[#1a1a1a] focus:outline-hidden bg-transparent"
                    />
                    <span className="pr-3.5 pl-2.5 py-3 text-xs sm:text-sm font-bold text-[#8c6d3f] bg-[#fcfbf9] border-l border-[#e5d5b5] select-none">
                      .ucebilisim.com
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1.5">
                    Örnek: İşletmenizin alt alan adını yazarak doğrudan kendi yönetim panelinize bağlanabilirsiniz.
                  </p>
                </div>

                {/* Yönlendir & Giriş Yap Butonu (Orijinal UceBilişim Altın Gradyanı) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: 'linear-gradient(135deg, #DFBA73 0%, #C5A059 50%, #9E7B34 100%)',
                  }}
                  className="w-full py-3.5 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-[#c5a059]/30 hover:brightness-110 flex items-center justify-center space-x-2 cursor-pointer mt-3 border border-[#b8860b]"
                >
                  <span>{isLoading ? 'Giriş Sayfasına Yönlendiriliyor...' : 'Giriş Yap'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Footer Bilgisi */}
            <div className="text-[11px] text-[#777777] pt-3 border-t border-[#e5d5b5]/40 flex items-center justify-between">
              <span>© 2026 UCE Bilişim Teknolojileri</span>
              <span className="text-[#8c6d3f] font-mono font-medium">Beşiktaş / İstanbul</span>
            </div>
          </div>

          {/* SAĞ: UCE BİLİŞİM LÜKS OBSİDYEN & ALTIN PANOSU (5 Kolon) */}
          <div className="lg:col-span-5 bg-[#141414] p-6 sm:p-8 text-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#2a2a2a] relative overflow-hidden">
            {/* Altın Işık Halesi */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              {/* UCE Altın Rozet */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#222222] border border-[#c5a059]/40 text-[#c5a059] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#e5d5b5]" />
                <span className="font-mono text-[11px] tracking-wider uppercase">UCE Bulut SaaS Altyapısı</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight leading-snug">
                  İşletmenizi Tek Noktadan Yönetin
                </h2>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed font-light">
                  Alt alan adınızla giriş yapın; randevu trafiğinizi, kasanızı, personel izin ve maaş bordrolarınızı anlık kontrol edin.
                </p>
              </div>

              {/* 3 Temel Güç Kartı */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#c5a059]/20 space-y-1">
                  <div className="flex items-center space-x-2 text-[#e5d5b5] font-bold">
                    <Calendar className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-serif">Canlı Randevu & Takvim</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                    10:00 - 21:00 arası 15 dakikalık aralıklarla çakışmasız randevu planlaması.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#c5a059]/20 space-y-1">
                  <div className="flex items-center space-x-2 text-[#e5d5b5] font-bold">
                    <Wallet className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-serif">Günlük / Aylık Kasa & Net Kâr</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                    Nakit, POS, Havale ayrımı ve personel bazlı ciro/prim Excel dökümleri.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c1c] border border-[#c5a059]/20 space-y-1">
                  <div className="flex items-center space-x-2 text-[#e5d5b5] font-bold">
                    <Users className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-serif">İzin, Maaş & Personel Gizliliği</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-light">
                    Rapor ve izin günlerine göre otomatik kesinti, personele kapalı kasa güvenliği.
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ Alt Güvenlik & Sunucu Durumu */}
            <div className="pt-6 relative">
              <div className="p-3 rounded-2xl bg-[#1a1a1a] border border-[#c5a059]/30 text-[11px] text-stone-300 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="flex items-center space-x-1.5 font-mono text-[11px]">
                    <Cpu className="w-3.5 h-3.5 text-[#c5a059]" />
                    <span>UCE Cloud Altyapısı</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>%99.9 Aktif</span>
                  </span>
                </div>
                <p className="text-[10px] text-stone-400">
                  Verileriniz 256-Bit SSL şifreleme ve günlük bulut yedekleme ile korunmaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. ALT FOOTER */}
      <footer className="py-4 text-center text-xs text-[#555555] bg-white border-t border-[#e5d5b5]/50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UCE Bilişim • Çok Kiracılı (Multi-Tenant) Randevu Platformu</span>
          <div className="flex items-center space-x-4 text-xs font-semibold text-[#8c6d3f]">
            <Link href="/login" className="hover:text-[#1a1a1a]">Yönetici & Personel Girişi</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
