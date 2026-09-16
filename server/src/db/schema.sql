-- Auto Lead Collector - Enterprise Relational Database Schema
-- Compatible with PostgreSQL and SQLite

-- 1. Users & Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'Pro',
    max_searches_per_day INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. API Keys & Usage
CREATE TABLE IF NOT EXISTS api_keys (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    name TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    requests_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_usage_logs (
    id TEXT PRIMARY KEY,
    api_key_id TEXT REFERENCES api_keys(id),
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    ip_address TEXT,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Core Leads Repository
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    niche TEXT NOT NULL,
    industry TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    business_type TEXT NOT NULL,
    service_type TEXT,
    product_type TEXT,
    company_size TEXT DEFAULT 'Unknown',
    business_model TEXT DEFAULT 'B2B',
    business_stage TEXT DEFAULT 'Established',
    location_type TEXT DEFAULT 'Local',
    country TEXT NOT NULL,
    state TEXT,
    city TEXT NOT NULL,
    district TEXT,
    area TEXT,
    zip_code TEXT,
    address TEXT,
    service_area TEXT,
    website TEXT,
    has_website BOOLEAN DEFAULT FALSE,
    https_available BOOLEAN DEFAULT FALSE,
    custom_domain BOOLEAN DEFAULT TRUE,
    website_platform TEXT DEFAULT 'Custom Website',
    website_status TEXT DEFAULT 'Active',
    website_language TEXT DEFAULT 'English',
    public_email TEXT,
    has_email BOOLEAN DEFAULT FALSE,
    email_type TEXT,
    email_department TEXT DEFAULT 'General',
    email_status TEXT DEFAULT 'Unknown',
    is_disposable_email BOOLEAN DEFAULT FALSE,
    is_role_based_email BOOLEAN DEFAULT FALSE,
    domain_valid BOOLEAN DEFAULT FALSE,
    mx_available BOOLEAN DEFAULT FALSE,
    phone TEXT,
    has_phone BOOLEAN DEFAULT FALSE,
    has_contact_form BOOLEAN DEFAULT FALSE,
    business_status TEXT DEFAULT 'Active',
    social_profiles_json TEXT,
    has_social_profile BOOLEAN DEFAULT FALSE,
    lead_score INTEGER DEFAULT 0,
    score_tier TEXT DEFAULT 'Low Quality',
    score_breakdown_json TEXT,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL,
    first_discovered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_duplicate BOOLEAN DEFAULT FALSE,
    canonical_lead_id TEXT REFERENCES leads(id),
    data_completeness TEXT DEFAULT 'Partial Lead',
    tags_json TEXT DEFAULT '[]',
    notes TEXT DEFAULT '',
    is_saved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for instant multi-filter query performance
CREATE INDEX IF NOT EXISTS idx_leads_niche ON leads(niche);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_country ON leads(country);
CREATE INDEX IF NOT EXISTS idx_leads_city ON leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_leads_email_status ON leads(email_status);
CREATE INDEX IF NOT EXISTS idx_leads_is_duplicate ON leads(is_duplicate);
CREATE INDEX IF NOT EXISTS idx_leads_has_website ON leads(has_website);
CREATE INDEX IF NOT EXISTS idx_leads_has_email ON leads(has_email);
CREATE INDEX IF NOT EXISTS idx_leads_first_discovered ON leads(first_discovered);

-- 4. Search Jobs & Filter Presets
CREATE TABLE IF NOT EXISTS search_history (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    query_summary TEXT NOT NULL,
    filters_json TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS filter_presets (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    filter_state_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Exports
CREATE TABLE IF NOT EXISTS exports (
    id TEXT PRIMARY KEY,
    organization_id TEXT REFERENCES organizations(id),
    file_name TEXT NOT NULL,
    file_format TEXT NOT NULL,
    total_leads INTEGER NOT NULL,
    filter_snapshot_json TEXT,
    download_url TEXT,
    status TEXT DEFAULT 'Ready',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Compliance & Privacy Safeguards
CREATE TABLE IF NOT EXISTS opt_out_registry (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL, -- 'email', 'domain', 'business_name'
    value TEXT NOT NULL UNIQUE,
    reason TEXT,
    status TEXT DEFAULT 'Blocked',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS compliance_audit_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    user_email TEXT NOT NULL,
    details TEXT NOT NULL,
    ip_address TEXT,
    status TEXT NOT NULL DEFAULT 'Compliant',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
