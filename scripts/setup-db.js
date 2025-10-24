#!/usr/bin/env node

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize database
function initializeDatabase() {
    try {
        console.log('🚀 Initializing AgriJobs Development Database...')
        console.log('📁 Database will be created at: ./dev.db')

        // Create tables (same as in database.ts)
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

        db.exec(`
      CREATE TABLE IF NOT EXISTS organization_details (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        enterprise_type TEXT NOT NULL CHECK (enterprise_type IN (
          'crop_farm', 'livestock_farm', 'mixed', 'apiculture', 'horticulture',
          'aquaculture', 'agro_forestry', 'sericulture', 'vermiculture',
          'entomology_based_agriculture', 'other'
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

        db.exec(`
      CREATE TABLE IF NOT EXISTS employee_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
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
        highest_education_level TEXT NOT NULL,
        qualifications TEXT,
        agricultural_training TEXT,
        languages_spoken TEXT NOT NULL,
        years_experience INTEGER NOT NULL,
        previous_job_roles TEXT NOT NULL,
        enterprise_types TEXT NOT NULL,
        crops_cared_for TEXT,
        livestock_cared_for TEXT,
        apiculture_products TEXT,
        horticulture_plants TEXT,
        aquaculture_species TEXT,
        agroforestry_species TEXT,
        sericulture_products TEXT,
        vermiculture_products TEXT,
        entomology_products TEXT,
        technical_skills TEXT NOT NULL,
        entrepreneurial_skills TEXT,
        specialized_skills TEXT,
        soft_skills TEXT NOT NULL,
        preferred_regions TEXT NOT NULL,
        work_type_desired TEXT NOT NULL,
        preferred_enterprise TEXT NOT NULL,
        expected_salary_min INTEGER NOT NULL,
        expected_salary_max INTEGER NOT NULL,
        willingness_relocate TEXT NOT NULL,
        willingness_remote TEXT NOT NULL,
        preferred_working_hours TEXT NOT NULL,
        employer_references TEXT,
        attachments TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id)
      )
    `)

        // Insert demo data
        const demoUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        demoUser.run(
            'demo-user-1',
            'demo@agrijobs.ug',
            '$2b$10$demo.hash.for.testing',
            'John',
            'Mukasa',
            '+256 700 123 456',
            'employer',
            1,
            1
        )

        // Insert admin user
        const adminUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        adminUser.run(
            'admin-user-1',
            'admin@agrijobs.ug',
            '$2b$10$admin.hash.for.testing',
            'Admin',
            'User',
            '+256 700 000 000',
            'admin',
            1,
            1
        )

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

        console.log('✅ Database setup complete!')
        console.log('')
        console.log('🔑 Demo Credentials:')
        console.log('   Employer: demo@agrijobs.ug / demo123')
        console.log('   Admin: admin@agrijobs.ug / admin123')
        console.log('')
        console.log('🏢 Demo Organization: Nakasero Organic Farms')
        console.log('')
        console.log('🌐 Start the development server with: npm run dev')
        console.log('📱 Then visit: http://localhost:3000')

        db.close()
        return true
    } catch (error) {
        console.error('❌ Database setup failed:', error)
        db.close()
        return false
    }
}

initializeDatabase()