import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database'

// Get jobs posted by the current user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const jobs = db.prepare(`
            SELECT 
                j.id,
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
                j.posted_at,
                j.expires_at,
                j.status,
                j.is_active,
                COUNT(a.id) as applications_count,
                o.name as organization_name,
                o.type as organization_type,
                o.description as organization_description,
                o.website as organization_website,
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
            LEFT JOIN organization_details od ON o.id = od.organization_id
            LEFT JOIN applications a ON j.id = a.job_id
            WHERE j.posted_by_user_id = ?
            GROUP BY j.id
            ORDER BY j.posted_at DESC
        `).all(userId) as any[]

        // Parse JSON fields
        const processedJobs = jobs.map(job => ({
            ...job,
            language_preference: job.language_preference ? JSON.parse(job.language_preference) : [],
            technical_skills: job.technical_skills ? JSON.parse(job.technical_skills) : [],
            special_certifications: job.special_certifications ? JSON.parse(job.special_certifications) : [],
            soft_skills: job.soft_skills ? JSON.parse(job.soft_skills) : [],
            nationality_preference: job.nationality_preference ? JSON.parse(job.nationality_preference) : [],
            ethnic_background_preference: job.ethnic_background_preference ? JSON.parse(job.ethnic_background_preference) : [],
            location: `${job.district}, ${job.sub_county}`,
            salaryRange: {
                min: job.salary_min_ugx,
                max: job.salary_max_ugx
            },
            employer: {
                companyName: job.organization_name,
                location: `${job.district}, ${job.sub_county}`,
                description: job.organization_description,
                website: job.organization_website
            }
        }))

        return NextResponse.json({ jobs: processedJobs }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch posted jobs:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
