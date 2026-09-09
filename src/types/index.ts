export type Role = 'SUPER_ADMIN' | 'SPECIAL_ADMIN' | 'STAFF';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  currency: string;
  logoUrl?: string;
  plan: 'STARTER' | 'PRO' | 'ENTERPRISE';
  isActive: boolean;
  whatsappConnected: boolean;
  whatsappNumber?: string;
  instagramConnected: boolean;
  instagramHandle?: string;
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  staffId?: string; // e.g. "ST-101"
}

export interface Staff {
  id: string;
  tenantId: string;
  staffCode: string; // e.g. "ST-101", "ST-102"
  name: string;
  title: string; // e.g. "Protez Tırnak Uzmanı", "Nail Artist"
  phone: string;
  avatarColor: string;
  isActive: boolean;
  commissionRate: number; // e.g. 20 (%)
  workingHours: {
    start: string; // "09:00"
    end: string;   // "19:00"
    days: number[]; // 1=Mon, 2=Tue, ..., 7=Sun
  };
}

export interface Service {
  id: string;
  tenantId: string;
  name: string;
  category: string; // "Tırnak", "Bakım", "Kirpik/Kaş", "Saç"
  durationMinutes: number; // e.g. 60, 90
  price: number;
  description?: string;
  isActive: boolean;
}

export type AppointmentStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Appointment {
  id: string;
  tenantId: string;
  customerName: string;
  customerPhone: string;
  staffId: string; // References Staff.id
  serviceId: string; // References Service.id
  date: string; // "YYYY-MM-DD"
  startTime: string; // "14:00"
  endTime: string; // "15:30"
  status: AppointmentStatus;
  notes?: string;
  price: number;
  paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'HAVALE' | 'UNPAID';
  whatsappReminderSent: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  tenantId: string;
  type: 'INCOME' | 'EXPENSE';
  category: string; // "Randevu Geliri", "Ürün Satışı", "Malzeme Alımı", "Kira", "Mutfak", "Fatura"
  amount: number;
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE';
  description: string;
  staffId?: string; // Optional commission attribution
  appointmentId?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: string;
}

export interface AutomationLog {
  id: string;
  tenantId: string;
  type: 'WHATSAPP' | 'INSTAGRAM';
  recipient: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  createdAt: string;
}
