const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

// Connect to the existing database
const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('🌱 Starting comprehensive data seeding...')

try {
    // Generate password hashes
    const demoPasswordHash = bcrypt.hashSync('demo123', 10)
    console.log('Generated password hash for demo123')

    // Insert Duncan Asiimwe as the main employer
    const duncanUser = db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    duncanUser.run(
        'duncan-asiimwe-1',
        'duncan@agrijobs.ug',
        demoPasswordHash,
        'Duncan',
        'Asiimwe',
        '+256 700 123 456',
        'employer',
        1,
        1
    )

    console.log('✅ Duncan Asiimwe user created')

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
                livestockCaredFor: JSON.stringify(['cattle', 'goats']),
                preferredRegions: JSON.stringify(['Wakiso', 'Kampala'])
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
                horticulturePlants: JSON.stringify(['tomatoes', 'peppers', 'lettuce']),
                preferredRegions: JSON.stringify(['Mukono', 'Jinja'])
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
                livestockCaredFor: JSON.stringify(['cattle', 'goats', 'pigs']),
                preferredRegions: JSON.stringify(['Masaka', 'Wakiso'])
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
                enterpriseTypes: JSON.stringify(['any']),
                preferredRegions: JSON.stringify(['Jinja', 'Kampala', 'Mukono'])
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
                cropsCaredFor: JSON.stringify(['maize', 'rice', 'beans']),
                preferredRegions: JSON.stringify(['Kampala', 'Wakiso'])
            }
        }
    ]

    // Insert job seekers
    const insertJobSeeker = db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertEmployeeProfile = db.prepare(`
        INSERT OR IGNORE INTO employee_profiles (
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
            demoPasswordHash,
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
            seeker.profile.preferredRegions
        )
    })

    console.log(`✅ Inserted ${jobSeekers.length} job seekers with profiles`)

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
            enterpriseType: 'crop_farm',
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
        INSERT OR IGNORE INTO organizations (id, name, type, description, website, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    `)

    const insertUserOrg = db.prepare(`
        INSERT OR IGNORE INTO user_organizations (id, user_id, organization_id, role, is_primary)
        VALUES (?, ?, ?, ?, ?)
    `)

    const insertOrgDetails = db.prepare(`
        INSERT OR IGNORE INTO organization_details (
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

    console.log(`✅ Inserted ${organizations.length} organizations`)

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
            overtimePayments: 'provided',
            bonusPayment: 'provided',
            religiousAffiliation: 'any',
            nationalityPreference: JSON.stringify(['Ugandan']),
            ethnicBackgroundPreference: JSON.stringify(['any']),
            remarks: 'Must be willing to work in outdoor conditions and follow organic farming protocols.',
            expiresAt: '2025-12-31',
            status: 'approved',
            isActive: 1
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
            overtimePayments: 'provided',
            bonusPayment: 'provided',
            religiousAffiliation: 'any',
            nationalityPreference: JSON.stringify(['Ugandan']),
            ethnicBackgroundPreference: JSON.stringify(['any']),
            remarks: 'Must have valid driving license and tractor operation experience.',
            expiresAt: '2025-12-31',
            status: 'approved',
            isActive: 1
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
            overtimePayments: 'provided',
            bonusPayment: 'provided',
            religiousAffiliation: 'any',
            nationalityPreference: JSON.stringify(['Ugandan']),
            ethnicBackgroundPreference: JSON.stringify(['any']),
            remarks: 'Early morning shifts required for milking operations.',
            expiresAt: '2025-12-31',
            status: 'approved',
            isActive: 1
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
            overtimePayments: 'provided',
            bonusPayment: 'provided',
            religiousAffiliation: 'any',
            nationalityPreference: JSON.stringify(['Ugandan']),
            ethnicBackgroundPreference: JSON.stringify(['any']),
            remarks: 'Experience with greenhouse operations preferred.',
            expiresAt: '2025-12-31',
            status: 'approved',
            isActive: 1
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
            overtimePayments: 'provided',
            bonusPayment: 'provided',
            religiousAffiliation: 'any',
            nationalityPreference: JSON.stringify(['Ugandan']),
            ethnicBackgroundPreference: JSON.stringify(['any']),
            remarks: 'Must be willing to travel to different districts for farmer training.',
            expiresAt: '2025-12-31',
            status: 'approved',
            isActive: 1
        }
    ]

    // Insert jobs
    const insertJob = db.prepare(`
        INSERT OR IGNORE INTO jobs (
            id, organization_id, posted_by_user_id, title, total_workers_needed, description,
            job_type, contract_duration_months, expected_start_date, working_hours,
            gender_preference, age_range_min, age_range_max, education_level, work_experience_years,
            language_preference, technical_skills, special_certifications, soft_skills,
            accommodation, electricity, meals, salary_min_ugx, salary_max_ugx, payment_mode,
            health_cover, transport_allowance, overtime_payments, bonus_payment,
            religious_affiliation, nationality_preference, ethnic_background_preference,
            remarks, status, posted_at, expires_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    jobs.forEach((job, index) => {
        try {
            console.log(`Inserting job ${index + 1}: ${job.title}`)
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
                job.status,
                new Date().toISOString(),
                job.expiresAt,
                job.isActive
            )
            console.log(`✅ Job ${index + 1} inserted successfully`)
        } catch (error) {
            console.error(`❌ Failed to insert job ${index + 1}:`, error.message)
            console.error('Job data:', JSON.stringify(job, null, 2))
            throw error
        }
    })

    console.log(`✅ Inserted ${jobs.length} jobs`)
    console.log('🎉 Comprehensive data seeding completed successfully!')

} catch (error) {
    console.error('❌ Data seeding failed:', error)
    console.error('Error details:', error.message)
} finally {
    db.close()
}
