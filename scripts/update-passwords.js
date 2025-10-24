#!/usr/bin/env node

const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

async function updatePasswords() {
    try {
        console.log('🔐 Updating user passwords...')

        // Update demo user password
        const demoPasswordHash = await bcrypt.hash('demo123', 10)
        const updateDemo = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
        updateDemo.run(demoPasswordHash, 'demo@agrijobs.ug')

        // Update admin user password
        const adminPasswordHash = await bcrypt.hash('admin123', 10)
        const updateAdmin = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?')
        updateAdmin.run(adminPasswordHash, 'admin@agrijobs.ug')

        console.log('✅ Passwords updated successfully!')
        console.log('')
        console.log('🔑 Updated Credentials:')
        console.log('   Employer: demo@agrijobs.ug / demo123')
        console.log('   Admin: admin@agrijobs.ug / admin123')

        db.close()
        return true
    } catch (error) {
        console.error('❌ Password update failed:', error)
        db.close()
        return false
    }
}

updatePasswords()

