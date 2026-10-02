import {
  Tenant,
  Staff,
  Service,
  Customer,
  PackageDefinition,
  CustomerPackage,
  RetailProduct,
  ProductSale,
  InventoryItem,
  WaitlistEntry,
  Appointment,
  Transaction,
  AutomationLog,
} from '@/types';

// Tarih yardımcıları
const today = new Date().toISOString().split('T')[0];

// 52 gün önce (45 gün gelmeyen müşteri senaryosu için)
const fiftyTwoDaysAgo = new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
// 48 gün önce
const fortyEightDaysAgo = new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
// 10 gün önce
const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

// Tenant: BAGE Nail Studio | Beaute
export const initialTenant: Tenant = {
  id: 'tenant-bage',
  name: 'BAGE Nail Studio | Beaute',
  slug: 'bage-studio',
  phone: '+90 212 555 12 34',
  address: 'Teşvikiye Cad. No:28 D:4 Nişantaşı, Şişli / İstanbul',
  currency: '₺',
  logoUrl: '/bage-logo.jpg',
  plan: 'ENTERPRISE',
  isActive: true,
  whatsappConnected: true,
  whatsappNumber: '+90 532 999 88 77',
  instagramConnected: true,
  instagramHandle: '@bage.nailstudio',
  monthlyTarget: 180000, // 180.000 ₺ Aylık Hedef Ciro
  dailyTarget: 7500,     // 7.500 ₺ Günlük Hedef Ciro
  createdAt: '2026-01-01',
};

// BAGE Salon Ekibi
export const initialStaff: Staff[] = [
  {
    id: 'staff-1',
    tenantId: 'tenant-bage',
    staffCode: 'ST-01',
    name: 'Zeynep Kaya',
    title: 'Kıdemli Protez Tırnak & Nail Art Uzmanı',
    phone: '+90 533 111 22 33',
    avatarColor: 'bg-rose-500',
    isActive: true,
    canPerformServices: true,
    baseSalary: 35000,
    commissionRate: 40,
    workingHours: {
      start: '10:00',
      end: '20:00',
      days: [1, 2, 3, 4, 5, 6],
    },
    offDays: [7], // Pazar izinli
    leaveDates: [],
    leaveRecords: [],
  },
  {
    id: 'staff-2',
    tenantId: 'tenant-bage',
    staffCode: 'ST-02',
    name: 'Merve Demir',
    title: 'Nail Artist & Kalıcı Oje Uzmanı',
    phone: '+90 533 222 33 44',
    avatarColor: 'bg-purple-500',
    isActive: true,
    canPerformServices: true,
    baseSalary: 32000,
    commissionRate: 35,
    workingHours: {
      start: '10:00',
      end: '20:00',
      days: [1, 2, 3, 4, 5, 6],
    },
    offDays: [1], // Pazartesi izinli
    leaveDates: ['2026-09-22'], // Özel izinli gün
    leaveRecords: [
      {
        id: 'leave-1',
        date: '2026-09-22',
        type: 'UNPAID',
        notes: 'Özel iş izni (Ücretsiz)',
      },
    ],
  },
  {
    id: 'staff-3',
    tenantId: 'tenant-bage',
    staffCode: 'ST-03',
    name: 'Ayşe Yılmaz',
    title: 'Medikal Manikür & Pedikür Uzmanı',
    phone: '+90 533 333 44 55',
    avatarColor: 'bg-emerald-600',
    isActive: true,
    canPerformServices: true,
    baseSalary: 30000,
    commissionRate: 35,
    workingHours: {
      start: '10:00',
      end: '19:00',
      days: [2, 3, 4, 5, 6, 7],
    },
    offDays: [1], // Pazartesi izinli
    leaveDates: [],
    leaveRecords: [
      {
        id: 'leave-2',
        date: '2026-09-15',
        type: 'SICK',
        notes: 'Grip raporu (Raporlu)',
      },
    ],
  },
  {
    id: 'staff-4',
    tenantId: 'tenant-bage',
    staffCode: 'ST-04',
    name: 'Selin Arslan',
    title: 'Kaş Laminasyonu & İpek Kirpik Uzmanı',
    phone: '+90 533 444 55 66',
    avatarColor: 'bg-amber-500',
    isActive: true,
    canPerformServices: true,
    baseSalary: 30000,
    commissionRate: 35,
    workingHours: {
      start: '10:00',
      end: '20:00',
      days: [1, 3, 4, 5, 6, 7],
    },
    offDays: [2], // Salı izinli
    leaveDates: [],
    leaveRecords: [],
  },
];

// BAGE Hizmet Kataloğu
export const initialServices: Service[] = [
  {
    id: 'srv-1',
    tenantId: 'tenant-bage',
    name: 'Jel Protez Tırnak (Yeni Set)',
    category: 'Protez Tırnak',
    durationMinutes: 90,
    price: 850,
    description: 'Şablon uzatma, tipsiz jel mimarisi ve kombi manikür dahil.',
    isActive: true,
  },
  {
    id: 'srv-2',
    tenantId: 'tenant-bage',
    name: 'Jel Güçlendirme & Kalıcı Oje',
    category: 'Kalıcı Oje',
    durationMinutes: 60,
    price: 600,
    description: 'Doğal tırnak üzerine apex jel dolgusu ve 4 hafta kalıcı renk uygulaması.',
    isActive: true,
  },
  {
    id: 'srv-3',
    tenantId: 'tenant-bage',
    name: 'Kalıcı Oje & Kuru (Aparatif) Manikür',
    category: 'Manikür',
    durationMinutes: 45,
    price: 450,
    description: 'Kütikül temizliği, tırnak form verme ve tek ton kalıcı oje.',
    isActive: true,
  },
  {
    id: 'srv-4',
    tenantId: 'tenant-bage',
    name: 'Medikal Pedikür & Spa Bakımı',
    category: 'Manikür/Pedikür',
    durationMinutes: 60,
    price: 550,
    description: 'Topuk çatlak tedavisi, batık önleyici tırnak bakımı ve aromatik peeling.',
    isActive: true,
  },
  {
    id: 'srv-5',
    tenantId: 'tenant-bage',
    name: 'Kaş Laminasyonu & Botoks Bakım',
    category: 'Kaş/Kirpik',
    durationMinutes: 45,
    price: 500,
    description: 'Kaş form sabitleme, keratin botoks ve renk tonlama.',
    isActive: true,
  },
  {
    id: 'srv-6',
    tenantId: 'tenant-bage',
    name: 'İpek Kirpik (Volume Set)',
    category: 'Kaş/Kirpik',
    durationMinutes: 90,
    price: 750,
    description: 'Kişiye özel 3D-5D hacim kirpik uygulaması.',
    isActive: true,
  },
];

// BAGE Müşteri Portföyü (CRM & 45 Gün Alarm Örnekleri)
export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    tenantId: 'tenant-bage',
    name: 'Buse Yıldız',
    phone: '+90 532 111 22 33',
    birthDate: '1995-09-19', // Yarın doğum günü!
    notes: 'Kare form tırnak seviyor. Kütikülleri çok hassas, alev uç kullanılmalı.',
    totalVisits: 8,
    totalSpent: 4800,
    lastVisitDate: today,
    depositStatus: 'PAID',
    depositAmount: 200,
    favoriteStaffId: 'staff-1',
    createdAt: '2026-02-10',
  },
  {
    id: 'cust-2',
    tenantId: 'tenant-bage',
    name: 'Melis Kaya',
    phone: '+90 532 222 33 44',
    birthDate: '1992-11-04',
    notes: 'Badem form jel güçlendirme tercih ediyor. Nude tonlar seviyor.',
    totalVisits: 5,
    totalSpent: 3200,
    lastVisitDate: tenDaysAgo,
    depositStatus: 'NONE',
    depositAmount: 0,
    favoriteStaffId: 'staff-2',
    createdAt: '2026-03-15',
  },
  {
    id: 'cust-3',
    tenantId: 'tenant-bage',
    name: 'Ezgi Çelik',
    phone: '+90 532 333 44 55',
    birthDate: '1988-04-12',
    notes: 'Jel tırnak yaptırmıştı. 52 gündür gelmedi! Acil bakım hatırlatması atılmalı.',
    totalVisits: 3,
    totalSpent: 1950,
    lastVisitDate: fiftyTwoDaysAgo, // 52 GÜNDÜR GELMEDİ! (45 gün alarmı)
    depositStatus: 'NONE',
    depositAmount: 0,
    favoriteStaffId: 'staff-1',
    createdAt: '2026-01-20',
  },
  {
    id: 'cust-4',
    tenantId: 'tenant-bage',
    name: 'Gizem Öztürk',
    phone: '+90 532 444 55 66',
    birthDate: '1996-07-25',
    notes: 'Kalıcı oje müşterisi. 48 gündür gelmedi, tırnakları uzamış olmalı.',
    totalVisits: 4,
    totalSpent: 2200,
    lastVisitDate: fortyEightDaysAgo, // 48 GÜNDÜR GELMEDİ! (45 gün alarmı)
    depositStatus: 'NONE',
    depositAmount: 0,
    favoriteStaffId: 'staff-3',
    createdAt: '2026-02-01',
  },
  {
    id: 'cust-5',
    tenantId: 'tenant-bage',
    name: 'Aslı Güneş',
    phone: '+90 532 555 66 77',
    birthDate: '1994-09-18', // BUGÜN DOĞUM GÜNÜ!
    notes: 'İpek kirpik ve kaş laminasyonu düzenli yaptırır.',
    totalVisits: 6,
    totalSpent: 4200,
    lastVisitDate: today,
    depositStatus: 'PAID',
    depositAmount: 250,
    favoriteStaffId: 'staff-4',
    createdAt: '2026-02-18',
  },
];

// BAGE Paket Tanımları
export const initialPackages: PackageDefinition[] = [
  {
    id: 'pkg-1',
    tenantId: 'tenant-bage',
    name: '5 Seans Kalıcı Oje & Manikür Paketi',
    category: 'Manikür',
    totalSessions: 5,
    price: 1900, // Tekil fiyat 2250 ₺ yerine avantajlı
    serviceId: 'srv-3',
    description: '5 seans boyunca istediğiniz renkte kalıcı oje ve kombi manikür.',
    isActive: true,
  },
  {
    id: 'pkg-2',
    tenantId: 'tenant-bage',
    name: '4 Seans Jel Güçlendirme & Bakım',
    category: 'Protez Tırnak',
    totalSessions: 4,
    price: 2100,
    serviceId: 'srv-2',
    description: 'Doğal tırnak boyunu koruyucu 4 aylık jel güçlendirme paketi.',
    isActive: true,
  },
  {
    id: 'pkg-3',
    tenantId: 'tenant-bage',
    name: '3 Seans Medikal Pedikür Spa Paketi',
    category: 'Manikür/Pedikür',
    totalSessions: 3,
    price: 1400,
    serviceId: 'srv-4',
    description: 'Ayak sağlığı ve çatlak bakımı içeren 3 seanslık medikal kür.',
    isActive: true,
  },
];

// Müşteriye Satılmış Aktif Paketler
export const initialCustomerPackages: CustomerPackage[] = [
  {
    id: 'cpkg-1',
    customerId: 'cust-2',
    customerName: 'Melis Kaya',
    packageId: 'pkg-1',
    packageName: '5 Seans Kalıcı Oje & Manikür Paketi',
    serviceId: 'srv-3',
    totalSessions: 5,
    remainingSessions: 3, // 2 seans kullanıldı, 3 kaldı!
    purchasePrice: 1900,
    purchaseDate: '2026-08-01',
    expiryDate: '2027-02-01',
    status: 'ACTIVE',
  },
];

// BAGE Perakende Satış Ürünleri (Mini POS)
export const initialRetailProducts: RetailProduct[] = [
  {
    id: 'prod-1',
    tenantId: 'tenant-bage',
    name: 'BAGE Doğal Kütikül & Tırnak Besleyici Yağ (30ml)',
    category: 'Tırnak Bakım',
    barcode: '8680001001',
    salePrice: 280,
    costPrice: 90,
    stockQuantity: 14,
    minStockThreshold: 4,
    unit: 'şişe',
  },
  {
    id: 'prod-2',
    tenantId: 'tenant-bage',
    name: 'Yoğun Nemlendirici El & Tırnak Maskesi Kremi (100ml)',
    category: 'El/Ayak Kremi',
    barcode: '8680001002',
    salePrice: 350,
    costPrice: 120,
    stockQuantity: 9,
    minStockThreshold: 3,
    unit: 'tüp',
  },
  {
    id: 'prod-3',
    tenantId: 'tenant-bage',
    name: 'Keratin Tırnak Güçlendirici Serum (15ml)',
    category: 'Tırnak Bakım',
    barcode: '8680001003',
    salePrice: 420,
    costPrice: 150,
    stockQuantity: 2, // KRİTİK STOK ALARMI! (Eşik: 3)
    minStockThreshold: 3,
    unit: 'şişe',
  },
  {
    id: 'prod-4',
    tenantId: 'tenant-bage',
    name: 'Lüks Kristal Cam Tırnak Törpüsü',
    category: 'Kozmetik',
    barcode: '8680001004',
    salePrice: 160,
    costPrice: 45,
    stockQuantity: 1, // KRİTİK STOK ALARMI! (Eşik: 3)
    minStockThreshold: 3,
    unit: 'adet',
  },
];

// Geçmiş Ürün Satışları
export const initialProductSales: ProductSale[] = [
  {
    id: 'psale-1',
    tenantId: 'tenant-bage',
    productId: 'prod-1',
    productName: 'BAGE Doğal Kütikül & Tırnak Besleyici Yağ (30ml)',
    quantity: 1,
    unitPrice: 280,
    totalPrice: 280,
    staffId: 'staff-1',
    staffName: 'Zeynep Kaya',
    customerName: 'Buse Yıldız',
    paymentMethod: 'CREDIT_CARD',
    date: today,
    createdAt: `${today} 12:30`,
  },
];

// Salon Sarf Malzemeleri (Stok & Envanter)
export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'inv-1',
    tenantId: 'tenant-bage',
    name: 'Rubber Base Coat Şeffaf (15ml)',
    category: 'Jel Grubu',
    quantity: 7,
    unit: 'şişe',
    minThreshold: 3,
    lastRestockedAt: '2026-09-10',
  },
  {
    id: 'inv-2',
    tenantId: 'tenant-bage',
    name: 'No-Wipe Parlak Top Coat (15ml)',
    category: 'Jel Grubu',
    quantity: 2, // KRİTİK ALARM!
    unit: 'şişe',
    minThreshold: 4,
    lastRestockedAt: '2026-09-01',
  },
  {
    id: 'inv-3',
    tenantId: 'tenant-bage',
    name: 'Clear Builder Jel (50g)',
    category: 'Jel Grubu',
    quantity: 1, // KRİTİK ALARM!
    unit: 'kutu',
    minThreshold: 3,
    lastRestockedAt: '2026-08-25',
  },
  {
    id: 'inv-4',
    tenantId: 'tenant-bage',
    name: 'Nitril Muayene Eldiveni Siyah (M Beden)',
    category: 'Sarf & Hijyen',
    quantity: 6,
    unit: 'kutu (100lü)',
    minThreshold: 2,
    lastRestockedAt: '2026-09-12',
  },
  {
    id: 'inv-5',
    tenantId: 'tenant-bage',
    name: 'Elmas Alev Manikür Freze Ucu (Kırmızı Kuşak)',
    category: 'Alet & Uç',
    quantity: 8,
    unit: 'adet',
    minThreshold: 4,
    lastRestockedAt: '2026-09-05',
  },
  {
    id: 'inv-6',
    tenantId: 'tenant-bage',
    name: 'Saf Aseton & Oje Çıkarıcı (5 Litre)',
    category: 'Sarf & Hijyen',
    quantity: 1, // KRİTİK ALARM!
    unit: 'bidon',
    minThreshold: 2,
    lastRestockedAt: '2026-08-20',
  },
];

// Bekleme Listesi (Waitlist)
export const initialWaitlist: WaitlistEntry[] = [
  {
    id: 'wait-1',
    tenantId: 'tenant-bage',
    customerName: 'Cansu Güler',
    customerPhone: '+90 535 777 88 99',
    requestedServiceId: 'srv-1', // Jel Protez
    requestedStaffId: 'staff-1', // Zeynep Kaya
    preferredDate: today,
    preferredTimeSlot: 'Öğle (12:00-16:00)',
    notes: 'Bugün 13:00-15:00 arası iptal olursa hemen gelebilir, Nişantaşı içinde çalışıyor.',
    status: 'WAITING',
    createdAt: `${today} 09:15`,
  },
  {
    id: 'wait-2',
    tenantId: 'tenant-bage',
    customerName: 'Derya Sönmez',
    customerPhone: '+90 536 888 99 00',
    requestedServiceId: 'srv-2', // Jel Güçlendirme
    preferredDate: today,
    preferredTimeSlot: 'Akşam (16:00-19:00)',
    notes: 'Uzman fark etmez, iş çıkışı gelebilir.',
    status: 'WAITING',
    createdAt: `${today} 10:00`,
  },
];

// Randevular (Bugünkü İşlemler & Süre Blokları)
export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    tenantId: 'tenant-bage',
    customerId: 'cust-1',
    customerName: 'Buse Yıldız',
    customerPhone: '+90 532 111 22 33',
    staffId: 'staff-1', // Zeynep Kaya
    serviceId: 'srv-1', // Jel Protez (90 dk)
    date: today,
    startTime: '10:00',
    endTime: '11:30',
    status: 'COMPLETED',
    price: 850,
    paymentMethod: 'CREDIT_CARD',
    depositAmount: 200,
    depositPaid: true,
    notes: 'Kare form, süt beyaz nude ton.',
    whatsappReminderSent: true,
    createdAt: `${today} 08:00`,
  },
  {
    id: 'apt-2',
    tenantId: 'tenant-bage',
    customerId: 'cust-5',
    customerName: 'Aslı Güneş',
    customerPhone: '+90 532 555 66 77',
    staffId: 'staff-4', // Selin Arslan
    serviceId: 'srv-5', // Kaş Laminasyonu (45 dk)
    date: today,
    startTime: '11:30',
    endTime: '12:15',
    status: 'CONFIRMED',
    price: 500,
    paymentMethod: 'UNPAID',
    depositAmount: 250,
    depositPaid: true,
    notes: 'Bugün doğum günü! Özel ikram yapılacak.',
    whatsappReminderSent: true,
    createdAt: `${today} 09:00`,
  },
  {
    id: 'apt-3',
    tenantId: 'tenant-bage',
    customerId: 'cust-2',
    customerName: 'Melis Kaya',
    customerPhone: '+90 532 222 33 44',
    staffId: 'staff-2', // Merve Demir
    serviceId: 'srv-3', // Kalıcı Oje (45 dk)
    date: today,
    startTime: '14:00',
    endTime: '14:45',
    status: 'CONFIRMED',
    price: 450,
    paymentMethod: 'PACKAGE', // Paketten düşecek
    depositAmount: 0,
    depositPaid: false,
    usedPackageId: 'cpkg-1',
    notes: 'Aktif 5 Seanslık Paketinden 1 seans kullanılacak (Kalan: 2 olacak).',
    whatsappReminderSent: true,
    createdAt: `${today} 09:30`,
  },
  {
    id: 'apt-4',
    tenantId: 'tenant-bage',
    customerName: 'Seda Akın',
    customerPhone: '+90 533 666 77 88',
    staffId: 'staff-3', // Ayşe Yılmaz
    serviceId: 'srv-4', // Medikal Pedikür (60 dk)
    date: today,
    startTime: '16:00',
    endTime: '17:00',
    status: 'CONFIRMED',
    price: 550,
    paymentMethod: 'UNPAID',
    depositAmount: 150,
    depositPaid: true,
    notes: 'İlk gelişi. Topuk hassasiyeti var.',
    whatsappReminderSent: true,
    createdAt: `${today} 10:15`,
  },
];

// Finans: Ciro Gelirleri & Giderler (Net Kâr Hesabı İçin)
export const initialTransactions: Transaction[] = [
  // GELİRLER
  {
    id: 'txn-1',
    tenantId: 'tenant-bage',
    type: 'INCOME',
    category: 'Randevu Geliri',
    amount: 850,
    paymentMethod: 'CREDIT_CARD',
    description: 'Jel Protez Tırnak - Buse Yıldız (Uzman: Zeynep Kaya)',
    staffId: 'staff-1',
    appointmentId: 'apt-1',
    date: today,
    createdAt: `${today} 11:30`,
  },
  {
    id: 'txn-2',
    tenantId: 'tenant-bage',
    type: 'INCOME',
    category: 'Ürün Satışı',
    amount: 280,
    paymentMethod: 'CREDIT_CARD',
    description: 'BAGE Doğal Kütikül Yağı Satışı (Satan: Zeynep Kaya)',
    staffId: 'staff-1',
    productSaleId: 'psale-1',
    date: today,
    createdAt: `${today} 12:30`,
  },
  {
    id: 'txn-3',
    tenantId: 'tenant-bage',
    type: 'INCOME',
    category: 'Paket Satışı',
    amount: 1900,
    paymentMethod: 'HAVALE',
    description: '5 Seans Kalıcı Oje Paketi - Melis Kaya',
    staffId: 'staff-2',
    date: tenDaysAgo,
    createdAt: `${tenDaysAgo} 15:00`,
  },
  // GİDERLER (Kira, Malzeme, Fatura vb.)
  {
    id: 'txn-4',
    tenantId: 'tenant-bage',
    type: 'EXPENSE',
    category: 'Kira',
    amount: 35000,
    paymentMethod: 'HAVALE',
    description: 'Eylül Ayı Nişantaşı Salon Kirası',
    date: '2026-09-01',
    createdAt: '2026-09-01 10:00',
  },
  {
    id: 'txn-5',
    tenantId: 'tenant-bage',
    type: 'EXPENSE',
    category: 'Malzeme Alımı',
    amount: 8400,
    paymentMethod: 'CREDIT_CARD',
    description: 'Jel, Top Coat, Törpü ve Sarf Malzeme Toptan Siparişi',
    date: '2026-09-05',
    createdAt: '2026-09-05 14:00',
  },
  {
    id: 'txn-6',
    tenantId: 'tenant-bage',
    type: 'EXPENSE',
    category: 'Fatura & Aidat',
    amount: 3200,
    paymentMethod: 'HAVALE',
    description: 'Elektrik, Su ve Bina Aidatı',
    date: '2026-09-08',
    createdAt: '2026-09-08 11:00',
  },
  {
    id: 'txn-7',
    tenantId: 'tenant-bage',
    type: 'EXPENSE',
    category: 'Mutfak & İkram',
    amount: 950,
    paymentMethod: 'CASH',
    description: 'Müşteri Kahve Çekirdeği, İkramlık ve Su Alımı',
    date: today,
    createdAt: `${today} 09:30`,
  },
];

export const initialAutomationLogs: AutomationLog[] = [
  {
    id: 'log-1',
    tenantId: 'tenant-bage',
    type: 'WHATSAPP',
    recipient: '+90 532 111 22 33',
    message: 'Sayın Buse Yıldız, bugün saat 10:00 randevunuz onaylandı.',
    status: 'DELIVERED',
    createdAt: `${today} 08:05`,
  },
  {
    id: 'log-2',
    tenantId: 'tenant-bage',
    type: 'SYSTEM_ALERT',
    recipient: 'Yönetici Paneli',
    message: 'Kritik Stok Uyarısı: Clear Builder Jel (50g) ve No-Wipe Top Coat tükenmek üzere!',
    status: 'DELIVERED',
    createdAt: `${today} 09:00`,
  },
];
