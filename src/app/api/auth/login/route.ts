import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'
import bcrypt from 'bcryptjs'

// Initialize database on first import
initializeDatabase()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Find user by email
        const user = db.prepare('SELECT * FROM users WHERE email = ? AND is_active = 1').get(email)

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Verify password hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash)

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Get user's organizations
        const organizations = db.prepare(`
            SELECT uo.*, o.* 
            FROM user_organizations uo 
            JOIN organizations o ON uo.organization_id = o.id 
            WHERE uo.user_id = ?
        `).all(user.id)

        // Update last login
        db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id)

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                role: user.role,
                emailVerified: user.email_verified,
                isActive: user.is_active,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            },
            organizations: organizations.map(org => ({
                id: org.id,
                userId: org.user_id,
                organizationId: org.organization_id,
                role: org.role,
                isPrimary: org.is_primary,
                joinedAt: org.joined_at,
                createdAt: org.created_at,
                organization: {
                    id: org.organization_id,
                    name: org.name,
                    type: org.type,
                    description: org.description,
                    website: org.website,
                    logoUrl: org.logo_url,
                    isActive: org.is_active,
                    createdAt: org.created_at,
                    updatedAt: org.updated_at
                }
            }))
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
