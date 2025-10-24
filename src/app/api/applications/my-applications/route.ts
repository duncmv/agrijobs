import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database'

// Get applications made by the current user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const applications = db.prepare(`
            SELECT 
                a.id,
                a.job_id,
                a.applied_at,
                a.status,
                a.cover_letter,
                a.notes,
                j.title as job_title,
                j.job_type,
                j.salary_min_ugx,
                j.salary_max_ugx,
                j.expected_start_date,
                o.name as organization_name,
                od.district,
                od.sub_county
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN organizations o ON j.organization_id = o.id
            LEFT JOIN organization_details od ON o.id = od.organization_id
            WHERE a.job_seeker_id = ?
            ORDER BY a.applied_at DESC
        `).all(userId) as any[]

        // Process applications
        const processedApplications = applications.map(app => ({
            ...app,
            location: `${app.district}, ${app.sub_county}`,
            salaryRange: {
                min: app.salary_min_ugx,
                max: app.salary_max_ugx
            }
        }))

        return NextResponse.json({ applications: processedApplications }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch applications:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
