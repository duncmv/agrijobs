import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const jobData = await request.json()

        let organizationId = jobData.organizationId

        // If creating a new organization, create it first
        if (organizationId === 'new' && jobData.organizationDetails) {
            organizationId = uuidv4()

            // Create organization
            const insertOrgStmt = db.prepare(`
                INSERT INTO organizations (id, name, type, description, website, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            insertOrgStmt.run(
                organizationId,
                jobData.organizationDetails.organizationName || 'New Organization',
                jobData.organizationDetails.enterpriseType || 'individual_farm',
                jobData.organizationDetails.description || null,
                jobData.organizationDetails.website || null,
                1
            )

            // Create user-organization relationship
            const userOrganizationId = uuidv4()
            const insertUserOrgStmt = db.prepare(`
                INSERT INTO user_organizations (id, user_id, organization_id, role, is_primary)
                VALUES (?, ?, ?, ?, ?)
            `)
            insertUserOrgStmt.run(userOrganizationId, jobData.postedByUserId, organizationId, 'owner', 1)

            // Create organization details
            const orgDetailsId = uuidv4()
            const insertOrgDetailsStmt = db.prepare(`
                INSERT INTO organization_details (
                    id, organization_id, enterprise_type, main_enterprises, district, sub_county,
                    parish, village, farm_size_acres, farm_stage, contact_person_name,
                    contact_person_title, whatsapp_contact, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
            insertOrgDetailsStmt.run(
                orgDetailsId,
                organizationId,
                jobData.organizationDetails.enterpriseType,
                JSON.stringify(jobData.organizationDetails.mainEnterprises || []),
                jobData.organizationDetails.location?.district || '',
                jobData.organizationDetails.location?.subCounty || '',
                jobData.organizationDetails.location?.parish || '',
                jobData.organizationDetails.location?.village || '',
                jobData.organizationDetails.farmSize || 0,
                jobData.organizationDetails.farmStage || 'established',
                jobData.organizationDetails.contactPerson?.name || '',
                jobData.organizationDetails.contactPerson?.title || '',
                jobData.organizationDetails.whatsappContact || '',
                jobData.organizationDetails.email || ''
            )
        }

        // Create job
        const jobId = `job-${Date.now()}`
        const createJob = db.prepare(`
      INSERT INTO jobs (
        id, organization_id, posted_by_user_id, title, total_workers_needed,
        description, job_type, contract_duration_months, expected_start_date,
        working_hours, gender_preference, age_range_min, age_range_max, education_level,
        work_experience_years, language_preference, technical_skills, special_certifications,
        soft_skills, accommodation, electricity, meals, salary_min_ugx, salary_max_ugx,
        payment_mode, health_cover, transport_allowance, overtime_payments, bonus_payment,
        religious_affiliation, nationality_preference, ethnic_background_preference,
        remarks, status, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

        createJob.run(
            jobId,
            jobData.organizationId,
            jobData.postedByUserId,
            jobData.jobDetails.title,
            jobData.jobDetails.totalWorkersNeeded,
            jobData.jobDetails.description,
            jobData.jobDetails.jobType,
            jobData.jobDetails.contractDuration || null,
            jobData.jobDetails.expectedStartDate,
            jobData.jobDetails.workingHours,
            jobData.workerRequirements.genderPreference,
            jobData.workerRequirements.ageRange.min,
            jobData.workerRequirements.ageRange.max,
            jobData.workerRequirements.educationLevel,
            jobData.workerRequirements.workExperience,
            JSON.stringify(jobData.workerRequirements.languagePreference),
            JSON.stringify(jobData.workerRequirements.technicalSkills),
            JSON.stringify(jobData.workerRequirements.specialCertifications),
            JSON.stringify(jobData.workerRequirements.softSkills),
            jobData.workConditions.accommodation,
            jobData.workConditions.electricity,
            jobData.workConditions.meals,
            jobData.workConditions.salaryRange.min,
            jobData.workConditions.salaryRange.max,
            jobData.workConditions.paymentMode,
            jobData.workConditions.healthCover,
            jobData.workConditions.transportAllowance,
            jobData.workConditions.overtimePayments,
            jobData.workConditions.bonusPayment,
            jobData.additionalPreferences.religiousAffiliation,
            JSON.stringify(jobData.additionalPreferences.nationality),
            JSON.stringify(jobData.additionalPreferences.ethnicBackground),
            jobData.additionalPreferences.remarks || null,
            'pending_review',
            expiresAt.toISOString()
        )

        return NextResponse.json({
            success: true,
            jobId,
            message: 'Job posted successfully and is pending review'
        })
    } catch (error) {
        console.error('Job posting error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
