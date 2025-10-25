import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { jobId, status } = await request.json()

        if (!jobId || !status) {
            return NextResponse.json({ error: 'Job ID and status are required' }, { status: 400 })
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be approved or rejected' }, { status: 400 })
        }

        // Update job status
        const updateStmt = db.prepare(`
            UPDATE jobs 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `)

        const result = updateStmt.run(status, jobId)

        if (result.changes === 0) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: `Job ${status} successfully`
        })
    } catch (error) {
        console.error('Job status update error:', error)
        return NextResponse.json({ error: 'Failed to update job status' }, { status: 500 })
    }
}
