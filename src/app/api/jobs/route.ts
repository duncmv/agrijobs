import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

// Get all approved jobs for public viewing
export async function GET(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const jobs = db.prepare(`
            SELECT 
                j.id,
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
                j.posted_at,
                j.expires_at,
                j.applications_count,
                o.type as organization_type,
                od.district,
                od.sub_county,
                od.enterprise_type
            FROM jobs j
            JOIN organizations o ON j.organization_id = o.id
            LEFT JOIN organization_details od ON o.id = od.organization_id
            WHERE j.status = 'approved' AND j.is_active = 1 AND j.expires_at > datetime('now')
            ORDER BY j.posted_at DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset) as any[]

        // Parse JSON fields and format enterprise type
        const processedJobs = jobs.map(job => ({
            ...job,
            language_preference: job.language_preference ? JSON.parse(job.language_preference) : [],
            technical_skills: job.technical_skills ? JSON.parse(job.technical_skills) : [],
            special_certifications: job.special_certifications ? JSON.parse(job.special_certifications) : [],
            soft_skills: job.soft_skills ? JSON.parse(job.soft_skills) : [],
            nationality_preference: job.nationality_preference ? JSON.parse(job.nationality_preference) : [],
            ethnic_background_preference: job.ethnic_background_preference ? JSON.parse(job.ethnic_background_preference) : [],
            location: `${job.district}, ${job.sub_county}`,
            enterprise_type: job.enterprise_type ? job.enterprise_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Agricultural Enterprise',
            salaryRange: {
                min: job.salary_min_ugx,
                max: job.salary_max_ugx
            }
        }))

        return NextResponse.json({ jobs: processedJobs }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch jobs:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

