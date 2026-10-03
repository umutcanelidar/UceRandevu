import { supabase, isSupabaseConfigured } from './supabase';
import { Tenant, Appointment, Service, Staff, Customer, Transaction } from '@/types';

export const db = {
  // --- TENANTS ---
  async getTenantBySlug(slug: string): Promise<Tenant | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || 'İstanbul',
      currency: data.currency || '₺',
      plan: 'PRO',
      isActive: true,
      whatsappConnected: true,
      whatsappNumber: data.phone || '',
      instagramConnected: false,
      monthlyTarget: 150000,
      dailyTarget: 6000,
      createdAt: data.created_at,
    };
  },

  async upsertTenant(tenant: Tenant, adminPassword?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('tenants').upsert(
      {
        id: tenant.id,
        slug: tenant.slug.toLowerCase(),
        name: tenant.name,
        phone: tenant.phone || '',
        address: tenant.address || '',
        city: tenant.city || 'İstanbul',
        currency: tenant.currency || '₺',
        admin_password: adminPassword || '123456',
      },
      { onConflict: 'slug' }
    );
    return !error;
  },

  async verifyTenantLogin(slug: string, enteredPass: string): Promise<{ success: boolean; isFirstSetup?: boolean; tenant?: any }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true }; // Fallback to localStorage
    }

    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle();

    if (error) {
      return { success: false };
    }

    if (!data) {
      // First setup
      return { success: true, isFirstSetup: true };
    }

    return {
      success: data.admin_password === enteredPass,
      isFirstSetup: false,
      tenant: data,
    };
  },

  // --- APPOINTMENTS ---
  async getAppointments(tenantId: string): Promise<Appointment[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('date', { ascending: true });

    if (error || !data) return [];
    return data.map((d: any) => ({
      id: d.id,
      tenantId: d.tenant_id,
      customerId: d.customer_id,
      customerName: d.customer_name,
      customerPhone: d.customer_phone,
      staffId: d.staff_id,
      serviceId: d.service_id,
      date: d.date,
      startTime: d.start_time,
      endTime: d.end_time,
      status: d.status,
      price: Number(d.price),
      paymentMethod: d.payment_method,
      depositAmount: Number(d.deposit_amount || 0),
      depositPaid: Boolean(d.deposit_paid),
      depositPaymentMethod: d.deposit_payment_method,
      notes: d.notes || '',
      whatsappReminderSent: Boolean(d.whatsapp_reminder_sent),
      createdAt: d.created_at,
    }));
  },

  async insertAppointment(apt: Appointment): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('appointments').insert({
      id: apt.id,
      tenant_id: apt.tenantId,
      customer_id: apt.customerId || '',
      customer_name: apt.customerName,
      customer_phone: apt.customerPhone,
      staff_id: apt.staffId,
      service_id: apt.serviceId,
      date: apt.date,
      start_time: apt.startTime,
      end_time: apt.endTime,
      status: apt.status,
      price: apt.price,
      payment_method: apt.paymentMethod || 'UNPAID',
      deposit_amount: apt.depositAmount || 0,
      deposit_paid: Boolean(apt.depositPaid),
      deposit_payment_method: apt.depositPaymentMethod,
      notes: apt.notes || '',
      whatsapp_reminder_sent: Boolean(apt.whatsappReminderSent),
    });
    return !error;
  },

  async updateAppointmentStatus(
    id: string,
    status: Appointment['status'],
    paymentMethod?: Appointment['paymentMethod']
  ): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const updatePayload: any = { status };
    if (paymentMethod) {
      updatePayload.payment_method = paymentMethod;
    }
    const { error } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id);
    return !error;
  },

  async deleteAppointment(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    return !error;
  },

  // --- SERVICES ---
  async getServices(tenantId: string): Promise<Service[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error || !data) return [];
    return data.map((s: any) => ({
      id: s.id,
      tenantId: s.tenant_id,
      name: s.name,
      category: s.category,
      durationMinutes: s.duration_minutes,
      price: Number(s.price),
      description: s.description || '',
      isActive: Boolean(s.is_active),
    }));
  },

  async saveServices(tenantId: string, services: Service[]): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const rows = services.map((s) => ({
      id: s.id,
      tenant_id: tenantId,
      name: s.name,
      category: s.category,
      duration_minutes: s.durationMinutes,
      price: s.price,
      description: s.description || '',
      is_active: s.isActive ?? true,
    }));
    const { error } = await supabase.from('services').upsert(rows);
    return !error;
  },

  // --- STAFF ---
  async getStaff(tenantId: string): Promise<Staff[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error || !data) return [];
    return data.map((st: any) => ({
      id: st.id,
      tenantId: st.tenant_id,
      staffCode: st.staff_code || 'ST-01',
      name: st.name,
      title: st.title || 'Uzman',
      phone: st.phone || '',
      pinCode: st.pin_code || '1234',
      avatarColor: st.avatar_color || 'rose',
      isActive: Boolean(st.is_active),
      commissionRate: Number(st.commission_rate || 0),
      workingHours: {
        start: '00:00',
        end: '23:45',
        days: [1, 2, 3, 4, 5, 6, 7],
      },
      offDays: [],
      leaveDates: [],
    }));
  },

  async saveStaff(tenantId: string, staffList: Staff[]): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const rows = staffList.map((st) => ({
      id: st.id,
      tenant_id: tenantId,
      staff_code: st.staffCode,
      name: st.name,
      title: st.title,
      phone: st.phone || '',
      pin_code: st.pinCode || '1234',
      avatar_color: st.avatarColor || 'rose',
      is_active: st.isActive ?? true,
      commission_rate: st.commissionRate || 0,
    }));
    const { error } = await supabase.from('staff').upsert(rows);
    return !error;
  },

  // --- CUSTOMERS ---
  async getCustomers(tenantId: string): Promise<Customer[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error || !data) return [];
    return data.map((c: any) => ({
      id: c.id,
      tenantId: c.tenant_id,
      name: c.name,
      phone: c.phone,
      notes: c.notes || '',
      totalVisits: c.total_visits || 1,
      totalSpent: Number(c.total_spent || 0),
      lastVisitDate: new Date().toISOString().split('T')[0],
      depositStatus: 'NONE',
      depositAmount: 0,
      createdAt: c.created_at,
    }));
  },

  async insertCustomer(cust: Customer): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('customers').upsert({
      id: cust.id,
      tenant_id: cust.tenantId,
      name: cust.name,
      phone: cust.phone,
      notes: cust.notes || '',
      total_visits: cust.totalVisits || 1,
      total_spent: cust.totalSpent || 0,
    });
    return !error;
  },

  // --- REALTIME SUBSCRIPTIONS ---
  subscribeToAppointments(tenantId: string, onUpdate: () => void) {
    if (!isSupabaseConfigured || !supabase) return () => {};
    const channel = supabase
      .channel(`appointments-changes-${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },
};
