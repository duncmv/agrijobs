import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const { name, type, description, website, userId } = await request.json()

        // Validate required fields
        if (!name || !type || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create organization
        const organizationId = uuidv4()
        const insertOrgStmt = db.prepare(`
            INSERT INTO organizations (id, name, type, description, website, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        insertOrgStmt.run(organizationId, name, type, description || null, website || null, 1)

        // Create user-organization relationship
        const userOrganizationId = uuidv4()
        const insertUserOrgStmt = db.prepare(`
            INSERT INTO user_organizations (id, user_id, organization_id, role, is_primary)
            VALUES (?, ?, ?, ?, ?)
        `)
        insertUserOrgStmt.run(userOrganizationId, userId, organizationId, 'owner', 1)

        return NextResponse.json({
            success: true,
            organizationId,
            message: 'Organization created successfully'
        })
    } catch (error) {
        console.error('Failed to create organization:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

