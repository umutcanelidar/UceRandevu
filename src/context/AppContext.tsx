'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, Staff, Service, Appointment, Transaction, AutomationLog, Role } from '@/types';
import {
  initialTenant,
  initialStaff,
  initialServices,
  initialAppointments,
  initialTransactions,
  initialAutomationLogs,
} from '@/lib/store';

interface CurrentUser {
  id: string;
  name: string;
  role: Role;
  staffId?: string; // staff ID like "ST-101"
  staffRecordId?: string; // "staff-1"
}

interface AppContextType {
  tenant: Tenant;
  currentUser: CurrentUser;
  staffList: Staff[];
  services: Service[];
  appointments: Appointment[];
  transactions: Transaction[];
  automationLogs: AutomationLog[];
  switchUser: (role: Role, staffCode?: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'whatsappReminderSent'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status'], paymentMethod?: Appointment['paymentMethod']) => void;
  addTransaction: (txn: Omit<Transaction, 'id' | 'createdAt'>) => void;
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  addService: (srv: Omit<Service, 'id'>) => void;
  updateService: (id: string, srv: Partial<Service>) => void;
  sendWhatsAppMessage: (phone: string, message: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant>(initialTenant);
  const [staffList, setStaffList] = useState<Staff[]>(initialStaff);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(initialAutomationLogs);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Default active user is SPECIAL_ADMIN (Salon Owner)
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 'admin-1',
    name: 'Salon Sahibi (Admin)',
    role: 'SPECIAL_ADMIN',
  });

  const switchUser = (role: Role, staffCode?: string) => {
    if (role === 'SPECIAL_ADMIN') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Salon Sahibi (Admin)',
        role: 'SPECIAL_ADMIN',
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

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt' | 'whatsappReminderSent'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      whatsappReminderSent: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Send automated WhatsApp confirmation log
    const staffObj = staffList.find((s) => s.id === aptData.staffId);
    const srvObj = services.find((s) => s.id === aptData.serviceId);
    
    const autoMsg = `Sayın ${aptData.customerName}, ${aptData.date} saat ${aptData.startTime} için ${staffObj?.name || 'uzmanımız'} ile ${srvObj?.name || 'hizmet'} randevunuz oluşturuldu. Detaylar ve iptal için bize yazabilirsiniz.`;
    
    sendWhatsAppMessage(aptData.customerPhone, autoMsg);

    return newApt;
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment['status'],
    paymentMethod?: Appointment['paymentMethod']
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = { ...apt, status, paymentMethod: paymentMethod || apt.paymentMethod };

          // If marked as COMPLETED and has price, log automatically into Kasa (Transactions)
          if (status === 'COMPLETED' && apt.status !== 'COMPLETED') {
            const srv = services.find((s) => s.id === apt.serviceId);
            const staff = staffList.find((s) => s.id === apt.staffId);
            addTransaction({
              tenantId: apt.tenantId,
              type: 'INCOME',
              category: 'Randevu Geliri',
              amount: apt.price,
              paymentMethod: paymentMethod === 'UNPAID' || !paymentMethod ? 'CASH' : paymentMethod,
              description: `${apt.customerName} - ${srv?.name || 'Hizmet'} (${staff?.name || ''})`,
              staffId: apt.staffId,
              appointmentId: apt.id,
              date: apt.date,
            });

            // Send thank you message
            sendWhatsAppMessage(
              apt.customerPhone,
              `Sayın ${apt.customerName}, hizmetinizi tamamladık. Bizi tercih ettiğiniz için teşekkür ederiz, tekrar bekleriz! ⭐⭐⭐⭐⭐`
            );
          }

          return updated;
        }
        return apt;
      })
    );
  };

  const addTransaction = (txnData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTxn: Transaction = {
      ...txnData,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `staff-${Date.now()}`,
    };
    setStaffList((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const addService = (srvData: Omit<Service, 'id'>) => {
    const newSrv: Service = {
      ...srvData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newSrv]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

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
        appointments,
        transactions,
        automationLogs,
        switchUser,
        addAppointment,
        updateAppointmentStatus,
        addTransaction,
        addStaff,
        updateStaff,
        addService,
        updateService,
        sendWhatsAppMessage,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
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
