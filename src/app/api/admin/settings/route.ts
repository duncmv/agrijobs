import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET() {
    try {
        // Initialize database if needed
        initializeDatabase()

        // For now, return default settings
        // In a real app, these would be stored in a settings table
        const settings = {
            platformName: 'Feasts AgriJobs',
            platformEmail: 'admin@feasts.co.ug',
            maxJobDuration: 12,
            autoApproveJobs: false,
            requireEmailVerification: true,
            allowSelfRegistration: true
        }

        return NextResponse.json({ settings })
    } catch (error) {
        console.error('Settings fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const settings = await request.json()

        // In a real app, you would save these to a settings table
        // For now, we'll just return success
        console.log('Settings updated:', settings)

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully'
        })
    } catch (error) {
        console.error('Settings save error:', error)
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
    }
}
