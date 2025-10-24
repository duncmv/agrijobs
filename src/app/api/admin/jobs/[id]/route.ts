import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        const job = db.prepare(`
            SELECT 
                j.id,
                j.organization_id,
                j.posted_by_user_id,
                j.title,
                j.total_workers_needed,
                j.description,
                j.job_type,
                j.contract_duration_months,
                j.expected_start_date,
                j.working_hours,
                j.gender_preference,
                j.age_range_min,
                j.age_range_max,
                j.education_level,
                j.work_experience_years,
                j.language_preference,
                j.technical_skills,
                j.special_certifications,
                j.soft_skills,
                j.accommodation,
                j.electricity,
                j.meals,
                j.salary_min_ugx,
                j.salary_max_ugx,
                j.payment_mode,
                j.health_cover,
                j.transport_allowance,
                j.overtime_payments,
                j.bonus_payment,
                j.religious_affiliation,
                j.nationality_preference,
                j.ethnic_background_preference,
                j.remarks,
                j.status,
                j.posted_at,
                j.expires_at,
                j.is_active,
                j.applications_count,
                j.created_at,
                j.updated_at,
                o.name as organization_name,
                o.type as organization_type,
                o.description as organization_description,
                o.website as organization_website,
                u.first_name || ' ' || u.last_name as posted_by_name,
                u.email as posted_by_email,
                u.phone as posted_by_phone,
                od.enterprise_type,
                od.main_enterprises,
                od.district,
                od.sub_county,
                od.parish,
                od.village,
                od.farm_size_acres,
                od.farm_stage,
                od.contact_person_name,
                od.contact_person_title,
                od.whatsapp_contact,
                od.email as org_email
            FROM jobs j
            JOIN organizations o ON j.organization_id = o.id
            JOIN users u ON j.posted_by_user_id = u.id
            LEFT JOIN organization_details od ON o.id = od.organization_id
            WHERE j.id = ?
        `).get(id) as any

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        // Parse JSON fields
        if (job.language_preference) {
            job.language_preference = JSON.parse(job.language_preference)
        }
        if (job.technical_skills) {
            job.technical_skills = JSON.parse(job.technical_skills)
        }
        if (job.special_certifications) {
            job.special_certifications = JSON.parse(job.special_certifications)
        }
        if (job.soft_skills) {
            job.soft_skills = JSON.parse(job.soft_skills)
        }
        if (job.nationality_preference) {
            job.nationality_preference = JSON.parse(job.nationality_preference)
        }
        if (job.ethnic_background_preference) {
            job.ethnic_background_preference = JSON.parse(job.ethnic_background_preference)
        }

        return NextResponse.json({ job }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch job details:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
