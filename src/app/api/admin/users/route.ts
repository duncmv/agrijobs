import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { searchParams } = new URL(request.url)
        const filter = searchParams.get('filter') || 'all'

        let whereClause = ''
        if (filter !== 'all') {
            whereClause = `WHERE u.role = '${filter}'`
        }

        const users = db.prepare(`
            SELECT 
                u.*,
                COUNT(DISTINCT uo.organization_id) as organizations_count,
                COUNT(DISTINCT j.id) as jobs_posted_count,
                COUNT(DISTINCT a.id) as applications_count
            FROM users u
            LEFT JOIN user_organizations uo ON u.id = uo.user_id
            LEFT JOIN jobs j ON u.id = j.posted_by_user_id
            LEFT JOIN applications a ON u.id = a.job_seeker_id
            ${whereClause}
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `).all()

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Admin users fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}
