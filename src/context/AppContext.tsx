'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  Role,
} from '@/types';
import {
  initialTenant,
  initialStaff,
  initialServices,
  initialCustomers,
  initialPackages,
  initialCustomerPackages,
  initialRetailProducts,
  initialProductSales,
  initialInventoryItems,
  initialWaitlist,
  initialAppointments,
  initialTransactions,
  initialAutomationLogs,
} from '@/lib/store';
import { maskCustomerName, maskCustomerPhone } from '@/lib/masking';

interface CurrentUser {
  id: string;
  name: string;
  role: Role;
  staffId?: string; // e.g. "ST-01"
  staffRecordId?: string; // "staff-1"
}

interface AppContextType {
  tenant: Tenant;
  currentUser: CurrentUser;
  staffList: Staff[];
  services: Service[];
  customers: Customer[];
  packages: PackageDefinition[];
  customerPackages: CustomerPackage[];
  retailProducts: RetailProduct[];
  productSales: ProductSale[];
  inventoryItems: InventoryItem[];
  waitlist: WaitlistEntry[];
  appointments: Appointment[];
  transactions: Transaction[];
  automationLogs: AutomationLog[];
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Masking helpers
  getMaskedName: (fullName: string) => string;
  getMaskedPhone: (phone: string) => string;

  // Actions
  switchUser: (role: Role, staffCode?: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'whatsappReminderSent'>) => Appointment;
  updateAppointmentStatus: (
    id: string,
    status: Appointment['status'],
    paymentMethod?: Appointment['paymentMethod']
  ) => void;
  reassignAppointmentSpecialist: (appointmentId: string, newStaffId: string) => void;
  
  // CRM
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  
  // Packages
  buyCustomerPackage: (
    customerId: string,
    packageId: string,
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE'
  ) => void;
  usePackageSession: (customerPackageId: string) => void;

  // Retail POS
  recordProductSale: (
    sale: Omit<ProductSale, 'id' | 'createdAt' | 'tenantId' | 'staffName'>
  ) => void;

  // Inventory
  updateInventoryStock: (itemId: string, newQuantity: number) => void;

  // Waitlist
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'tenantId'>) => void;
  updateWaitlistStatus: (id: string, status: WaitlistEntry['status']) => void;

  // Finance & Transactions
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt' | 'tenantId'>) => void;
  
  // Staff & Leave
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  toggleStaffOffDay: (staffId: string, dayNumber: number) => void;
  addStaffLeaveDate: (staffId: string, dateStr: string) => void;
  removeStaffLeaveDate: (staffId: string, dateStr: string) => void;

  // Services
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;

  // Communication
  sendWhatsAppMessage: (phone: string, message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant>(initialTenant);
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [packages, setPackages] = useState<PackageDefinition[]>(initialPackages);
  const [customerPackages, setCustomerPackages] = useState<CustomerPackage[]>(initialCustomerPackages);
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>(initialRetailProducts);
  const [productSales, setProductSales] = useState<ProductSale[]>(initialProductSales);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(initialAutomationLogs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Default active user is SPECIAL_ADMIN (BAGE Salon Sahibi / Yönetici)
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 'admin-1',
    name: 'BAGE Salon Sahibi (Yönetici)',
    role: 'SPECIAL_ADMIN',
  });

  const switchUser = (role: Role, staffCode?: string) => {
    if (role === 'SPECIAL_ADMIN' || role === 'SUPER_ADMIN') {
      setCurrentUser({
        id: 'admin-1',
        name: 'BAGE Salon Sahibi (Yönetici)',
        role,
      });
    } else if (role === 'STAFF') {
      const staff = staffList.find((s) => s.staffCode === staffCode) || staffList[0];
      setCurrentUser({
        id: staff.id,
        name: staff.name,
        role: 'STAFF',
        staffId: staff.staffCode,
        staffRecordId: staff.id,
      });
    }
  };

  // Masking helpers
  const getMaskedName = (fullName: string) => maskCustomerName(fullName, currentUser.role);
  const getMaskedPhone = (phone: string) => maskCustomerPhone(phone, currentUser.role);

  // Randevu oluşturma & dinamik süre hesaplama
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'whatsappReminderSent'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      whatsappReminderSent: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setAppointments((prev) => [newApt, ...prev]);

    // WhatsApp Otomasyon Bildirimi
    const staffObj = staffList.find((s) => s.id === aptData.staffId);
    const srvObj = services.find((s) => s.id === aptData.serviceId);
    const autoMsg = `Sayın ${aptData.customerName}, BAGE Stüdyo'da ${aptData.date} saat ${aptData.startTime} için ${staffObj?.name || 'uzmanımız'} ile ${srvObj?.name || 'işlem'} randevunuz oluşturuldu. Detaylar ve iptal için bize yazabilirsiniz.`;

    sendWhatsAppMessage(aptData.customerPhone, autoMsg);

    return newApt;
  };

  // Randevu durum güncelleme & paket seans düşme
  const updateAppointmentStatus = (
    id: string,
    status: Appointment['status'],
    paymentMethod?: Appointment['paymentMethod']
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = {
            ...apt,
            status,
            paymentMethod: paymentMethod || apt.paymentMethod,
          };

          // Eğer işlem tamamlandıysa ve paket kullanıldıysa paketten 1 seans düş
          if (status === 'COMPLETED' && apt.usedPackageId) {
            usePackageSession(apt.usedPackageId);
          }

          // Eğer işlem tamamlandıysa ve ödeme alındıysa kasaya ciro olarak ekle
          if (status === 'COMPLETED' && paymentMethod && paymentMethod !== 'PACKAGE' && paymentMethod !== 'UNPAID') {
            addTransaction({
              type: 'INCOME',
              category: 'Randevu Geliri',
              amount: apt.price,
              paymentMethod: paymentMethod === 'CASH' ? 'CASH' : paymentMethod === 'HAVALE' ? 'HAVALE' : 'CREDIT_CARD',
              description: `${apt.customerName} - Randevu İşlem Geliri`,
              staffId: apt.staffId,
              appointmentId: apt.id,
              date: apt.date,
            });
          }

          return updated;
        }
        return apt;
      })
    );
  };

  // Uzman (Personel) Değişikliği
  const reassignAppointmentSpecialist = (appointmentId: string, newStaffId: string) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          const oldStaff = staffList.find((s) => s.id === apt.staffId);
          return {
            ...apt,
            staffId: newStaffId,
            specialistChangedFrom: oldStaff ? oldStaff.name : undefined,
          };
        }
        return apt;
      })
    );
  };

  // Müşteri Ekle / Güncelle
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  // Paket Satışı
  const buyCustomerPackage = (
    customerId: string,
    packageId: string,
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE'
  ) => {
    const cust = customers.find((c) => c.id === customerId);
    const pkg = packages.find((p) => p.id === packageId);
    if (!cust || !pkg) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const expiryDateStr = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 ay geçerli

    const newCustPkg: CustomerPackage = {
      id: `cpkg-${Date.now()}`,
      customerId: cust.id,
      customerName: cust.name,
      packageId: pkg.id,
      packageName: pkg.name,
      serviceId: pkg.serviceId,
      totalSessions: pkg.totalSessions,
      remainingSessions: pkg.totalSessions,
      purchasePrice: pkg.price,
      purchaseDate: todayStr,
      expiryDate: expiryDateStr,
      status: 'ACTIVE',
    };

    setCustomerPackages((prev) => [newCustPkg, ...prev]);

    // Kasaya ciro olarak ekle
    addTransaction({
      type: 'INCOME',
      category: 'Paket Satışı',
      amount: pkg.price,
      paymentMethod,
      description: `${cust.name} - ${pkg.name} Satışı`,
      date: todayStr,
    });
  };

  // Paketten 1 seans düşme
  const usePackageSession = (customerPackageId: string) => {
    setCustomerPackages((prev) =>
      prev.map((cp) => {
        if (cp.id === customerPackageId && cp.remainingSessions > 0) {
          const nextRemaining = cp.remainingSessions - 1;
          return {
            ...cp,
            remainingSessions: nextRemaining,
            status: nextRemaining === 0 ? 'COMPLETED' : 'ACTIVE',
          };
        }
        return cp;
      })
    );
  };

  // Perakende Ürün Satışı (Mini POS)
  const recordProductSale = (
    saleData: Omit<ProductSale, 'id' | 'createdAt' | 'tenantId' | 'staffName'>
  ) => {
    const staff = staffList.find((s) => s.id === saleData.staffId);
    const newSale: ProductSale = {
      ...saleData,
      id: `psale-${Date.now()}`,
      tenantId: tenant.id,
      staffName: staff ? staff.name : 'Genel Salon',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setProductSales((prev) => [newSale, ...prev]);

    // Perakende ürün stok miktarından düş
    setRetailProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === saleData.productId) {
          return {
            ...prod,
            stockQuantity: Math.max(0, prod.stockQuantity - saleData.quantity),
          };
        }
        return prod;
      })
    );

    // Kasaya ciro olarak ekle
    addTransaction({
      type: 'INCOME',
      category: 'Ürün Satışı',
      amount: saleData.totalPrice,
      paymentMethod: saleData.paymentMethod,
      description: `${saleData.productName} (${saleData.quantity} adet) Satışı - Satan: ${staff?.name || 'Salon'}`,
      staffId: saleData.staffId,
      productSaleId: newSale.id,
      date: saleData.date,
    });
  };

  // Sarf Malzeme Stok Güncelleme
  const updateInventoryStock = (itemId: string, newQuantity: number) => {
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(0, newQuantity),
              lastRestockedAt: new Date().toISOString().split('T')[0],
            }
          : item
      )
    );
  };

  // Bekleme Listesi
  const addToWaitlist = (entryData: Omit<WaitlistEntry, 'id' | 'createdAt' | 'tenantId'>) => {
    const newEntry: WaitlistEntry = {
      ...entryData,
      id: `wait-${Date.now()}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setWaitlist((prev) => [newEntry, ...prev]);
  };

  const updateWaitlistStatus = (id: string, status: WaitlistEntry['status']) => {
    setWaitlist((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
  };

  // Kasa İşlemleri
  const addTransaction = (txn: Omit<Transaction, 'id' | 'createdAt' | 'tenantId'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: `txn-${Date.now()}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  // Personel & İzin Yönetimi
  const addStaff = (staff: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${Date.now()}`,
      offDays: staff.offDays || [7],
      leaveDates: staff.leaveDates || [],
    };
    setStaffList((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updatedStaff: Partial<Staff>) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)));
  };

  const toggleStaffOffDay = (staffId: string, dayNumber: number) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const exists = s.offDays.includes(dayNumber);
          const nextOffDays = exists
            ? s.offDays.filter((d) => d !== dayNumber)
            : [...s.offDays, dayNumber];
          return { ...s, offDays: nextOffDays };
        }
        return s;
      })
    );
  };

  const addStaffLeaveDate = (staffId: string, dateStr: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId && !s.leaveDates.includes(dateStr)) {
          return { ...s, leaveDates: [...s.leaveDates, dateStr] };
        }
        return s;
      })
    );
  };

  const removeStaffLeaveDate = (staffId: string, dateStr: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, leaveDates: s.leaveDates.filter((d) => d !== dateStr) };
        }
        return s;
      })
    );
  };

  // Hizmet Kataloğu
  const addService = (srv: Omit<Service, 'id'>) => {
    const newSrv: Service = { ...srv, id: `srv-${Date.now()}` };
    setServices((prev) => [...prev, newSrv]);
  };

  const updateService = (id: string, srv: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...srv } : s)));
  };

  // WhatsApp Mesaj Gönderimi
  const sendWhatsAppMessage = (phone: string, message: string) => {
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      tenantId: tenant.id,
      type: 'WHATSAPP',
      recipient: phone,
      message,
      status: 'DELIVERED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAutomationLogs((prev) => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        tenant,
        currentUser,
        staffList,
        services,
        customers,
        packages,
        customerPackages,
        retailProducts,
        productSales,
        inventoryItems,
        waitlist,
        appointments,
        transactions,
        automationLogs,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        getMaskedName,
        getMaskedPhone,
        switchUser,
        addAppointment,
        updateAppointmentStatus,
        reassignAppointmentSpecialist,
        addCustomer,
        updateCustomer,
        buyCustomerPackage,
        usePackageSession,
        recordProductSale,
        updateInventoryStock,
        addToWaitlist,
        updateWaitlistStatus,
        addTransaction,
        addStaff,
        updateStaff,
        toggleStaffOffDay,
        addStaffLeaveDate,
        removeStaffLeaveDate,
        addService,
        updateService,
        sendWhatsAppMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
