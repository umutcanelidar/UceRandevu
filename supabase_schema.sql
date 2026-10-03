-- ==========================================================
-- UCE RANDEVU - SUPABASE VERİTABANI ŞEMASI (MULTI-TENANT)
-- ==========================================================

-- 1. İşletmeler (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    admin_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hizmetler (Services)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 30,
    price NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Personeller (Staff)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    services JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Randevular (Appointments)
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_id TEXT,
    service_name TEXT NOT NULL,
    staff_id TEXT,
    staff_name TEXT NOT NULL,
    date TEXT NOT NULL, -- 'YYYY-MM-DD'
    time TEXT NOT NULL, -- 'HH:MM' (00:00 - 23:45 7/24)
    duration INTEGER NOT NULL DEFAULT 30,
    price NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'pending', 'confirmed', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Müşteriler (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Finans / Kasa Hareketleri (Finance Transactions)
CREATE TABLE IF NOT EXISTS finance_transactions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'income' | 'expense'
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    description TEXT,
    date TEXT NOT NULL,
    payment_method TEXT DEFAULT 'Nakit',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- REALTIME YAYINI (Canlı Bildirimler İçin)
-- ==========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE staff;

-- ==========================================================
-- GÜVENLİK (Row Level Security - RLS)
-- ==========================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

-- Anonim ve Yetkili Okuma/Yazma Politikaları
-- (Herkes kendi tenant_id'sine göre veri çekebilir ve randevu yazabilir)
CREATE POLICY "Public read/write access for tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for staff" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for customers" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public read/write access for finance_transactions" ON finance_transactions FOR ALL USING (true) WITH CHECK (true);
