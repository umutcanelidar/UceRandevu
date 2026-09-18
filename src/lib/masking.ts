import { Role } from '@/types';

/**
 * BAGE Müşteri Bilgisi Gizlilik ve Maskeleme Kalkanı
 * Personelin müşteriyi dışarıya çekmesini / müşteri çalmasını önlemek amacıyla;
 * Rolü 'STAFF' olan kullanıcılara isim başharfiyle maskelenir ve telefon numarası gizlenir.
 * 'SPECIAL_ADMIN' (Yönetici) ve 'SUPER_ADMIN' tam açık veriyi görür.
 */

export function maskCustomerName(fullName: string, role: Role): string {
  if (role !== 'STAFF') {
    return fullName;
  }

  if (!fullName || typeof fullName !== 'string') return 'Müşteri';

  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    const name = parts[0];
    return name.length > 2 ? `${name.substring(0, 2)}***` : `${name}***`;
  }

  const firstName = parts[0];
  const lastParts = parts.slice(1);
  const maskedLastName = lastParts
    .map((p) => (p.length > 1 ? `${p.charAt(0)}***` : `${p}*`))
    .join(' ');

  return `${firstName} ${maskedLastName}`;
}

export function maskCustomerPhone(phone: string, role: Role): string {
  if (role !== 'STAFF') {
    return phone;
  }

  if (!phone) return 'Gizli';

  // Sadece son 2 hanesini göster, geri kalanını yıldızla
  const clean = phone.replace(/\s+/g, '');
  if (clean.length >= 7) {
    const prefix = clean.substring(0, 4);
    const suffix = clean.substring(clean.length - 2);
    return `${prefix} *** ** ${suffix}`;
  }

  return '•••••••••• (Yetki Yok)';
}
