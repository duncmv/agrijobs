import { NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET() {
    try {
        // Initialize database if needed
        initializeDatabase()

        // Get total users
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get() as { count: number }

        // Get total jobs
        const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number }

        // Get job status breakdown
        const pendingJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get('pending_review') as { count: number }
        const approvedJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get('approved') as { count: number }
        const rejectedJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get('rejected') as { count: number }

        // Get total applications
        const totalApplications = db.prepare('SELECT COUNT(*) as count FROM applications').get() as { count: number }

        // Get active organizations
        const activeOrganizations = db.prepare('SELECT COUNT(*) as count FROM organizations WHERE is_active = 1').get() as { count: number }

        // Get recent activity (last 10 activities)
        const recentJobs = db.prepare(`
            SELECT 
                id,
                title,
                status,
                posted_at,
                'job_posted' as type
            FROM jobs 
            ORDER BY posted_at DESC 
            LIMIT 5
        `).all()

        const recentUsers = db.prepare(`
            SELECT 
                id,
                first_name,
                last_name,
                created_at,
                'user_registered' as type
            FROM users 
            ORDER BY created_at DESC 
            LIMIT 5
        `).all()

        // Combine and format recent activity
        const recentActivity = [
            ...recentJobs.map(job => ({
                id: job.id,
                type: job.type,
                description: `Job "${job.title}" was posted`,
                timestamp: job.posted_at
            })),
            ...recentUsers.map(user => ({
                id: user.id,
                type: user.type,
                description: `${user.first_name} ${user.last_name} registered`,
                timestamp: user.created_at
            }))
        ]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10)

        const stats = {
            totalUsers: totalUsers.count,
            totalJobs: totalJobs.count,
            pendingJobs: pendingJobs.count,
            approvedJobs: approvedJobs.count,
            rejectedJobs: rejectedJobs.count,
            totalApplications: totalApplications.count,
            activeOrganizations: activeOrganizations.count,
            recentActivity
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
    }
}
