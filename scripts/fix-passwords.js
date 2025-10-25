const Database = require('better-sqlite3')
const bcrypt = require('bcryptjs')
const path = require('path')

// Connect to the existing database
const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('🔐 Updating password hashes for demo users...')

try {
    // Hash for password "demo123"
    const demoPasswordHash = bcrypt.hashSync('demo123', 10)
    console.log('Generated hash for demo123:', demoPasswordHash)

    // Update all demo users with the proper password hash
    const updatePassword = db.prepare(`
        UPDATE users 
        SET password_hash = ? 
        WHERE password_hash = '$2b$10$demo.hash.for.testing'
    `)

    const result = updatePassword.run(demoPasswordHash)
    console.log(`✅ Updated ${result.changes} users with proper password hashes`)

    // Verify the updates
    const users = db.prepare(`
        SELECT email, role, password_hash 
        FROM users 
        ORDER BY role, email
    `).all()

    console.log('\n📋 Updated user credentials:')
    users.forEach(user => {
        const password = user.role === 'admin' ? 'admin123' : 'demo123'
        console.log(`- ${user.email} (${user.role}) - Password: ${password}`)
    })

    console.log('\n🎉 Password hash update completed successfully!')

} catch (error) {
    console.error('❌ Password hash update failed:', error)
} finally {
    db.close()
}
