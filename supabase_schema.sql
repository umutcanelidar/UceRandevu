-- ==========================================================
-- UCE RANDEVU - BULUT VERİTABANI ŞEMASI (SUPABASE POSTGRESQL)
-- ==========================================================

-- 1. İşletmeler (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    address TEXT DEFAULT '',
    city TEXT DEFAULT 'İstanbul',
    currency TEXT DEFAULT '₺',
    admin_password TEXT NOT NULL DEFAULT '123456',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hizmetler (Services)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price NUMERIC NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Personeller (Staff)
CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    staff_code TEXT DEFAULT 'ST-01',
    name TEXT NOT NULL,
    title TEXT DEFAULT 'Uzman',
    phone TEXT DEFAULT '',
    pin_code TEXT DEFAULT '1234',
    avatar_color TEXT DEFAULT 'rose',
    is_active BOOLEAN DEFAULT TRUE,
    commission_rate NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Randevular (Appointments - 7/24 Kesintisiz)
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    customer_id TEXT DEFAULT '',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    staff_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    date TEXT NOT NULL, -- 'YYYY-MM-DD'
    start_time TEXT NOT NULL, -- 'HH:MM'
    end_time TEXT NOT NULL, -- 'HH:MM'
    status TEXT NOT NULL DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
    price NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'UNPAID',
    deposit_amount NUMERIC DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT FALSE,
    deposit_payment_method TEXT,
    notes TEXT DEFAULT '',
    whatsapp_reminder_sent BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Müşteriler (Customers)
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    notes TEXT DEFAULT '',
    total_visits INTEGER DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Finans & Kasa Hareketleri (Transactions)
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'INCOME', 'EXPENSE'
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'CASH',
    description TEXT DEFAULT '',
    staff_id TEXT,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- GÜVENLİK VE ERİŞİM POLİTİKALARI (Row Level Security)
-- ==========================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tenants access" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public services access" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public staff access" ON staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public appointments access" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public customers access" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public transactions access" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================
-- CANLI BİLDİRİMLER (REALTIME SUBSCRIPTIONS)
-- ==========================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'appointments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
  END IF;
END $$;
