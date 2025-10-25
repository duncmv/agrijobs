import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function POST(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { userId, isActive } = await request.json()

        if (!userId || typeof isActive !== 'boolean') {
            return NextResponse.json({ error: 'User ID and active status are required' }, { status: 400 })
        }

        // Update user status
        const updateStmt = db.prepare(`
            UPDATE users 
            SET is_active = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `)

        const result = updateStmt.run(isActive ? 1 : 0, userId)

        if (result.changes === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
        })
    } catch (error) {
        console.error('User status toggle error:', error)
        return NextResponse.json({ error: 'Failed to toggle user status' }, { status: 500 })
    }
}
