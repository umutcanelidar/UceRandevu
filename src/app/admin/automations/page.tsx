'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  QrCode,
  Instagram,
  CheckCircle2,
  Send,
  Lock,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

export default function AdminAutomationsPage() {
  const { currentUser, tenant, automationLogs, sendWhatsAppMessage } = useApp();

  const [testPhone, setTestPhone] = useState('0532 111 22 33');
  const [testMsg, setTestMsg] = useState(
    'Sayın müşterimiz, BAGE Nail Studio | Beaute randevunuz onaylanmıştır. Randevu detaylarınız ve online işlemler için linke tıklayabilirsiniz: https://bagenailstudiobeaute.com 🤍'
  );
  const [testSent, setTestSent] = useState(false);

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-3xl p-8 border border-brand-100 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto border border-brand-200">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-brand-950 font-serif">Yetkisiz Erişim</h2>
        <p className="text-xs text-brand-700 leading-relaxed">
          Mesajlaşma ve otomasyon ayarları yalnızca <strong>BAGE Salon Sahibi</strong> tarafından yönetilebilir.
        </p>
      </div>
    );
  }

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMsg) return;
    sendWhatsAppMessage(testPhone, testMsg);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-100 shadow-xs">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-brand-950 font-serif tracking-tight">
            WhatsApp & Bildirim Otomasyonu
          </h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Bağlı & Aktif</span>
          </span>
        </div>
        <p className="text-xs text-brand-700 mt-1">
          SMS masrafı ödemeden dükkanınızın resmi WhatsApp numarasından randevu teyitleri, linkleri ve hatırlatmalar gönderin.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp QR Connection */}
        <div className="bg-white rounded-2xl border border-brand-100 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-950 text-sm font-serif">WhatsApp Ağ Geçidi</h3>
                <p className="text-xs text-emerald-800 font-semibold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bağlı Hat: {tenant.whatsappNumber}</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-brand-50 text-brand-800 border border-brand-200 font-bold px-2 py-0.5 rounded-md uppercase">
              Sıfır SMS Maliyeti
            </span>
          </div>

          <div className="p-3.5 bg-brand-50/40 rounded-xl flex items-center space-x-3.5 border border-brand-100">
            <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-brand-200 flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-brand-900" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-brand-950">
                BAGE WhatsApp Hattı Bağlı
              </p>
              <p className="text-[11px] text-brand-700/80 leading-relaxed">
                İşletme telefonunuz bağlı. Randevu talepleri, onayları ve hatırlatmalar BAGE resmi numarasından müşteriye otomatik iletilmektedir.
              </p>
            </div>
          </div>

          {/* Test Box */}
          <form onSubmit={handleSendTest} className="pt-2 space-y-2.5 text-xs border-t border-brand-100">
            <span className="font-semibold text-brand-950 block">Canlı Test Mesajı Gönder:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="0532..."
                className="px-3 py-2 rounded-xl border border-brand-200 text-xs w-full sm:w-1/3 bg-white"
              />
              <input
                type="text"
                value={testMsg}
                onChange={(e) => setTestMsg(e.target.value)}
                className="px-3 py-2 rounded-xl border border-brand-200 text-xs w-full sm:w-2/3 bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1 shrink-0 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </div>
            {testSent && (
              <p className="text-emerald-800 text-[11px] font-semibold animate-pulse">
                ✓ WhatsApp test mesajı kuyruğa eklendi ve iletildi!
              </p>
            )}
          </form>
        </div>

        {/* Message Template Preview with BORDEAUX LINK (Müşteri Talimatı 20) */}
        <div className="bg-white rounded-2xl border border-brand-100 p-5 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-700" />
            <h3 className="font-bold text-sm text-brand-950 font-serif">
              Otomatik Randevu Şablonu Önizleme
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#DDD5C8] space-y-2 text-xs text-slate-800 shadow-inner">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs space-y-2 max-w-sm">
              <p className="font-medium">
                Sayın <strong>Buse Yıldız</strong>, BAGE Nail Studio | Beaute randevu talebiniz oluşturulmuştur.
              </p>
              <div className="p-2 bg-brand-50/60 rounded-lg border border-brand-100 space-y-1 text-[11px] text-brand-950">
                <div>📅 <strong>Tarih:</strong> 2026-09-22 saat 14:00</div>
                <div>💅 <strong>Hizmet:</strong> Jel Protez Tırnak (Yeni Set)</div>
                <div>👩‍🎨 <strong>Uzman:</strong> İlk Müsait Uzman</div>
              </div>
              <p className="text-[11px] leading-relaxed">
                Randevunuzu takip etmek, detayları görmek veya yeni talep oluşturmak için aşağıdaki bağlantıyı kullanabilirsiniz:
              </p>
              {/* Online randevu linki mesajda bordo renk olsun (Müşteri Talimatı 20) */}
              <div className="pt-1">
                <a
                  href={`/book/${tenant.slug}`}
                  target="_blank"
                  className="font-bold text-sm text-brand-800 hover:text-brand-950 underline decoration-brand-700 decoration-2 flex items-center space-x-1"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-brand-700" />
                  <span>https://bagenailstudiobeaute.com</span>
                </a>
              </div>
              <p className="text-[10px] text-slate-400 text-right pt-1">
                12:45 ✓✓
              </p>
            </div>
          </div>

          <div className="text-[11px] text-brand-700/80 leading-relaxed bg-brand-50/50 p-3 rounded-xl border border-brand-100">
            💡 <strong>Otomasyon Bilgisi:</strong> Müşteri online formdan talep oluşturduğu veya takvimden yeni randevu eklendiği anda bu şablon otomatik olarak tetiklenir.
          </div>
        </div>
      </div>

      {/* Automation Logs */}
      <div className="bg-white rounded-2xl border border-brand-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-brand-100 bg-brand-50/30">
          <h3 className="text-xs font-bold text-brand-950 uppercase tracking-wider">
            Gönderilen Son Bildirimler ({automationLogs.length})
          </h3>
        </div>
        <div className="divide-y divide-brand-50 text-xs">
          {automationLogs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-brand-50/20 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-brand-950">{log.recipient}</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                    İletildi
                  </span>
                </div>
                <p className="text-brand-800 text-[11px] line-clamp-1">{log.message}</p>
              </div>
              <span className="font-mono text-slate-400 text-[11px] shrink-0 ml-4">
                {log.createdAt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
