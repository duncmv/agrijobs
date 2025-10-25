import { NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

export async function GET() {
    try {
        // Initialize database if needed
        initializeDatabase()

        // Export all data
        const users = db.prepare('SELECT * FROM users').all()
        const organizations = db.prepare('SELECT * FROM organizations').all()
        const organizationDetails = db.prepare('SELECT * FROM organization_details').all()
        const userOrganizations = db.prepare('SELECT * FROM user_organizations').all()
        const jobs = db.prepare('SELECT * FROM jobs').all()
        const applications = db.prepare('SELECT * FROM applications').all()
        const employeeProfiles = db.prepare('SELECT * FROM employee_profiles').all()

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: {
                users,
                organizations,
                organizationDetails,
                userOrganizations,
                jobs,
                applications,
                employeeProfiles
            }
        }

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="agrijobs-export-${new Date().toISOString().split('T')[0]}.json"`
            }
        })
    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
    }
}
