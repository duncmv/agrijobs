import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables based on our schema
export function initializeDatabase() {
    try {
        // Users table
        db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        role TEXT NOT NULL CHECK (role IN ('job_seeker', 'employer', 'admin')),
        email_verified INTEGER DEFAULT 0,
        email_verification_token TEXT,
        password_reset_token TEXT,
        password_reset_expires TEXT,
        last_login TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

        // Organizations table
        db.exec(`
      CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN (
          'individual_farm', 'cooperative', 'agribusiness', 'ngo', 'government', 'other'
        )),
        description TEXT,
        website TEXT,
        logo_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

        // User-Organization relationships
        db.exec(`
      CREATE TABLE IF NOT EXISTS user_organizations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        organization_id TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'recruiter', 'viewer')),
        is_primary INTEGER DEFAULT 0,
        joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE(user_id, organization_id)
      )
    `)

        // Organization details
        db.exec(`
      CREATE TABLE IF NOT EXISTS organization_details (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        enterprise_type TEXT NOT NULL CHECK (enterprise_type IN (
          'individual_farm', 'cooperative', 'agribusiness', 'ngo', 'government', 'other'
        )),
        main_enterprises TEXT NOT NULL,
        district TEXT NOT NULL,
        sub_county TEXT NOT NULL,
        parish TEXT NOT NULL,
        village TEXT NOT NULL,
        farm_size_acres REAL NOT NULL,
        farm_stage TEXT NOT NULL CHECK (farm_stage IN ('planning', 'startup', 'growing', 'established')),
        contact_person_name TEXT NOT NULL,
        contact_person_title TEXT NOT NULL,
        whatsapp_contact TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        UNIQUE(organization_id)
      )
    `)

        // Jobs table
        db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        posted_by_user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        total_workers_needed INTEGER NOT NULL CHECK (total_workers_needed > 0),
        description TEXT NOT NULL,
        job_type TEXT NOT NULL CHECK (job_type IN ('full_time', 'part_time', 'seasonal', 'contract')),
        contract_duration_months INTEGER CHECK (contract_duration_months > 0),
        expected_start_date TEXT NOT NULL,
        working_hours TEXT NOT NULL CHECK (working_hours IN ('day_shift', 'night_shift', 'rotational')),
        gender_preference TEXT NOT NULL CHECK (gender_preference IN ('male', 'female', 'either')),
        age_range_min INTEGER NOT NULL CHECK (age_range_min >= 16),
        age_range_max INTEGER NOT NULL CHECK (age_range_max <= 80),
        education_level TEXT NOT NULL CHECK (education_level IN (
          'primary', 'secondary', 'certificate', 'diploma', 'degree', 'not_specified'
        )),
        work_experience_years INTEGER NOT NULL CHECK (work_experience_years >= 0),
        language_preference TEXT NOT NULL,
        technical_skills TEXT NOT NULL,
        special_certifications TEXT NOT NULL,
        soft_skills TEXT NOT NULL,
        accommodation TEXT NOT NULL CHECK (accommodation IN ('provided', 'not_provided')),
        electricity TEXT NOT NULL CHECK (electricity IN ('available', 'not_available')),
        meals TEXT NOT NULL CHECK (meals IN ('provided', 'not_provided')),
        salary_min_ugx INTEGER NOT NULL CHECK (salary_min_ugx >= 0),
        salary_max_ugx INTEGER NOT NULL CHECK (salary_max_ugx >= salary_min_ugx),
        payment_mode TEXT NOT NULL CHECK (payment_mode IN ('mobile_money', 'bank_transfer', 'cash')),
        health_cover TEXT NOT NULL CHECK (health_cover IN ('provided', 'not_provided')),
        transport_allowance TEXT NOT NULL CHECK (transport_allowance IN ('provided', 'not_provided')),
        overtime_payments TEXT NOT NULL CHECK (overtime_payments IN ('provided', 'not_provided')),
        bonus_payment TEXT NOT NULL CHECK (bonus_payment IN ('provided', 'not_provided')),
        religious_affiliation TEXT NOT NULL CHECK (religious_affiliation IN ('christianity', 'islam', 'any')),
        nationality_preference TEXT NOT NULL,
        ethnic_background_preference TEXT NOT NULL,
        remarks TEXT,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected')),
        posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        applications_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (posted_by_user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

        // Applications table
        db.exec(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        job_seeker_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
          'pending', 'reviewed', 'shortlisted', 'rejected', 'hired'
        )),
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP,
        cover_letter TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (job_seeker_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(job_id, job_seeker_id)
      )
    `)

        // Employee profiles table
        db.exec(`
      CREATE TABLE IF NOT EXISTS employee_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        
        -- Section 1: Personal Information
        full_name TEXT NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
        date_of_birth TEXT NOT NULL,
        current_district TEXT NOT NULL,
        current_sub_county TEXT NOT NULL,
        current_parish TEXT NOT NULL,
        current_village TEXT NOT NULL,
        national_id TEXT,
        whatsapp_contact TEXT NOT NULL,
        email TEXT NOT NULL,
        working_profile_description TEXT NOT NULL,
        
        -- Section 2: Education & Training
        highest_education_level TEXT NOT NULL CHECK (highest_education_level IN (
          'primary', 'secondary', 'certificate', 'diploma', 'degree', 'masters', 'phd'
        )),
        relevant_certificates TEXT,
        agricultural_training TEXT,
        languages_spoken TEXT NOT NULL,
        
        -- Section 3: Work Experience
        years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
        previous_job_roles TEXT NOT NULL,
        enterprise_types TEXT NOT NULL,
        crops_cared_for TEXT,
        livestock_cared_for TEXT,
        apiculture_products TEXT,
        horticulture_plants TEXT,
        aquaculture_species TEXT,
        agroforestry_trees TEXT,
        sericulture_worms TEXT,
        vermiculture_activities TEXT,
        entomology_insects TEXT,
        employer_references TEXT,
        
        -- Section 4: Technical Competencies (JSON arrays with skill levels 1-3)
        technical_skills TEXT NOT NULL,
        pest_disease_management_level INTEGER CHECK (pest_disease_management_level BETWEEN 1 AND 3),
        organic_agriculture_level INTEGER CHECK (organic_agriculture_level BETWEEN 1 AND 3),
        apiculture_management_level INTEGER CHECK (apiculture_management_level BETWEEN 1 AND 3),
        livestock_husbandry_level INTEGER CHECK (livestock_husbandry_level BETWEEN 1 AND 3),
        vermiculture_techniques_level INTEGER CHECK (vermiculture_techniques_level BETWEEN 1 AND 3),
        farm_machinery_level INTEGER CHECK (farm_machinery_level BETWEEN 1 AND 3),
        soil_fertility_level INTEGER CHECK (soil_fertility_level BETWEEN 1 AND 3),
        horticulture_management_level INTEGER CHECK (horticulture_management_level BETWEEN 1 AND 3),
        agronomic_techniques_level INTEGER CHECK (agronomic_techniques_level BETWEEN 1 AND 3),
        entomology_agriculture_level INTEGER CHECK (entomology_agriculture_level BETWEEN 1 AND 3),
        post_harvest_level INTEGER CHECK (post_harvest_level BETWEEN 1 AND 3),
        aquaculture_techniques_level INTEGER CHECK (aquaculture_techniques_level BETWEEN 1 AND 3),
        agroforestry_management_level INTEGER CHECK (agroforestry_management_level BETWEEN 1 AND 3),
        greenhouse_nursery_level INTEGER CHECK (greenhouse_nursery_level BETWEEN 1 AND 3),
        sericulture_techniques_level INTEGER CHECK (sericulture_techniques_level BETWEEN 1 AND 3),
        climate_smart_level INTEGER CHECK (climate_smart_level BETWEEN 1 AND 3),
        
        -- Entrepreneurial and Management Skills
        marketing_sales_level INTEGER CHECK (marketing_sales_level BETWEEN 1 AND 3),
        value_addition_level INTEGER CHECK (value_addition_level BETWEEN 1 AND 3),
        record_keeping_level INTEGER CHECK (record_keeping_level BETWEEN 1 AND 3),
        farm_planning_level INTEGER CHECK (farm_planning_level BETWEEN 1 AND 3),
        hr_supervision_level INTEGER CHECK (hr_supervision_level BETWEEN 1 AND 3),
        scheduling_coordination_level INTEGER CHECK (scheduling_coordination_level BETWEEN 1 AND 3),
        
        -- Specialized Skills
        ict_agriculture_level INTEGER CHECK (ict_agriculture_level BETWEEN 1 AND 3),
        precision_agriculture_level INTEGER CHECK (precision_agriculture_level BETWEEN 1 AND 3),
        innovative_techniques_level INTEGER CHECK (innovative_techniques_level BETWEEN 1 AND 3),
        
        -- Soft Skills
        problem_solving_level INTEGER CHECK (problem_solving_level BETWEEN 1 AND 3),
        teamwork_level INTEGER CHECK (teamwork_level BETWEEN 1 AND 3),
        adaptability_level INTEGER CHECK (adaptability_level BETWEEN 1 AND 3),
        patience_level INTEGER CHECK (patience_level BETWEEN 1 AND 3),
        communication_level INTEGER CHECK (communication_level BETWEEN 1 AND 3),
        
        -- Section 5: Job Preferences
        work_type_desired TEXT NOT NULL CHECK (work_type_desired IN (
          'permanent', 'seasonal', 'internship', 'part_time'
        )),
        preferred_enterprise TEXT NOT NULL CHECK (preferred_enterprise IN (
          'crops', 'livestock', 'mixed', 'apiculture', 'horticulture', 'aquaculture', 'agroforestry', 'any'
        )),
        preferred_regions TEXT NOT NULL,
        expected_salary_min INTEGER NOT NULL CHECK (expected_salary_min >= 0),
        expected_salary_max INTEGER NOT NULL CHECK (expected_salary_max >= expected_salary_min),
        willingness_relocate TEXT NOT NULL CHECK (willingness_relocate IN ('yes', 'no')),
        willingness_remote TEXT NOT NULL CHECK (willingness_remote IN ('yes', 'no')),
        preferred_working_hours TEXT NOT NULL CHECK (preferred_working_hours IN (
          'day_shift', 'night_shift', 'rotational'
        )),
        deal_breaking_conditions TEXT,
        
        -- File attachments (JSON array of file paths/URLs)
        attachments TEXT,
        
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

        // Insert demo data
        insertDemoData()

        console.log('✅ Database initialized successfully!')
        return true
    } catch (error) {
        console.error('❌ Database initialization failed:', error)
        return false
    }
}

function insertDemoData() {
    try {
        // Insert demo user
        const demoUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        demoUser.run(
            'demo-user-1',
            'demo@agrijobs.ug',
            '$2b$10$demo.hash.for.testing', // In real app, this would be properly hashed
            'John',
            'Mukasa',
            '+256 700 123 456',
            'employer',
            1,
            1
        )

        // Insert demo organization
        const demoOrg = db.prepare(`
      INSERT OR IGNORE INTO organizations (id, name, type, description, website, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

        demoOrg.run(
            'demo-org-1',
            'Nakasero Organic Farms',
            'individual_farm',
            'Family-owned organic farm specializing in vegetables and sustainable farming practices.',
            'https://nakasero-farms.com',
            1
        )

        // Insert user-organization relationship
        const userOrg = db.prepare(`
      INSERT OR IGNORE INTO user_organizations (id, user_id, organization_id, role, is_primary)
      VALUES (?, ?, ?, ?, ?)
    `)

        userOrg.run(
            'demo-user-org-1',
            'demo-user-1',
            'demo-org-1',
            'owner',
            1
        )

        // Insert organization details
        const orgDetails = db.prepare(`
      INSERT OR IGNORE INTO organization_details (
        id, organization_id, enterprise_type, main_enterprises, district, sub_county, 
        parish, village, farm_size_acres, farm_stage, contact_person_name, 
        contact_person_title, whatsapp_contact, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        orgDetails.run(
            'demo-org-details-1',
            'demo-org-1',
            'mixed',
            JSON.stringify(['Organic Vegetables', 'Coffee', 'Dairy']),
            'Wakiso',
            'Nakasero',
            'Central',
            'Hill Road',
            25.5,
            'established',
            'John Mukasa',
            'Farm Manager',
            '+256 700 123 456',
            'john@nakasero-farms.com'
        )

        console.log('✅ Demo data inserted successfully!')
        console.log('✅ Database initialized successfully!')
    } catch (error) {
        console.error('❌ Demo data insertion failed:', error)
    }
}

export { db }
export default db

