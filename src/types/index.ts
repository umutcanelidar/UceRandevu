export type Role = 'SUPER_ADMIN' | 'SPECIAL_ADMIN' | 'STAFF';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  city?: string;
  currency: string;
  logoUrl?: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
  whatsappConnected: boolean;
  whatsappNumber?: string;
  instagramConnected: boolean;
  instagramHandle?: string;
  monthlyTarget: number; // Aylık Hedef Ciro (örn: 150.000 ₺)
  dailyTarget: number;   // Günlük Hedef Ciro (örn: 6.000 ₺)
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  staffId?: string;
}

export interface StaffLeaveRecord {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: 'PAID' | 'UNPAID' | 'SICK'; // Ücretli, Ücretsiz, Hastalık/Rapor
  notes?: string;
}

export interface Staff {
  id: string;
  tenantId: string;
  staffCode: string; // "ST-01", "ST-02"
  name: string;
  title: string; // "Kıdemli Protez Tırnak Uzmanı", "Nail Artist", "Medikal Pedikürist"
  phone: string;
  pinCode?: string; // Personel Giriş PIN Kodu (örn: "1234")
  avatarColor: string;
  isActive: boolean;
  canPerformServices?: boolean; // Personel işlem yapma yetkisi (aç/kapa)
  baseSalary?: number; // Sabit aylık maaş (TL)
  commissionRate: number; // Prim oranı (%)
  workingHours: {
    start: string; // "09:00"
    end: string;   // "19:00"
    days: number[]; // [1, 2, 3, 4, 5, 6] (1=Pzt ... 7=Paz)
  };
  offDays: number[]; // Haftalık izin günleri [7] (Pazar) veya [1] (Pazartesi)
  leaveDates: string[]; // Özel izin tarihleri: ["2026-09-22", "2026-09-23"]
  leaveRecords?: StaffLeaveRecord[]; // Detaylı izin kayıtları
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  category: string; // "Protez Tırnak", "Kalıcı Oje", "Manikür/Pedikür", "Kaş/Kirpik", "Cilt Bakımı"
  durationMinutes: number; // 30, 45, 60, 90 dk
  price: number;
  description?: string;
  isActive: boolean;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  birthDate?: string; // "YYYY-MM-DD"
  notes?: string; // Tırnak alerjisi, hassasiyet, renk tercihleri vb.
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string; // "YYYY-MM-DD"
  depositStatus: 'NONE' | 'PAID' | 'WAITING';
  depositAmount: number;
  favoriteStaffId?: string;
  createdAt: string;
}

export interface PackageDefinition {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  totalSessions: number; // örn: 5 seans
  price: number; // Paket satış fiyatı
  serviceId: string; // Hangi hizmet için geçerli
  description: string;
  isActive: boolean;
}

export interface CustomerPackage {
  id: string;
  customerId: string;
  customerName: string;
  packageId: string;
  packageName: string;
  serviceId: string;
  totalSessions: number;
  remainingSessions: number;
  purchasePrice: number;
  purchaseDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
}

export interface RetailProduct {
  id: string;
  tenantId: string;
  name: string;
  category: string; // "Tırnak Bakım", "El/Ayak Kremi", "Kütikül Serumu", "Kozmetik"
  barcode?: string;
  salePrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number; // kritik stok eşiği (örn: 3)
  unit: string; // "adet", "şişe", "tüp"
}

export interface ProductSale {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  staffId: string; // Prim yazılacak personel
  staffName: string;
  customerId?: string;
  customerName?: string;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE';
  date: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  name: string;
  category: string; // "Jel Grubu", "Kalıcı Oje", "Sarf & Hijyen", "Alet & Uç"
  quantity: number;
  unit: string; // "kutu", "şişe", "adet", "litre"
  minThreshold: number; // altına düşünce alarm verecek sayı (örn: 3)
  lastRestockedAt: string;
}

export interface WaitlistEntry {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  requestedServiceId: string;
  requestedStaffId?: string;
  preferredDate: string; // "YYYY-MM-DD"
  preferredTimeSlot: string; // "Sabah (09:00-12:00)", "Öğle (12:00-16:00)", "Akşam (16:00-19:00)", "Fark Etmez"
  notes?: string;
  status: 'WAITING' | 'CONTACTED' | 'BOOKED' | 'CANCELLED';
  createdAt: string;
}

export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  staffId: string; // References Staff.id
  serviceId: string; // References Service.id
  date: string; // "YYYY-MM-DD"
  startTime: string; // "14:00"
  endTime: string; // "15:30" (işlem süresine göre otomatik hesaplanır)
  status: AppointmentStatus;
  notes?: string;
  price: number;
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'HAVALE' | 'PACKAGE' | 'UNPAID';
  depositAmount: number;
  depositPaid: boolean;
  depositPaymentMethod?: 'CASH' | 'CREDIT_CARD' | 'HAVALE';
  usedPackageId?: string; // Seans hakkından düşüldüyse paket ID
  specialistChangedFrom?: string; // Eski personelin adı/kodu
  whatsappReminderSent: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  type: 'INCOME' | 'EXPENSE';
  category: string; // "Randevu Geliri", "Ürün Satışı", "Paket Satışı", "Kira", "Malzeme Alımı", "Mutfak", "Fatura", "Maaş/Prim"
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE';
  description: string;
  staffId?: string; // Personel cirosu için
  appointmentId?: string;
  productSaleId?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string;
}

export interface AutomationLog {
  id: string;
  tenantId: string;
  type: 'WHATSAPP' | 'INSTAGRAM' | 'SYSTEM_ALERT';
  recipient: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  createdAt: string;
}
