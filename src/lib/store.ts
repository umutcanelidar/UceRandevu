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

// Temel Şablon İşletme Bilgisi
export const initialTenant: Tenant = {
  id: 'tenant-1',
  name: 'İşletme Randevu ve Yönetim Paneli',
  slug: 'yonetim',
  phone: '+90 500 000 00 00',
  address: 'İstanbul, Türkiye',
  currency: '₺',
  logoUrl: '/uce_logo.jpg',
  plan: 'ENTERPRISE',
  isActive: true,
  whatsappConnected: true,
  whatsappNumber: '',
  instagramConnected: false,
  instagramHandle: '',
  monthlyTarget: 100000,
  dailyTarget: 5000,
  createdAt: '2026-01-01',
};

// Hazır demo veriler kaldırıldı - Şablonlar temiz ve işletme sahibinin girişine hazır
export const initialStaff: Staff[] = [];
export const initialServices: Service[] = [];
export const initialCustomers: Customer[] = [];
export const initialPackages: PackageDefinition[] = [];
export const initialCustomerPackages: CustomerPackage[] = [];
export const initialRetailProducts: RetailProduct[] = [];
export const initialProductSales: ProductSale[] = [];
export const initialInventoryItems: InventoryItem[] = [];
export const initialWaitlist: WaitlistEntry[] = [];
export const initialAppointments: Appointment[] = [];
export const initialTransactions: Transaction[] = [];
export const initialAutomationLogs: AutomationLog[] = [];

// İsteğe bağlı olarak tek tıkla yüklenebilecek standart hizmet şablonu (Kullanıcı isterse yükler)
export const templateBeautyServices: Service[] = [
  {
    id: 'tpl-srv-1',
    tenantId: 'tenant-1',
    name: 'Jel Protez Tırnak (Yeni Set)',
    category: 'Protez Tırnak',
    durationMinutes: 90,
    price: 850,
    description: 'Şablon uzatma, jel mimarisi ve kombi manikür dahil.',
    isActive: true,
  },
  {
    id: 'tpl-srv-2',
    tenantId: 'tenant-1',
    name: 'Jel Güçlendirme & Kalıcı Oje',
    category: 'Kalıcı Oje',
    durationMinutes: 60,
    price: 600,
    description: 'Doğal tırnak üzerine apeks güçlendirme ve kalıcı oje.',
    isActive: true,
  },
  {
    id: 'tpl-srv-3',
    tenantId: 'tenant-1',
    name: 'Kuru Manikür & Kalıcı Oje',
    category: 'Manikür',
    durationMinutes: 45,
    price: 450,
    description: 'Kütikül temizliği ve kalıcı oje uygulaması.',
    isActive: true,
  },
  {
    id: 'tpl-srv-4',
    tenantId: 'tenant-1',
    name: 'Medikal Pedikür & Spa Bakımı',
    category: 'Pedikür',
    durationMinutes: 60,
    price: 550,
    description: 'Topuk ve tırnak medikal bakımı, peeling.',
    isActive: true,
  },
];
