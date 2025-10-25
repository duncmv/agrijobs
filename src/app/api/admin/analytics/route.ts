import { NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET() {
    try {
        // Initialize database if needed
        initializeDatabase()

        // Get user growth data (last 6 months)
        const userGrowth = db.prepare(`
            SELECT 
                strftime('%Y-%m', created_at) as month,
                COUNT(*) as count
            FROM users 
            WHERE created_at >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', created_at)
            ORDER BY month
        `).all()

        // Get job postings data (last 6 months)
        const jobPostings = db.prepare(`
            SELECT 
                strftime('%Y-%m', posted_at) as month,
                COUNT(*) as count
            FROM jobs 
            WHERE posted_at >= date('now', '-6 months')
            GROUP BY strftime('%Y-%m', posted_at)
            ORDER BY month
        `).all()

        // Get top districts by job postings
        const topDistricts = db.prepare(`
            SELECT 
                od.district,
                COUNT(j.id) as count
            FROM jobs j
            LEFT JOIN organization_details od ON j.organization_id = od.organization_id
            WHERE od.district IS NOT NULL AND od.district != ''
            GROUP BY od.district
            ORDER BY count DESC
            LIMIT 10
        `).all()

        // Get enterprise types distribution
        const enterpriseTypes = db.prepare(`
            SELECT 
                od.enterprise_type as type,
                COUNT(j.id) as count
            FROM jobs j
            LEFT JOIN organization_details od ON j.organization_id = od.organization_id
            WHERE od.enterprise_type IS NOT NULL
            GROUP BY od.enterprise_type
            ORDER BY count DESC
        `).all()

        // Get job types distribution
        const jobTypes = db.prepare(`
            SELECT 
                job_type as type,
                COUNT(*) as count
            FROM jobs
            GROUP BY job_type
            ORDER BY count DESC
        `).all()

        // Get monthly stats
        const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

        const newUsers = db.prepare(`
            SELECT COUNT(*) as count 
            FROM users 
            WHERE strftime('%Y-%m', created_at) = ?
        `).get(currentMonth) as { count: number }

        const newJobs = db.prepare(`
            SELECT COUNT(*) as count 
            FROM jobs 
            WHERE strftime('%Y-%m', posted_at) = ?
        `).get(currentMonth) as { count: number }

        const newOrganizations = db.prepare(`
            SELECT COUNT(*) as count 
            FROM organizations 
            WHERE strftime('%Y-%m', created_at) = ?
        `).get(currentMonth) as { count: number }

        const totalApplications = db.prepare(`
            SELECT COUNT(*) as count 
            FROM applications
        `).get() as { count: number }

        const analytics = {
            userGrowth: userGrowth.map(item => ({
                month: item.month,
                count: item.count
            })),
            jobPostings: jobPostings.map(item => ({
                month: item.month,
                count: item.count
            })),
            topDistricts: topDistricts.map(item => ({
                district: item.district,
                count: item.count
            })),
            enterpriseTypes: enterpriseTypes.map(item => ({
                type: item.type,
                count: item.count
            })),
            jobTypes: jobTypes.map(item => ({
                type: item.type,
                count: item.count
            })),
            monthlyStats: {
                newUsers: newUsers.count,
                newJobs: newJobs.count,
                newOrganizations: newOrganizations.count,
                totalApplications: totalApplications.count
            }
        }

        return NextResponse.json(analytics)
    } catch (error) {
        console.error('Analytics fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }
}
