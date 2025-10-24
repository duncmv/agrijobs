import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
    try {
        const { email, password, firstName, lastName, phone, role } = await request.json()

        // Check if user already exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // In a real app, you would hash the password
        const passwordHash = '$2b$10$demo.hash.for.testing'

        // Create user
        const userId = `user-${Date.now()}`
        const createUser = db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        createUser.run(
            userId,
            email,
            passwordHash,
            firstName,
            lastName,
            phone || null,
            role || 'employer',
            0, // email_verified
            1  // is_active
        )

        return NextResponse.json({
            user: {
                id: userId,
                email,
                firstName,
                lastName,
                phone,
                role: role || 'employer',
                emailVerified: false,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            organizations: []
        })
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

