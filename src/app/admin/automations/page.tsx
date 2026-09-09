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
} from 'lucide-react';

export default function AdminAutomationsPage() {
  const { currentUser, tenant, automationLogs, sendWhatsAppMessage } = useApp();

  const [testPhone, setTestPhone] = useState('0532 000 00 00');
  const [testMsg, setTestMsg] = useState('Sayın müşterimiz, Bella Güzellik Stüdyosu randevunuz bugün 14:00 için onaylanmıştır.');
  const [testSent, setTestSent] = useState(false);

  if (currentUser.role !== 'SPECIAL_ADMIN') {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-lg mx-auto text-center space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto border border-rose-100">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Yetkisiz Erişim</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Mesajlaşma ve otomasyon ayarları yalnızca <strong>Salon Sahibi</strong> tarafından yönetilebilir.
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
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">WhatsApp & Bildirim Otomasyonu</h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gateway Bağlı</span>
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          SMS masrafı ödemeden dükkanınızın kendi WhatsApp numarasından randevu teyitleri ve hatırlatmalar gönderin.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp QR Connection */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">WhatsApp Ağ Geçidi (QR Kod)</h3>
                <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bağlı Numara: {tenant.whatsappNumber}</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-md uppercase">
              Sıfır SMS Maliyeti
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl flex items-center space-x-3.5 border border-slate-200">
            <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">
                Oturum Başarıyla Açık
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                İşletme telefonunuz bağlı. Randevu onayı ve hatırlatmalar dükkanınızın resmi numarasından müşteriye otomatik iletilmektedir.
              </p>
            </div>
          </div>

          {/* Test Box */}
          <form onSubmit={handleSendTest} className="pt-2 space-y-2.5 text-xs border-t border-slate-100">
            <span className="font-semibold text-slate-800 block">Canlı Test Mesajı Gönder:</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0532 123 45 67"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 font-medium text-xs"
              />
              <input
                type="text"
                value={testMsg}
                onChange={(e) => setTestMsg(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center space-x-1 shrink-0 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </div>
            {testSent && (
              <p className="text-[11px] text-emerald-600 font-semibold">
                ✓ Mesaj WhatsApp üzerinden iletildi ve loglara kaydedildi.
              </p>
            )}
          </form>
        </div>

        {/* Instagram DM Assistant */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Instagram DM Rezervasyon Asistanı</h3>
                <p className="text-xs text-pink-600 font-semibold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bağlı Hesap: {tenant.instagramHandle}</span>
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-semibold px-2 py-0.5 rounded-md">
              DM Botu
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-2 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Otomatik Randevu Linki Gönderimi:</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                Devrede
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Müşteriler Instagram DM üzerinden <em>"randevu", "fiyat", "boş saat"</em> yazdığında bot anında dükkanın online linkini iletir.
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 text-[11px] font-mono leading-relaxed">
              &quot;Merhaba! Randevu almak ve uzmanlarımızın boş saatlerini görmek için tıklayabilirsiniz: https://ucebilisim.com/book/{tenant.slug}&quot;
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Meta Webhook Entegrasyonu</span>
            <span className="text-emerald-600 font-medium">Gecikme: &lt; 1 sn</span>
          </div>
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Otomasyon & İletişim Logları</h3>
            <p className="text-xs text-slate-500">Müşterilere otomatik iletilen son teyit ve bildirim kayıtları</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {automationLogs.length} Kayıt
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {automationLogs.map((log) => (
            <div key={log.id} className="p-3.5 hover:bg-slate-50 transition flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                {log.type === 'WHATSAPP' ? (
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Instagram className="w-4 h-4 text-pink-600" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.recipient}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {log.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.createdAt}</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{log.message}</p>
              </div>

              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                {log.status === 'DELIVERED' ? 'İletildi' : 'Gönderildi'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
