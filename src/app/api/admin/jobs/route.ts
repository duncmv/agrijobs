import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') || 'pending'

        let whereClause = ''
        if (filter !== 'all') {
            if (filter === 'pending') {
                whereClause = "WHERE j.status = 'pending_review'"
            } else {
                whereClause = `WHERE j.status = '${filter}'`
            }
        }

        const jobs = db.prepare(`
            SELECT 
                j.*,
                o.name as organization_name,
                o.type as organization_type,
                od.enterprise_type,
                od.district,
                od.sub_county,
                od.parish,
                od.village,
                od.contact_person_name,
                od.whatsapp_contact,
                od.email
            FROM jobs j
            LEFT JOIN organizations o ON j.organization_id = o.id
            LEFT JOIN organization_details od ON j.organization_id = od.organization_id
            ${whereClause}
            ORDER BY j.posted_at DESC
        `).all()

        return NextResponse.json({ jobs })
    } catch (error) {
        console.error('Admin jobs fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }
}