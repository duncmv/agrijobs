-- AgriJobs Database Schema for Uganda Agricultural Job Platform
-- This schema supports user authentication, multiple organizations per user, and comprehensive job postings

-- Users table (authenticated users - job seekers, employers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('job_seeker', 'employer', 'admin')),
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table (farms, agribusinesses, cooperatives)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'individual_farm', 'cooperative', 'agribusiness', 'ngo', 'government', 'other'
    )),
    description TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Organization relationships (many-to-many with roles)
CREATE TABLE user_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'owner', 'manager', 'recruiter', 'viewer'
    )),
    is_primary BOOLEAN DEFAULT false, -- Primary organization for the user
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, organization_id)
);

-- Organization details table (extends organizations with farm-specific info)
CREATE TABLE organization_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    enterprise_type VARCHAR(50) NOT NULL CHECK (enterprise_type IN (
        'crop_farm', 'livestock_farm', 'mixed', 'apiculture', 'horticulture',
        'aquaculture', 'agro_forestry', 'sericulture', 'vermiculture',
        'entomology_based_agriculture', 'other'
    )),
    main_enterprises TEXT[] NOT NULL, -- Array of enterprises ranked by importance
    district VARCHAR(100) NOT NULL,
    sub_county VARCHAR(100) NOT NULL,
    parish VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    farm_size_acres DECIMAL(10,2) NOT NULL,
    farm_stage VARCHAR(20) NOT NULL CHECK (farm_stage IN ('planning', 'startup', 'growing', 'established')),
    contact_person_name VARCHAR(255) NOT NULL,
    contact_person_title VARCHAR(100) NOT NULL,
    whatsapp_contact VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id) -- One detail record per organization
);

-- Job postings table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    posted_by_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Job Details
    title VARCHAR(255) NOT NULL,
    total_workers_needed INTEGER NOT NULL CHECK (total_workers_needed > 0),
    description TEXT NOT NULL,
    job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'seasonal', 'contract')),
    contract_duration_months INTEGER CHECK (contract_duration_months > 0),
    expected_start_date DATE NOT NULL,
    working_hours VARCHAR(20) NOT NULL CHECK (working_hours IN ('day_shift', 'night_shift', 'rotational')),
    
    -- Worker Requirements
    gender_preference VARCHAR(10) NOT NULL CHECK (gender_preference IN ('male', 'female', 'either')),
    age_range_min INTEGER NOT NULL CHECK (age_range_min >= 16),
    age_range_max INTEGER NOT NULL CHECK (age_range_max <= 80),
    education_level VARCHAR(20) NOT NULL CHECK (education_level IN (
        'primary', 'secondary', 'certificate', 'diploma', 'degree', 'not_specified'
    )),
    work_experience_years INTEGER NOT NULL CHECK (work_experience_years >= 0),
    language_preference TEXT[] NOT NULL,
    technical_skills TEXT[] NOT NULL,
    special_certifications TEXT[] NOT NULL,
    soft_skills TEXT[] NOT NULL,
    
    -- Work Conditions & Benefits
    accommodation VARCHAR(20) NOT NULL CHECK (accommodation IN ('provided', 'not_provided')),
    electricity VARCHAR(20) NOT NULL CHECK (electricity IN ('available', 'not_available')),
    meals VARCHAR(20) NOT NULL CHECK (meals IN ('provided', 'not_provided')),
    salary_min_ugx INTEGER NOT NULL CHECK (salary_min_ugx >= 0),
    salary_max_ugx INTEGER NOT NULL CHECK (salary_max_ugx >= salary_min_ugx),
    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('mobile_money', 'bank_transfer', 'cash')),
    health_cover VARCHAR(20) NOT NULL CHECK (health_cover IN ('provided', 'not_provided')),
    transport_allowance VARCHAR(20) NOT NULL CHECK (transport_allowance IN ('provided', 'not_provided')),
    overtime_payments VARCHAR(20) NOT NULL CHECK (overtime_payments IN ('provided', 'not_provided')),
    bonus_payment VARCHAR(20) NOT NULL CHECK (bonus_payment IN ('provided', 'not_provided')),
    
    -- Additional Preferences
    religious_affiliation VARCHAR(20) NOT NULL CHECK (religious_affiliation IN ('christianity', 'islam', 'any')),
    nationality_preference TEXT[] NOT NULL,
    ethnic_background_preference TEXT[] NOT NULL,
    remarks TEXT,
    
    -- Job Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected')),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applications_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    job_seeker_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'
    )),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cover_letter TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(job_id, job_seeker_id) -- Prevent duplicate applications
);

-- Messages table for communication between employers and job seekers
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills lookup table for technical skills
CREATE TABLE technical_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'equipment', 'livestock', 'crop_production'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certifications lookup table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    issuing_authority VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job seeker profiles (extends users table)
CREATE TABLE job_seeker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] NOT NULL,
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    preferred_job_types TEXT[] NOT NULL,
    availability VARCHAR(20) NOT NULL CHECK (availability IN ('full_time', 'part_time', 'seasonal', 'internship')),
    resume_url TEXT,
    certifications TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and reporting views
CREATE VIEW job_analytics AS
SELECT 
    DATE_TRUNC('month', posted_at) as month,
    COUNT(*) as jobs_posted,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_jobs,
    AVG(salary_min_ugx) as avg_min_salary,
    AVG(salary_max_ugx) as avg_max_salary,
    COUNT(DISTINCT organization_id) as unique_organizations,
    COUNT(DISTINCT posted_by_user_id) as unique_posting_users
FROM jobs 
WHERE posted_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', posted_at)
ORDER BY month DESC;

-- Regional job distribution view
CREATE VIEW regional_jobs AS
SELECT 
    od.district,
    COUNT(j.id) as job_count,
    AVG(j.salary_min_ugx) as avg_min_salary,
    AVG(j.salary_max_ugx) as avg_max_salary
FROM organization_details od
JOIN jobs j ON od.organization_id = j.organization_id
WHERE j.status = 'approved' AND j.is_active = true
GROUP BY od.district
ORDER BY job_count DESC;

-- Skills in demand view
CREATE VIEW skills_in_demand AS
SELECT 
    unnest(technical_skills) as skill,
    COUNT(*) as demand_count
FROM jobs 
WHERE status = 'approved' AND is_active = true
GROUP BY unnest(technical_skills)
ORDER BY demand_count DESC;

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_active ON organizations(is_active);
CREATE INDEX idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_organizations_org_id ON user_organizations(organization_id);
CREATE INDEX idx_user_organizations_role ON user_organizations(role);
CREATE INDEX idx_organization_details_district ON organization_details(district);
CREATE INDEX idx_jobs_status_active ON jobs(status, is_active);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at);
CREATE INDEX idx_jobs_organization_id ON jobs(organization_id);
CREATE INDEX idx_jobs_posted_by_user_id ON jobs(posted_by_user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_job_seeker_id ON applications(job_seeker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_job_id ON messages(job_id);

-- Sample data insertion queries
INSERT INTO technical_skills (name, category) VALUES
('Tractor Operation', 'equipment'),
('Livestock Management', 'livestock'),
('Coffee Processing', 'crop_production'),
('Irrigation Systems', 'equipment'),
('Animal Health', 'livestock'),
('Crop Monitoring', 'crop_production'),
('Equipment Maintenance', 'equipment'),
('Organic Farming', 'crop_production'),
('Dairy Processing', 'livestock'),
('Pest Management', 'crop_production');

INSERT INTO certifications (name, issuing_authority) VALUES
('Pesticide Applicator License', 'Ministry of Agriculture'),
('Driving License', 'Uganda Revenue Authority'),
('Animal Handling Certificate', 'Uganda Veterinary Association'),
('Food Safety Certificate', 'Uganda National Bureau of Standards'),
('First Aid Certificate', 'Uganda Red Cross Society');

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_details_updated_at BEFORE UPDATE ON organization_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON job_seeker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
