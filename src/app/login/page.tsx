'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { db } from '@/lib/supabaseSync';
import {
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  KeyRound,
  AlertCircle,
  Layers,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { tenant, staffList, switchUser } = useApp();

  const [activeTab, setActiveTab] = useState<'ADMIN' | 'STAFF'>('ADMIN');
  const [storeName, setStoreName] = useState('');
  const [isFirstSetup, setIsFirstSetup] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const storeParam = urlParams.get('store');
      const savedSlug = localStorage.getItem('uce_tenant_slug');
      const active = storeParam || savedSlug;
      if (active) {
        setStoreName(active.toUpperCase());
        const storeKey = `uce_admin_pass_${active.toLowerCase()}`;
        const existing = localStorage.getItem(storeKey);
        setIsFirstSetup(!existing);
      } else {
        const defaultKey = 'uce_admin_pass_default';
        const existing = localStorage.getItem(defaultKey);
        setIsFirstSetup(!existing);
      }
    }
  }, []);

  // Admin form (Hazır/hardcoded veriler kaldırıldı)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Staff form
  const [selectedStaffCode, setSelectedStaffCode] = useState(staffList[0]?.staffCode || '');
  const [staffPin, setStaffPin] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isBage = storeName.toLowerCase().includes('bage') || (tenant.slug || '').toLowerCase().includes('bage');
  const storeDisplayName = isBage ? 'BAGE Nail Studio' : (storeName || tenant.name);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const emailTrim = adminEmail.trim();
    const passTrim = adminPassword.trim();

    if (!emailTrim) {
      setErrorMsg('Lütfen e-posta adresinizi veya kullanıcı adınızı giriniz.');
      return;
    }

    if (!passTrim) {
      setErrorMsg('Lütfen yönetici şifrenizi giriniz.');
      return;
    }

    const storeSlug = (storeName || tenant.slug || 'default').toLowerCase();
    const storeKey = `uce_admin_pass_${storeSlug}`;
    const savedPass = typeof window !== 'undefined' ? localStorage.getItem(storeKey) : null;

    setIsLoading(true);

    try {
      // 1. Supabase Cloud Authentication
      const verification = await db.verifyTenantLogin(storeSlug, passTrim);
      
      if (!verification.success && !verification.isFirstSetup) {
        setErrorMsg('Hatalı yönetici şifresi! Lütfen bu mağaza için belirlediğiniz şifreyi giriniz.');
        setIsLoading(false);
        return;
      }

      if (verification.isFirstSetup) {
        if (!savedPass) {
          if (passTrim.length < 4) {
            setErrorMsg('Yönetici şifreniz en az 4 karakter olmalıdır.');
            setIsLoading(false);
            return;
          }
          await db.upsertTenant({
            ...tenant,
            id: `tenant-${storeSlug}`,
            slug: storeSlug,
            name: storeName ? storeName.charAt(0).toUpperCase() + storeName.slice(1) : tenant.name,
          }, passTrim);
        } else if (savedPass !== passTrim) {
          setErrorMsg('Hatalı yönetici şifresi! Lütfen bu mağaza için belirlediğiniz şifreyi giriniz.');
          setIsLoading(false);
          return;
        }
      }

      // 2. LocalStorage Persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(storeKey, passTrim);
        localStorage.setItem(`uce_admin_email_${storeSlug}`, emailTrim);
        localStorage.setItem('uce_tenant_slug', storeSlug);
      }

      switchUser('SPECIAL_ADMIN');
      router.push('/admin/calendar');
    } catch (err) {
      console.warn('Giriş doğrulama uyarısı:', err);
      // Offline fallback
      if (savedPass && savedPass !== passTrim) {
        setErrorMsg('Hatalı yönetici şifresi!');
        setIsLoading(false);
        return;
      }
      switchUser('SPECIAL_ADMIN');
      router.push('/admin/calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (staffList.length === 0) {
      setErrorMsg('Sistemde henüz kayıtlı personel bulunmuyor. Lütfen önce Salon Sahibi olarak giriş yapınız.');
      return;
    }

    const staff = staffList.find((s) => s.staffCode === selectedStaffCode);
    const expectedPin = staff?.pinCode || '';

    if (!staffPin.trim() || staffPin.trim() !== expectedPin) {
      setErrorMsg(`Hatalı PIN kodu! Lütfen ${staff?.name || 'personel'} için yöneticinizin belirlediği geçerli PIN kodunu giriniz.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      switchUser('STAFF', selectedStaffCode);
      router.push('/staff');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between selection:bg-brand-100 selection:text-brand-900">
      {/* Top Banner */}
      <div className="bg-[#800020] text-amber-100/90 text-xs py-2 px-4 font-medium tracking-wider flex items-center justify-between">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{storeDisplayName} • Güvenli Giriş Kapısı</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-xs font-semibold">
          <span>UCE Bilişim Güvencesiyle</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-brand-100 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-brand-200 mx-auto bg-brand-900 p-1 flex items-center justify-center">
              <img
                src={isBage ? '/bage-logo.jpg' : (tenant.logoUrl || '/uce_logo.jpg')}
                alt={storeDisplayName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-brand-950 tracking-tight">
                {storeDisplayName} Yönetim Portalı
              </h1>
              <p className="text-xs text-brand-700 font-medium">
                İşletme Yönetimi & Personel Portalı
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-brand-50 rounded-2xl border border-brand-100 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('ADMIN');
                setErrorMsg('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-brand-900 shadow-xs border border-brand-200 font-bold'
                  : 'text-brand-700/70 hover:text-brand-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span className="text-[11px]">Salon Sahibi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('STAFF');
                setErrorMsg('');
              }}
              className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                activeTab === 'STAFF'
                  ? 'bg-white text-brand-900 shadow-xs border border-brand-200 font-bold'
                  : 'text-brand-700/70 hover:text-brand-900'
              }`}
            >
              <User className="w-4 h-4 text-brand-700" />
              <span className="text-[11px]">Personel</span>
            </button>
          </div>

          {/* 1. SALON SAHİBİ GİRİŞİ */}
          {activeTab === 'ADMIN' && (
            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 text-brand-900 space-y-1">
                <span className="font-bold flex items-center space-x-1.5 text-brand-950">
                  <ShieldCheck className="w-4 h-4 text-brand-700" />
                  <span>Yönetici & Salon Sahibi Girişi</span>
                </span>
                <p className="text-[11px] text-brand-700/80 leading-relaxed">
                  Randevu takvimi, kasa, gelir-gider, personel maaşları ve salon ayarlarına tam yetkiyle erişin.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-brand-950 mb-1">
                  E-Posta Adresi veya Telefon
                </label>
                <input
                  type="text"
                  required
                  placeholder="yonetici@isletmeniz.com veya 05xxxxxxxxx"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 font-medium text-brand-950 shadow-2xs bg-white text-xs"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-brand-950">
                    Yönetici Şifresi
                  </label>
                  {isFirstSetup && (
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      İlk Kez Şifre Belirleniyor
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder={isFirstSetup ? "İlk şifrenizi belirleyiniz (En az 4 karakter)" : "Yönetici şifrenizi giriniz"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 font-mono text-brand-950 shadow-2xs bg-white text-xs"
                  />
                  <Lock className="w-4 h-4 text-brand-400 absolute right-3 top-3" />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {isFirstSetup
                    ? "✨ İlk Kurulum: Gireceğiniz bu şifre, bu işletmenin yönetici şifresi olarak güvenle kaydedilecektir."
                    : "🔒 Güvenli Giriş: Lütfen işletmeniz için belirlediğiniz şifreyi giriniz."}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-brand-900/15 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{isLoading ? 'Giriş Yapılıyor...' : isFirstSetup ? 'Şifremi Kaydet ve Giriş Yap' : 'Yönetim Paneline Giriş Yap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. PERSONEL GİRİŞİ */}
          {activeTab === 'STAFF' && (
            <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                <span className="font-bold flex items-center space-x-1.5 text-emerald-900">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>Personel & Uzman Girişi</span>
                </span>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  Yalnızca kendi adınıza kayıtlı randevuları görün, tamamlayın veya müşteri ekleyin. Kasa ve salon cirosu gizlidir.
                </p>
              </div>

              {staffList.length === 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2.5 text-center">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-amber-950">Henüz Kayıtlı Personel Yok</h3>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    İşletmenizde henüz kayıtlı personel hesabı bulunmamaktadır. Lütfen yukarıdaki <strong>Salon Sahibi</strong> sekmesine tıklayarak yönetici girişi yapınız ve <strong>Personeller</strong> sayfasından ilk personelinizi ekleyiniz.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ADMIN')}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Salon Sahibi Girişine Geç
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-brand-950 mb-1">
                      Personel Seçiniz
                    </label>
                    <select
                      value={selectedStaffCode || (staffList[0]?.staffCode ?? '')}
                      onChange={(e) => setSelectedStaffCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 font-semibold text-brand-950 shadow-2xs bg-white"
                    >
                      {staffList.map((s) => (
                        <option key={s.id} value={s.staffCode}>
                          {s.name} ({s.staffCode} - {s.title})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-950 mb-1">
                      Personel PIN / Şifre
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Yöneticinizin verdiği 4 haneli PIN"
                        value={staffPin}
                        onChange={(e) => setStaffPin(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-brand-200 focus:outline-hidden focus:border-brand-700 font-mono text-brand-950 shadow-2xs bg-white"
                      />
                      <KeyRound className="w-4 h-4 text-brand-400 absolute right-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm rounded-2xl transition shadow-md shadow-emerald-900/15 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{isLoading ? 'Giriş Yapılıyor...' : 'Personel Ajandama Giriş Yap'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="text-center pt-1">
                <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  🔒 Güvenlik: Personel ekranında salonun kasa ve mali verileri tamamen gizlidir.
                </span>
              </div>
            </form>
          )}

          {/* Public Booking Link at Bottom */}
          <div className="pt-3 border-t border-brand-100 text-center">
            <a
              href={isBage ? '/book/bagenailstudio' : `/book/${tenant.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs text-brand-800 hover:text-brand-950 font-semibold transition"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-700" />
              <span>Müşteri Randevu Sayfasına Git</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-brand-700/70 border-t border-brand-100 bg-white">
        <p className="font-semibold text-brand-900">
          UCE Bilişim • Randevu ve Salon Yönetim Platformu
        </p>
      </footer>
    </div>
  );
}
