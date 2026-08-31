-- TITAN CAR & Multi-Tenant Automotive Platform
-- Supabase / PostgreSQL Schema Definition (Section 49 & 50)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES / DEALERSHIPS (Multi-tenant root)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Car Dealer',
    country TEXT NOT NULL DEFAULT 'Algeria',
    wilaya TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    google_maps_url TEXT,
    facebook_url TEXT,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    google_rating DECIMAL(2, 1) DEFAULT 5.0,
    review_count INTEGER DEFAULT 4,
    accent_color TEXT DEFAULT '#C62828',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT,
    year INTEGER,
    mileage INTEGER,
    fuel_type TEXT,
    transmission TEXT,
    engine TEXT,
    power INTEGER,
    fiscal_power INTEGER,
    doors INTEGER,
    seats INTEGER,
    body_type TEXT,
    color TEXT,
    interior_color TEXT,
    condition TEXT DEFAULT 'Très bon',
    price BIGINT, -- Stored in DZD
    currency TEXT DEFAULT 'DZD',
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD')),
    location TEXT,
    description TEXT,
    main_image TEXT,
    video_url TEXT,
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. VEHICLE IMAGES
CREATE TABLE IF NOT EXISTS vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. VEHICLE FEATURES & OPTIONS
CREATE TABLE IF NOT EXISTS vehicle_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE NOT NULL,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    feature_name TEXT NOT NULL,
    category TEXT DEFAULT 'Équipement',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. LEADS & INQUIRIES (CRM Foundation)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    vehicle_title TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    inquiry_type TEXT NOT NULL DEFAULT 'VEHICLE' CHECK (inquiry_type IN ('VEHICLE', 'PRICE_REQUEST', 'AVAILABILITY', 'VISIT', 'TRADE_IN', 'GENERAL')),
    message TEXT NOT NULL,
    preferred_contact TEXT DEFAULT 'WHATSAPP' CHECK (preferred_contact IN ('WHATSAPP', 'PHONE', 'EMAIL')),
    source TEXT DEFAULT 'website',
    campaign TEXT,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'IN_NEGOTIATION', 'VISIT_SCHEDULED', 'CLOSED_WON', 'CLOSED_LOST')),
    notes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. APPOINTMENTS (Showroom visits & test drives)
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SERVICES
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
    key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public can read published vehicles for any company
CREATE POLICY "Public can view vehicles" ON vehicles
    FOR SELECT USING (true);

-- Public can insert leads
CREATE POLICY "Public can insert leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Seed Initial Tenant: TITAN CAR (Khemis Miliana)
INSERT INTO companies (
    id, name, display_name, category, country, wilaya, city,
    latitude, longitude, google_rating, review_count,
    facebook_url, google_maps_url
) VALUES (
    'titan_car',
    'TITAN CAR',
    'TITAN CAR',
    'Car Dealer',
    'Algeria',
    'Aïn Defla',
    'Khemis Miliana',
    36.2641,
    2.1791,
    5.0,
    4,
    'https://www.facebook.com/people/TITAN-CARS/61557559393496/?sk=following',
    'https://maps.app.goo.gl/Zwi6PRFG7YErRP92A'
) ON CONFLICT (id) DO NOTHING;
