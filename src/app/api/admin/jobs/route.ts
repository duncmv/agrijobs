import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database'

// Get all jobs for admin review
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'pending_review'

        const jobs = db.prepare(`
            SELECT 
                j.*,
                o.name as organization_name,
                o.type as organization_type,
                u.first_name || ' ' || u.last_name as posted_by_name,
                u.email as posted_by_email
            FROM jobs j
            JOIN organizations o ON j.organization_id = o.id
            JOIN users u ON j.posted_by_user_id = u.id
            WHERE j.status = ?
            ORDER BY j.posted_at DESC
        `).all(status) as any[]

        return NextResponse.json({ jobs }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch jobs:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Update job status (approve/reject)
export async function PATCH(request: NextRequest) {
    try {
        const { jobId, status, adminNotes } = await request.json()

        if (!jobId || !status) {
            return NextResponse.json({ error: 'Job ID and status are required' }, { status: 400 })
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be approved or rejected' }, { status: 400 })
        }

        const updateJob = db.prepare(`
            UPDATE jobs 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)

        const result = updateJob.run(status, jobId)

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: `Job ${status} successfully`,
            jobId
        }, { status: 200 })

    } catch (error) {
        console.error('Failed to update job status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

