import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables based on our schema
let isInitialized = false

export function initializeDatabase(force = false) {
    if (isInitialized && !force) {
        return true
    }

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

        // Insert demo data - DISABLED to prevent overwriting seeded data
        // insertDemoData()

        console.log('✅ Database initialized successfully!')
        isInitialized = true
        return true
    } catch (error) {
        console.error('❌ Database initialization failed:', error)
        return false
    }
}

function insertDemoData() {
    try {
        console.log('🌱 Starting demo data insertion...')
        // Insert Duncan Asiimwe as the main employer
        const duncanUser = db.prepare(`
            INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        duncanUser.run(
            'duncan-asiimwe-1',
            'duncan@agrijobs.ug',
            '$2b$10$demo.hash.for.testing', // In real app, this would be properly hashed
            'Duncan',
            'Asiimwe',
            '+256 700 123 456',
            'employer',
            1,
            1
        )

        // Insert demo admin user
        const demoAdmin = db.prepare(`
            INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        demoAdmin.run(
            'demo-admin-1',
            'admin@agrijobs.ug',
            '$2b$10$6VTgXepTHZ04lEL3cjmFL.7BRj2un/NZI/o3vAyZ.vvIkJ1NXgPFK', // Password: admin123
            'Admin',
            'User',
            '+256 700 000 000',
            'admin',
            1,
            1
        )

        // Insert multiple job seekers with employee profiles
        const jobSeekers = [
            {
                id: 'jobseeker-1',
                email: 'mary.nakato@email.com',
                firstName: 'Mary',
                lastName: 'Nakato',
                phone: '+256 700 111 111',
                profile: {
                    fullName: 'Mary Nakato',
                    gender: 'female',
                    dateOfBirth: '1995-03-15',
                    currentDistrict: 'Wakiso',
                    currentSubCounty: 'Entebbe',
                    currentParish: 'Central',
                    currentVillage: 'Airport Road',
                    whatsappContact: '+256 700 111 111',
                    email: 'mary.nakato@email.com',
                    workingProfileDescription: 'Experienced agricultural worker with 5 years in crop farming and livestock management.',
                    highestEducationLevel: 'certificate',
                    yearsExperience: 5,
                    workTypeDesired: 'permanent',
                    preferredEnterprise: 'mixed',
                    expectedSalaryMin: 800000,
                    expectedSalaryMax: 1200000,
                    willingnessRelocate: 'yes',
                    willingnessRemote: 'no',
                    preferredWorkingHours: 'day_shift',
                    technicalSkills: JSON.stringify(['tractor_operation', 'irrigation_systems', 'pest_management']),
                    languagesSpoken: JSON.stringify(['English', 'Luganda']),
                    relevantCertificates: JSON.stringify(['Agricultural Certificate', 'Tractor Operation License']),
                    agriculturalTraining: JSON.stringify(['Organic Farming', 'Livestock Management']),
                    previousJobRoles: JSON.stringify(['Farm Worker', 'Tractor Operator']),
                    enterpriseTypes: JSON.stringify(['crops', 'livestock']),
                    cropsCaredFor: JSON.stringify(['maize', 'beans', 'cassava']),
                    livestockCaredFor: JSON.stringify(['cattle', 'goats'])
                }
            },
            {
                id: 'jobseeker-2',
                email: 'peter.mukasa@email.com',
                firstName: 'Peter',
                lastName: 'Mukasa',
                phone: '+256 700 222 222',
                profile: {
                    fullName: 'Peter Mukasa',
                    gender: 'male',
                    dateOfBirth: '1988-07-22',
                    currentDistrict: 'Mukono',
                    currentSubCounty: 'Ntinda',
                    currentParish: 'Central',
                    currentVillage: 'Main Street',
                    whatsappContact: '+256 700 222 222',
                    email: 'peter.mukasa@email.com',
                    workingProfileDescription: 'Skilled horticulturist with expertise in greenhouse management and crop production.',
                    highestEducationLevel: 'diploma',
                    yearsExperience: 8,
                    workTypeDesired: 'permanent',
                    preferredEnterprise: 'horticulture',
                    expectedSalaryMin: 1000000,
                    expectedSalaryMax: 1500000,
                    willingnessRelocate: 'no',
                    willingnessRemote: 'no',
                    preferredWorkingHours: 'day_shift',
                    technicalSkills: JSON.stringify(['greenhouse_management', 'crop_production', 'soil_fertility']),
                    languagesSpoken: JSON.stringify(['English', 'Luganda', 'Swahili']),
                    relevantCertificates: JSON.stringify(['Diploma in Agriculture', 'Horticulture Certificate']),
                    agriculturalTraining: JSON.stringify(['Greenhouse Management', 'Crop Production']),
                    previousJobRoles: JSON.stringify(['Horticulturist', 'Greenhouse Manager']),
                    enterpriseTypes: JSON.stringify(['horticulture']),
                    horticulturePlants: JSON.stringify(['tomatoes', 'peppers', 'lettuce'])
                }
            },
            {
                id: 'jobseeker-3',
                email: 'grace.namukasa@email.com',
                firstName: 'Grace',
                lastName: 'Namukasa',
                phone: '+256 700 333 333',
                profile: {
                    fullName: 'Grace Namukasa',
                    gender: 'female',
                    dateOfBirth: '1992-11-08',
                    currentDistrict: 'Masaka',
                    currentSubCounty: 'Central',
                    currentParish: 'Central',
                    currentVillage: 'Market Square',
                    whatsappContact: '+256 700 333 333',
                    email: 'grace.namukasa@email.com',
                    workingProfileDescription: 'Experienced livestock farmer with specialization in dairy cattle management and veterinary care.',
                    highestEducationLevel: 'certificate',
                    yearsExperience: 6,
                    workTypeDesired: 'permanent',
                    preferredEnterprise: 'livestock',
                    expectedSalaryMin: 900000,
                    expectedSalaryMax: 1300000,
                    willingnessRelocate: 'yes',
                    willingnessRemote: 'no',
                    preferredWorkingHours: 'day_shift',
                    technicalSkills: JSON.stringify(['livestock_husbandry', 'dairy_management', 'veterinary_care']),
                    languagesSpoken: JSON.stringify(['English', 'Luganda']),
                    relevantCertificates: JSON.stringify(['Livestock Management Certificate']),
                    agriculturalTraining: JSON.stringify(['Dairy Management', 'Veterinary Care']),
                    previousJobRoles: JSON.stringify(['Dairy Farm Worker', 'Livestock Caretaker']),
                    enterpriseTypes: JSON.stringify(['livestock']),
                    livestockCaredFor: JSON.stringify(['cattle', 'goats', 'pigs'])
                }
            },
            {
                id: 'jobseeker-4',
                email: 'joseph.kato@email.com',
                firstName: 'Joseph',
                lastName: 'Kato',
                phone: '+256 700 444 444',
                profile: {
                    fullName: 'Joseph Kato',
                    gender: 'male',
                    dateOfBirth: '1990-05-12',
                    currentDistrict: 'Jinja',
                    currentSubCounty: 'Central',
                    currentParish: 'Central',
                    currentVillage: 'Industrial Area',
                    whatsappContact: '+256 700 444 444',
                    email: 'joseph.kato@email.com',
                    workingProfileDescription: 'Mechanic specializing in agricultural equipment maintenance and repair.',
                    highestEducationLevel: 'certificate',
                    yearsExperience: 7,
                    workTypeDesired: 'permanent',
                    preferredEnterprise: 'any',
                    expectedSalaryMin: 1200000,
                    expectedSalaryMax: 1800000,
                    willingnessRelocate: 'yes',
                    willingnessRemote: 'no',
                    preferredWorkingHours: 'day_shift',
                    technicalSkills: JSON.stringify(['equipment_maintenance', 'tractor_repair', 'machinery_operation']),
                    languagesSpoken: JSON.stringify(['English', 'Luganda']),
                    relevantCertificates: JSON.stringify(['Mechanical Certificate', 'Tractor Repair License']),
                    agriculturalTraining: JSON.stringify(['Agricultural Machinery', 'Equipment Maintenance']),
                    previousJobRoles: JSON.stringify(['Agricultural Mechanic', 'Equipment Operator']),
                    enterpriseTypes: JSON.stringify(['any'])
                }
            },
            {
                id: 'jobseeker-5',
                email: 'sarah.nabukeera@email.com',
                firstName: 'Sarah',
                lastName: 'Nabukeera',
                phone: '+256 700 555 555',
                profile: {
                    fullName: 'Sarah Nabukeera',
                    gender: 'female',
                    dateOfBirth: '1993-09-25',
                    currentDistrict: 'Kampala',
                    currentSubCounty: 'Central',
                    currentParish: 'Central',
                    currentVillage: 'Nakawa',
                    whatsappContact: '+256 700 555 555',
                    email: 'sarah.nabukeera@email.com',
                    workingProfileDescription: 'Recent graduate with fresh knowledge in modern agricultural techniques and sustainable farming.',
                    highestEducationLevel: 'degree',
                    yearsExperience: 1,
                    workTypeDesired: 'permanent',
                    preferredEnterprise: 'crops',
                    expectedSalaryMin: 600000,
                    expectedSalaryMax: 900000,
                    willingnessRelocate: 'yes',
                    willingnessRemote: 'no',
                    preferredWorkingHours: 'day_shift',
                    technicalSkills: JSON.stringify(['modern_farming', 'sustainable_agriculture', 'crop_monitoring']),
                    languagesSpoken: JSON.stringify(['English', 'Luganda']),
                    relevantCertificates: JSON.stringify(['Bachelor of Agriculture']),
                    agriculturalTraining: JSON.stringify(['Modern Farming Techniques', 'Sustainable Agriculture']),
                    previousJobRoles: JSON.stringify(['Farm Intern']),
                    enterpriseTypes: JSON.stringify(['crops']),
                    cropsCaredFor: JSON.stringify(['maize', 'rice', 'beans'])
                }
            }
        ]

        // Insert job seekers
        const insertJobSeeker = db.prepare(`
            INSERT OR REPLACE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        const insertEmployeeProfile = db.prepare(`
            INSERT OR REPLACE INTO employee_profiles (
                id, user_id, full_name, gender, date_of_birth, current_district, current_sub_county,
                current_parish, current_village, whatsapp_contact, email, working_profile_description,
                highest_education_level, years_experience, work_type_desired, preferred_enterprise,
                expected_salary_min, expected_salary_max, willingness_relocate, willingness_remote,
                preferred_working_hours, technical_skills, languages_spoken, relevant_certificates,
                agricultural_training, previous_job_roles, enterprise_types, crops_cared_for,
                livestock_cared_for, horticulture_plants, preferred_regions
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        jobSeekers.forEach(seeker => {
            insertJobSeeker.run(
                seeker.id,
                seeker.email,
                '$2b$10$demo.hash.for.testing',
                seeker.firstName,
                seeker.lastName,
                seeker.phone,
                'job_seeker',
                1,
                1
            )

            insertEmployeeProfile.run(
                `${seeker.id}-profile`,
                seeker.id,
                seeker.profile.fullName,
                seeker.profile.gender,
                seeker.profile.dateOfBirth,
                seeker.profile.currentDistrict,
                seeker.profile.currentSubCounty,
                seeker.profile.currentParish,
                seeker.profile.currentVillage,
                seeker.profile.whatsappContact,
                seeker.profile.email,
                seeker.profile.workingProfileDescription,
                seeker.profile.highestEducationLevel,
                seeker.profile.yearsExperience,
                seeker.profile.workTypeDesired,
                seeker.profile.preferredEnterprise,
                seeker.profile.expectedSalaryMin,
                seeker.profile.expectedSalaryMax,
                seeker.profile.willingnessRelocate,
                seeker.profile.willingnessRemote,
                seeker.profile.preferredWorkingHours,
                seeker.profile.technicalSkills,
                seeker.profile.languagesSpoken,
                seeker.profile.relevantCertificates,
                seeker.profile.agriculturalTraining,
                seeker.profile.previousJobRoles,
                seeker.profile.enterpriseTypes,
                seeker.profile.cropsCaredFor || null,
                seeker.profile.livestockCaredFor || null,
                seeker.profile.horticulturePlants || null,
                JSON.stringify([seeker.profile.currentDistrict]) // preferred_regions
            )
        })

        // Insert multiple organizations for Duncan Asiimwe
        const organizations = [
            {
                id: 'org-1',
                name: 'Nakasero Organic Farms',
                type: 'individual_farm',
                description: 'Family-owned organic farm specializing in vegetables and sustainable farming practices.',
                website: 'https://nakasero-farms.com',
                enterpriseType: 'mixed',
                district: 'Wakiso',
                subCounty: 'Nakasero',
                parish: 'Central',
                village: 'Hill Road',
                farmSize: 25.5,
                farmStage: 'established',
                contactPerson: 'Duncan Asiimwe',
                contactTitle: 'Farm Manager',
                whatsapp: '+256 700 123 456',
                email: 'duncan@nakasero-farms.com'
            },
            {
                id: 'org-2',
                name: 'Mukono Dairy Cooperative',
                type: 'cooperative',
                description: 'Dairy cooperative serving local farmers with milk collection and processing services.',
                website: 'https://mukono-dairy.coop',
                enterpriseType: 'livestock',
                district: 'Mukono',
                subCounty: 'Central',
                parish: 'Central',
                village: 'Cooperative Road',
                farmSize: 50.0,
                farmStage: 'established',
                contactPerson: 'Duncan Asiimwe',
                contactTitle: 'Cooperative Manager',
                whatsapp: '+256 700 123 456',
                email: 'duncan@mukono-dairy.coop'
            },
            {
                id: 'org-3',
                name: 'Jinja Horticulture Center',
                type: 'agribusiness',
                description: 'Commercial horticulture operation specializing in greenhouse production of vegetables and flowers.',
                website: 'https://jinja-horticulture.com',
                enterpriseType: 'horticulture',
                district: 'Jinja',
                subCounty: 'Central',
                parish: 'Central',
                village: 'Industrial Area',
                farmSize: 15.0,
                farmStage: 'established',
                contactPerson: 'Duncan Asiimwe',
                contactTitle: 'Operations Manager',
                whatsapp: '+256 700 123 456',
                email: 'duncan@jinja-horticulture.com'
            },
            {
                id: 'org-4',
                name: 'Masaka Crop Research Station',
                type: 'ngo',
                description: 'Agricultural research station focused on crop improvement and farmer training programs.',
                website: 'https://masaka-research.org',
                enterpriseType: 'crops',
                district: 'Masaka',
                subCounty: 'Central',
                parish: 'Central',
                village: 'Research Center',
                farmSize: 100.0,
                farmStage: 'established',
                contactPerson: 'Duncan Asiimwe',
                contactTitle: 'Research Director',
                whatsapp: '+256 700 123 456',
                email: 'duncan@masaka-research.org'
            }
        ]

        // Insert organizations
        const insertOrg = db.prepare(`
            INSERT OR REPLACE INTO organizations (id, name, type, description, website, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `)

        const insertUserOrg = db.prepare(`
            INSERT OR REPLACE INTO user_organizations (id, user_id, organization_id, role, is_primary)
            VALUES (?, ?, ?, ?, ?)
        `)

        const insertOrgDetails = db.prepare(`
            INSERT OR REPLACE INTO organization_details (
                id, organization_id, enterprise_type, main_enterprises, district, sub_county, 
                parish, village, farm_size_acres, farm_stage, contact_person_name, 
                contact_person_title, whatsapp_contact, email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        organizations.forEach((org, index) => {
            insertOrg.run(org.id, org.name, org.type, org.description, org.website, 1)

            insertUserOrg.run(
                `duncan-org-${index + 1}`,
                'duncan-asiimwe-1',
                org.id,
                'owner',
                index === 0 ? 1 : 0 // First org is primary
            )

            insertOrgDetails.run(
                `${org.id}-details`,
                org.id,
                org.enterpriseType,
                JSON.stringify([org.enterpriseType]),
                org.district,
                org.subCounty,
                org.parish,
                org.village,
                org.farmSize,
                org.farmStage,
                org.contactPerson,
                org.contactTitle,
                org.whatsapp,
                org.email
            )
        })

        // Insert diverse jobs for each organization
        const jobs = [
            // Nakasero Organic Farms jobs
            {
                id: 'job-1',
                organizationId: 'org-1',
                postedByUserId: 'duncan-asiimwe-1',
                title: 'Organic Farm Worker',
                totalWorkersNeeded: 3,
                description: 'Seeking experienced farm workers for organic vegetable production. Must have knowledge of organic farming practices.',
                jobType: 'full_time',
                contractDurationMonths: 12,
                expectedStartDate: '2024-02-01',
                workingHours: 'day_shift',
                genderPreference: 'either',
                ageRangeMin: 18,
                ageRangeMax: 45,
                educationLevel: 'secondary',
                workExperienceYears: 2,
                languagePreference: JSON.stringify(['English', 'Luganda']),
                technicalSkills: JSON.stringify(['organic_farming', 'crop_rotation', 'composting']),
                specialCertifications: JSON.stringify(['Organic Farming Certificate']),
                softSkills: JSON.stringify(['teamwork', 'patience', 'physical_stamina']),
                accommodation: 'provided',
                electricity: 'available',
                meals: 'provided',
                salaryMinUgx: 800000,
                salaryMaxUgx: 1200000,
                paymentMode: 'bank_transfer',
                healthCover: 'provided',
                transportAllowance: 'provided',
                overtimePayments: 'yes',
                bonusPayment: 'performance_based',
                religiousAffiliation: 'any',
                nationalityPreference: JSON.stringify(['Ugandan']),
                ethnicBackgroundPreference: JSON.stringify(['any']),
                remarks: 'Must be willing to work in outdoor conditions and follow organic farming protocols.',
                expiresAt: '2024-03-01',
                status: 'approved',
                isActive: 1,
                contractDurationMonths: 12
            },
            {
                id: 'job-2',
                organizationId: 'org-1',
                postedByUserId: 'duncan-asiimwe-1',
                title: 'Tractor Operator',
                totalWorkersNeeded: 1,
                description: 'Experienced tractor operator needed for field preparation and maintenance work.',
                jobType: 'full_time',
                contractDurationMonths: 12,
                expectedStartDate: '2024-02-15',
                workingHours: 'day_shift',
                genderPreference: 'male',
                ageRangeMin: 25,
                ageRangeMax: 50,
                educationLevel: 'certificate',
                workExperienceYears: 3,
                languagePreference: JSON.stringify(['English', 'Luganda']),
                technicalSkills: JSON.stringify(['tractor_operation', 'equipment_maintenance', 'field_preparation']),
                specialCertifications: JSON.stringify(['Tractor Operation License']),
                softSkills: JSON.stringify(['attention_to_detail', 'safety_consciousness']),
                accommodation: 'not_provided',
                electricity: 'available',
                meals: 'not_provided',
                salaryMinUgx: 1000000,
                salaryMaxUgx: 1500000,
                paymentMode: 'bank_transfer',
                healthCover: 'provided',
                transportAllowance: 'provided',
                overtimePayments: 'yes',
                bonusPayment: 'performance_based',
                religiousAffiliation: 'any',
                nationalityPreference: JSON.stringify(['Ugandan']),
                ethnicBackgroundPreference: JSON.stringify(['any']),
                remarks: 'Must have valid driving license and tractor operation experience.',
                expiresAt: '2024-03-15',
                status: 'approved',
                isActive: 1,
                contractDurationMonths: 12
            },
            // Mukono Dairy Cooperative jobs
            {
                id: 'job-3',
                organizationId: 'org-2',
                postedByUserId: 'duncan-asiimwe-1',
                title: 'Dairy Farm Worker',
                totalWorkersNeeded: 4,
                description: 'Dairy farm workers needed for cattle care, milking, and farm maintenance.',
                jobType: 'full_time',
                contractDurationMonths: 12,
                expectedStartDate: '2024-02-01',
                workingHours: 'day_shift',
                genderPreference: 'either',
                ageRangeMin: 20,
                ageRangeMax: 40,
                educationLevel: 'primary',
                workExperienceYears: 1,
                languagePreference: JSON.stringify(['English', 'Luganda']),
                technicalSkills: JSON.stringify(['livestock_husbandry', 'milking', 'cattle_care']),
                specialCertifications: JSON.stringify([]),
                softSkills: JSON.stringify(['patience', 'physical_stamina', 'animal_care']),
                accommodation: 'provided',
                electricity: 'available',
                meals: 'provided',
                salaryMinUgx: 700000,
                salaryMaxUgx: 1000000,
                paymentMode: 'bank_transfer',
                healthCover: 'provided',
                transportAllowance: 'not_provided',
                overtimePayments: 'yes',
                bonusPayment: 'performance_based',
                religiousAffiliation: 'any',
                nationalityPreference: JSON.stringify(['Ugandan']),
                ethnicBackgroundPreference: JSON.stringify(['any']),
                remarks: 'Early morning shifts required for milking operations.',
                expiresAt: '2024-03-01',
                status: 'approved',
                isActive: 1,
                contractDurationMonths: 12
            },
            // Jinja Horticulture Center jobs
            {
                id: 'job-4',
                organizationId: 'org-3',
                postedByUserId: 'duncan-asiimwe-1',
                title: 'Greenhouse Technician',
                totalWorkersNeeded: 2,
                description: 'Skilled greenhouse technician for vegetable production and greenhouse maintenance.',
                jobType: 'full_time',
                contractDurationMonths: 12,
                expectedStartDate: '2024-02-01',
                workingHours: 'day_shift',
                genderPreference: 'either',
                ageRangeMin: 22,
                ageRangeMax: 35,
                educationLevel: 'certificate',
                workExperienceYears: 2,
                languagePreference: JSON.stringify(['English', 'Luganda']),
                technicalSkills: JSON.stringify(['greenhouse_management', 'crop_production', 'irrigation_systems']),
                specialCertifications: JSON.stringify(['Horticulture Certificate']),
                softSkills: JSON.stringify(['attention_to_detail', 'problem_solving']),
                accommodation: 'not_provided',
                electricity: 'available',
                meals: 'not_provided',
                salaryMinUgx: 900000,
                salaryMaxUgx: 1300000,
                paymentMode: 'bank_transfer',
                healthCover: 'provided',
                transportAllowance: 'provided',
                overtimePayments: 'yes',
                bonusPayment: 'performance_based',
                religiousAffiliation: 'any',
                nationalityPreference: JSON.stringify(['Ugandan']),
                ethnicBackgroundPreference: JSON.stringify(['any']),
                remarks: 'Experience with greenhouse operations preferred.',
                expiresAt: '2024-03-01',
                status: 'approved',
                isActive: 1,
                contractDurationMonths: 12
            },
            // Masaka Crop Research Station jobs
            {
                id: 'job-5',
                organizationId: 'org-4',
                postedByUserId: 'duncan-asiimwe-1',
                title: 'Agricultural Research Assistant',
                totalWorkersNeeded: 1,
                description: 'Research assistant for crop improvement projects and farmer training programs.',
                jobType: 'full_time',
                contractDurationMonths: 12,
                expectedStartDate: '2024-02-01',
                workingHours: 'day_shift',
                genderPreference: 'either',
                ageRangeMin: 25,
                ageRangeMax: 35,
                educationLevel: 'degree',
                workExperienceYears: 1,
                languagePreference: JSON.stringify(['English', 'Luganda']),
                technicalSkills: JSON.stringify(['research_methods', 'data_collection', 'crop_monitoring']),
                specialCertifications: JSON.stringify(['Bachelor of Agriculture']),
                softSkills: JSON.stringify(['analytical_thinking', 'communication', 'teaching']),
                accommodation: 'provided',
                electricity: 'available',
                meals: 'provided',
                salaryMinUgx: 1200000,
                salaryMaxUgx: 1800000,
                paymentMode: 'bank_transfer',
                healthCover: 'provided',
                transportAllowance: 'provided',
                overtimePayments: 'yes',
                bonusPayment: 'performance_based',
                religiousAffiliation: 'any',
                nationalityPreference: JSON.stringify(['Ugandan']),
                ethnicBackgroundPreference: JSON.stringify(['any']),
                remarks: 'Must be willing to travel to different districts for farmer training.',
                expiresAt: '2024-03-01',
                status: 'approved',
                isActive: 1,
                contractDurationMonths: 12
            }
        ]

        // Insert jobs
        const insertJob = db.prepare(`
            INSERT OR REPLACE INTO jobs (
                id, organization_id, posted_by_user_id, title, total_workers_needed, description,
                job_type, contract_duration_months, expected_start_date, working_hours,
                gender_preference, age_range_min, age_range_max, education_level, work_experience_years,
                language_preference, technical_skills, special_certifications, soft_skills,
                accommodation, electricity, meals, salary_min_ugx, salary_max_ugx, payment_mode,
                health_cover, transport_allowance, overtime_payments, bonus_payment,
                religious_affiliation, nationality_preference, ethnic_background_preference,
                remarks, expires_at, status, is_active, posted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        jobs.forEach(job => {
            insertJob.run(
                job.id,
                job.organizationId,
                job.postedByUserId,
                job.title,
                job.totalWorkersNeeded,
                job.description,
                job.jobType,
                job.contractDurationMonths,
                job.expectedStartDate,
                job.workingHours,
                job.genderPreference,
                job.ageRangeMin,
                job.ageRangeMax,
                job.educationLevel,
                job.workExperienceYears,
                job.languagePreference,
                job.technicalSkills,
                job.specialCertifications,
                job.softSkills,
                job.accommodation,
                job.electricity,
                job.meals,
                job.salaryMinUgx,
                job.salaryMaxUgx,
                job.paymentMode,
                job.healthCover,
                job.transportAllowance,
                job.overtimePayments,
                job.bonusPayment,
                job.religiousAffiliation,
                job.nationalityPreference,
                job.ethnicBackgroundPreference,
                job.remarks,
                job.expiresAt,
                job.status,
                job.isActive,
                new Date().toISOString()
            )
        })

        console.log('✅ Demo data inserted successfully!')
        console.log(`📊 Inserted ${jobSeekers.length} job seekers with profiles`)
        console.log(`🏢 Inserted ${organizations.length} organizations`)
        console.log(`💼 Inserted ${jobs.length} jobs`)
    } catch (error) {
        console.error('❌ Demo data insertion failed:', error)
    }
}

export { db }
export default db

