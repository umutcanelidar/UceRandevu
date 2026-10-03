'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  Staff,
  StaffLeaveRecord,
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
  templateBeautyServices,
} from '@/lib/store';
import { maskCustomerName, maskCustomerPhone } from '@/lib/masking';
import { db } from '@/lib/supabaseSync';

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
  deleteAppointment: (id: string) => void;
  
  // CRM
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Packages
  addPackageDefinition: (pkg: Omit<PackageDefinition, 'id' | 'tenantId'>) => void;
  updatePackageDefinition: (id: string, pkg: Partial<PackageDefinition>) => void;
  deletePackageDefinition: (id: string) => void;
  buyCustomerPackage: (
    customerId: string,
    packageId: string,
    paymentMethod: 'CASH' | 'CREDIT_CARD' | 'HAVALE'
  ) => void;
  usePackageSession: (customerPackageId: string) => void;

  // Retail POS
  addRetailProduct: (prod: Omit<RetailProduct, 'id' | 'tenantId'>) => void;
  updateRetailProduct: (id: string, prod: Partial<RetailProduct>) => void;
  deleteRetailProduct: (id: string) => void;
  recordProductSale: (
    sale: Omit<ProductSale, 'id' | 'createdAt' | 'tenantId' | 'staffName'>
  ) => void;

  // Inventory
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'tenantId'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  updateInventoryStock: (itemId: string, newQuantity: number) => void;

  // Waitlist
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'tenantId'>) => void;
  updateWaitlistStatus: (id: string, status: WaitlistEntry['status']) => void;

  // Finance & Transactions
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt' | 'tenantId'>) => void;
  deleteTransaction: (id: string) => void;
  
  // Staff & Leave & Salaries
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  toggleStaffServicePermission: (id: string) => void;
  toggleStaffOffDay: (staffId: string, dayNumber: number) => void;
  addStaffLeaveDate: (staffId: string, dateStr: string) => void;
  removeStaffLeaveDate: (staffId: string, dateStr: string) => void;
  addStaffLeaveRecord: (staffId: string, leave: Omit<StaffLeaveRecord, 'id'>) => void;
  deleteStaffLeaveRecord: (staffId: string, recordId: string) => void;

  // Services
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Business & SaaS Helpers
  updateTenant: (tenantData: Partial<Tenant>) => void;
  loadStoreBySlug: (slug: string) => Promise<Tenant | null>;
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  loadTemplateServices: () => void;
  resetAllData: () => void;
  logout: () => void;

  // Communication
  sendWhatsAppMessage: (phone: string, message: string) => void;
  openWhatsAppChat: (phone: string, message: string) => void;
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
  const [isHydrated, setIsHydrated] = useState(false);

  // Default active user is SPECIAL_ADMIN (Salon Sahibi / Yönetici)
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 'admin-1',
    name: 'Salon Sahibi (Yönetici)',
    role: 'SPECIAL_ADMIN',
  });

  // Client-side LocalStorage Hydration (Sayfa yenilendiğinde veriler kalıcı kalsın)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTenant = localStorage.getItem('uce_tenant');
      const savedStaff = localStorage.getItem('uce_staffList');
      const savedServices = localStorage.getItem('uce_services');
      const savedCustomers = localStorage.getItem('uce_customers');
      const savedPackages = localStorage.getItem('uce_packages');
      const savedCustomerPackages = localStorage.getItem('uce_customerPackages');
      const savedRetailProducts = localStorage.getItem('uce_retailProducts');
      const savedProductSales = localStorage.getItem('uce_productSales');
      const savedInventory = localStorage.getItem('uce_inventoryItems');
      const savedWaitlist = localStorage.getItem('uce_waitlist');
      const savedAppointments = localStorage.getItem('uce_appointments');
      const savedTransactions = localStorage.getItem('uce_transactions');
      const savedAutomationLogs = localStorage.getItem('uce_automationLogs');
      const savedCurrentUser = localStorage.getItem('uce_current_user');

      if (savedTenant) setTenant(JSON.parse(savedTenant));
      if (savedStaff) setStaffList(JSON.parse(savedStaff));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedPackages) setPackages(JSON.parse(savedPackages));
      if (savedCustomerPackages) setCustomerPackages(JSON.parse(savedCustomerPackages));
      if (savedRetailProducts) setRetailProducts(JSON.parse(savedRetailProducts));
      if (savedProductSales) setProductSales(JSON.parse(savedProductSales));
      if (savedInventory) setInventoryItems(JSON.parse(savedInventory));
      if (savedWaitlist) setWaitlist(JSON.parse(savedWaitlist));
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      if (savedAutomationLogs) setAutomationLogs(JSON.parse(savedAutomationLogs));
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
    } catch (e) {
      console.warn('LocalStorage okuma hatası:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Cloud Supabase Veri Çekme & Realtime Canlı Takvim Dinleyici
  useEffect(() => {
    if (!isHydrated || !tenant.id) return;

    // Buluttan randevuları getir
    db.getAppointments(tenant.id).then((apts) => {
      if (apts && apts.length > 0) {
        setAppointments(apts);
      }
    });

    // Buluttan hizmetleri getir
    db.getServices(tenant.id).then((srvs) => {
      if (srvs && srvs.length > 0) {
        setServices(srvs);
      }
    });

    // Buluttan personelleri getir
    db.getStaff(tenant.id).then((st) => {
      if (st && st.length > 0) {
        setStaffList(st);
      }
    });

    // Buluttan müşterileri getir
    db.getCustomers(tenant.id).then((custs) => {
      if (custs && custs.length > 0) {
        setCustomers(custs);
      }
    });

    // Realtime aboneliği (farklı cihazdan randevu gelince anında ekrana düşer)
    const unsubscribe = db.subscribeToAppointments(tenant.id, () => {
      db.getAppointments(tenant.id).then((apts) => {
        if (apts) setAppointments(apts);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isHydrated, tenant.id]);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem('uce_tenant', JSON.stringify(tenant));
      localStorage.setItem('uce_staffList', JSON.stringify(staffList));
      localStorage.setItem('uce_services', JSON.stringify(services));
      localStorage.setItem('uce_customers', JSON.stringify(customers));
      localStorage.setItem('uce_packages', JSON.stringify(packages));
      localStorage.setItem('uce_customerPackages', JSON.stringify(customerPackages));
      localStorage.setItem('uce_retailProducts', JSON.stringify(retailProducts));
      localStorage.setItem('uce_productSales', JSON.stringify(productSales));
      localStorage.setItem('uce_inventoryItems', JSON.stringify(inventoryItems));
      localStorage.setItem('uce_waitlist', JSON.stringify(waitlist));
      localStorage.setItem('uce_appointments', JSON.stringify(appointments));
      localStorage.setItem('uce_transactions', JSON.stringify(transactions));
      localStorage.setItem('uce_automationLogs', JSON.stringify(automationLogs));
      localStorage.setItem('uce_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('LocalStorage yazma hatası:', e);
    }
  }, [
    isHydrated,
    tenant,
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
    currentUser,
  ]);

  const switchUser = (role: Role, staffCode?: string) => {
    if (role === 'SPECIAL_ADMIN' || role === 'SUPER_ADMIN') {
      const adminUser: CurrentUser = {
        id: 'admin-1',
        name: 'Salon Sahibi (Yönetici)',
        role,
      };
      setCurrentUser(adminUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('uce_current_user', JSON.stringify(adminUser));
      }
    } else if (role === 'STAFF') {
      const staff = staffList.find((s) => s.staffCode === staffCode);
      if (staff) {
        const staffUser: CurrentUser = {
          id: staff.id,
          name: staff.name,
          role: 'STAFF',
          staffId: staff.staffCode,
          staffRecordId: staff.id,
        };
        setCurrentUser(staffUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('uce_current_user', JSON.stringify(staffUser));
        }
      }
    }
  };

  const logout = () => {
    const defaultUser: CurrentUser = {
      id: 'admin-1',
      name: 'Salon Sahibi (Yönetici)',
      role: 'SPECIAL_ADMIN',
    };
    setCurrentUser(defaultUser);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('uce_current_user');
    }
  };

  const updateTenant = (tenantData: Partial<Tenant>) => {
    setTenant((prev) => {
      const updated = { ...prev, ...tenantData };
      db.upsertTenant(updated);
      return updated;
    });
  };

  const loadStoreBySlug = async (slug: string): Promise<Tenant | null> => {
    const cleanSlug = slug.toLowerCase().trim();
    const cloudTenant = await db.getTenantBySlug(cleanSlug);
    if (cloudTenant) {
      setTenant(cloudTenant);
      const [cloudServices, cloudStaff, cloudApts] = await Promise.all([
        db.getServices(cloudTenant.id),
        db.getStaff(cloudTenant.id),
        db.getAppointments(cloudTenant.id),
      ]);
      if (cloudServices && cloudServices.length > 0) setServices(cloudServices);
      if (cloudStaff && cloudStaff.length > 0) setStaffList(cloudStaff);
      if (cloudApts && cloudApts.length > 0) setAppointments(cloudApts);
      return cloudTenant;
    }
    return null;
  };

  const loadTemplateServices = () => {
    setServices(templateBeautyServices);
    if (tenant.id) {
      db.saveServices(tenant.id, templateBeautyServices);
    }
  };

  const resetAllData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('uce_staffList');
      localStorage.removeItem('uce_services');
      localStorage.removeItem('uce_customers');
      localStorage.removeItem('uce_packages');
      localStorage.removeItem('uce_customerPackages');
      localStorage.removeItem('uce_retailProducts');
      localStorage.removeItem('uce_productSales');
      localStorage.removeItem('uce_inventoryItems');
      localStorage.removeItem('uce_waitlist');
      localStorage.removeItem('uce_appointments');
      localStorage.removeItem('uce_transactions');
      localStorage.removeItem('uce_automationLogs');
    }
    setStaffList([]);
    setServices([]);
    setCustomers([]);
    setPackages([]);
    setCustomerPackages([]);
    setRetailProducts([]);
    setProductSales([]);
    setInventoryItems([]);
    setWaitlist([]);
    setAppointments([]);
    setTransactions([]);
    setAutomationLogs([]);
  };

  const openWhatsAppChat = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  // Masking helpers
  const getMaskedName = (fullName: string) => maskCustomerName(fullName, currentUser.role);
  const getMaskedPhone = (phone: string) => maskCustomerPhone(phone, currentUser.role);

  // Kasa İşlemi Ekle
  const addTransaction = (txn: Omit<Transaction, 'id' | 'createdAt' | 'tenantId'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Randevu oluşturma & dinamik süre hesaplama & Kapora tahsilatı
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'whatsappReminderSent'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      whatsappReminderSent: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setAppointments((prev) => [newApt, ...prev]);
    db.insertAppointment(newApt);

    // Kapora alındıysa kasaya ciro/gelir olarak otomatik kaydet
    if (aptData.depositPaid && aptData.depositAmount > 0) {
      const payMethod = aptData.depositPaymentMethod === 'CASH'
        ? 'CASH'
        : aptData.depositPaymentMethod === 'HAVALE'
        ? 'HAVALE'
        : 'CREDIT_CARD';

      addTransaction({
        type: 'INCOME',
        category: 'Kapora Geliri',
        amount: aptData.depositAmount,
        paymentMethod: payMethod,
        description: `${aptData.customerName} - Randevu Kaporası (${aptData.date} ${aptData.startTime})`,
        staffId: aptData.staffId,
        appointmentId: newApt.id,
        date: aptData.date,
      });
    }

    // WhatsApp Otomasyon Bildirimi
    const staffObj = staffList.find((s) => s.id === aptData.staffId);
    const srvObj = services.find((s) => s.id === aptData.serviceId);
    const autoMsg = `Sayın ${aptData.customerName}, BAGE Nail Studio | Beaute'de ${aptData.date} saat ${aptData.startTime} için ${staffObj?.name || 'uzmanımız'} ile ${srvObj?.name || 'işlem'} randevunuz oluşturuldu. Detaylar ve değişiklik için bize yazabilirsiniz.`;

    sendWhatsAppMessage(aptData.customerPhone, autoMsg);

    return newApt;
  };

  // Randevu durum güncelleme & ödeme alma & paket seans düşme
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
            const finalCashAmount = apt.depositPaid ? Math.max(0, apt.price - apt.depositAmount) : apt.price;
            
            if (finalCashAmount > 0) {
              addTransaction({
                type: 'INCOME',
                category: 'Randevu Geliri',
                amount: finalCashAmount,
                paymentMethod: paymentMethod === 'CASH' ? 'CASH' : paymentMethod === 'HAVALE' ? 'HAVALE' : 'CREDIT_CARD',
                description: `${apt.customerName} - Randevu Kalan Ödeme Tutarı`,
                staffId: apt.staffId,
                appointmentId: apt.id,
                date: apt.date,
              });
            }

            // Müşteri CRM ziyaret ve harcama istatistiklerini güncelle
            setCustomers((prevCusts) =>
              prevCusts.map((c) => {
                if (c.id === apt.customerId || (apt.customerPhone && c.phone === apt.customerPhone)) {
                  return {
                    ...c,
                    totalVisits: (c.totalVisits || 0) + 1,
                    totalSpent: (c.totalSpent || 0) + apt.price,
                    lastVisitDate: apt.date,
                  };
                }
                return c;
              })
            );
          }

          return updated;
        }
        return apt;
      })
    );

    db.updateAppointmentStatus(id, status, paymentMethod);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    db.deleteAppointment(id);
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

  // Müşteri Ekle / Güncelle / Sil
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    db.insertCustomer(newCust);
    return newCust;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Paket Tanımları (CRUD)
  const addPackageDefinition = (pkg: Omit<PackageDefinition, 'id' | 'tenantId'>) => {
    const newPkg: PackageDefinition = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      tenantId: tenant.id,
    };
    setPackages((prev) => [...prev, newPkg]);
  };

  const updatePackageDefinition = (id: string, pkg: Partial<PackageDefinition>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...pkg } : p)));
  };

  const deletePackageDefinition = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
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
    const expiryDateStr = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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

  // Perakende Satış Ürünleri (CRUD)
  const addRetailProduct = (prod: Omit<RetailProduct, 'id' | 'tenantId'>) => {
    const newProd: RetailProduct = {
      ...prod,
      id: `prod-${Date.now()}`,
      tenantId: tenant.id,
    };
    setRetailProducts((prev) => [...prev, newProd]);
  };

  const updateRetailProduct = (id: string, prod: Partial<RetailProduct>) => {
    setRetailProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...prod } : p)));
  };

  const deleteRetailProduct = (id: string) => {
    setRetailProducts((prev) => prev.filter((p) => p.id !== id));
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

  // Sarf Malzemeleri (CRUD)
  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'tenantId'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      tenantId: tenant.id,
      lastRestockedAt: new Date().toISOString().split('T')[0],
    };
    setInventoryItems((prev) => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventoryItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...item } : i)));
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems((prev) => prev.filter((i) => i.id !== id));
  };

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

  // Personel & İzin & Maaş Yönetimi
  const addStaff = (staff: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${Date.now()}`,
      canPerformServices: staff.canPerformServices ?? true,
      baseSalary: staff.baseSalary ?? 30000,
      offDays: staff.offDays || [7],
      leaveDates: staff.leaveDates || [],
      leaveRecords: staff.leaveRecords || [],
    };
    setStaffList((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updatedStaff: Partial<Staff>) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedStaff } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStaffServicePermission = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, canPerformServices: s.canPerformServices === false ? true : false } : s
      )
    );
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

  const addStaffLeaveRecord = (staffId: string, leave: Omit<StaffLeaveRecord, 'id'>) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const newRecord: StaffLeaveRecord = {
            ...leave,
            id: `leave-${Date.now()}`,
          };
          const existingDates = s.leaveDates || [];
          const updatedDates = existingDates.includes(leave.date) ? existingDates : [...existingDates, leave.date];
          return {
            ...s,
            leaveRecords: [...(s.leaveRecords || []), newRecord],
            leaveDates: updatedDates,
          };
        }
        return s;
      })
    );
  };

  const deleteStaffLeaveRecord = (staffId: string, recordId: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const updatedRecords = (s.leaveRecords || []).filter((r) => r.id !== recordId);
          const updatedDates = updatedRecords.map((r) => r.date);
          return {
            ...s,
            leaveRecords: updatedRecords,
            leaveDates: updatedDates,
          };
        }
        return s;
      })
    );
  };

  // Hizmet Kataloğu (CRUD)
  const addService = (srv: Omit<Service, 'id'>) => {
    const newSrv: Service = { ...srv, id: `srv-${Date.now()}` };
    setServices((prev) => [...prev, newSrv]);
  };

  const updateService = (id: string, srv: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...srv } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
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
        deleteAppointment,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addPackageDefinition,
        updatePackageDefinition,
        deletePackageDefinition,
        buyCustomerPackage,
        usePackageSession,
        addRetailProduct,
        updateRetailProduct,
        deleteRetailProduct,
        recordProductSale,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        updateInventoryStock,
        addToWaitlist,
        updateWaitlistStatus,
        addTransaction,
        deleteTransaction,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffServicePermission,
        toggleStaffOffDay,
        addStaffLeaveDate,
        removeStaffLeaveDate,
        addStaffLeaveRecord,
        deleteStaffLeaveRecord,
        addService,
        updateService,
        deleteService,
        sendWhatsAppMessage,
        openWhatsAppChat,
        updateTenant,
        loadStoreBySlug,
        setServices,
        setStaffList,
        loadTemplateServices,
        resetAllData,
        logout,
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
