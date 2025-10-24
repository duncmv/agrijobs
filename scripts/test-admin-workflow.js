#!/usr/bin/env node

const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

console.log('🧪 Testing Admin Workflow...\n')

// Test 1: Check if admin user exists
console.log('1️⃣ Checking admin user...')
const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@agrijobs.ug')
if (adminUser) {
    console.log('✅ Admin user found:', adminUser.first_name, adminUser.last_name, `(${adminUser.role})`)
} else {
    console.log('❌ Admin user not found')
}

// Test 2: Check if demo user exists
console.log('\n2️⃣ Checking demo user...')
const demoUser = db.prepare('SELECT * FROM users WHERE email = ?').get('demo@agrijobs.ug')
if (demoUser) {
    console.log('✅ Demo user found:', demoUser.first_name, demoUser.last_name, `(${demoUser.role})`)
} else {
    console.log('❌ Demo user not found')
}

// Test 3: Check if demo organization exists
console.log('\n3️⃣ Checking demo organization...')
const demoOrg = db.prepare('SELECT * FROM organizations WHERE id = ?').get('demo-org-1')
if (demoOrg) {
    console.log('✅ Demo organization found:', demoOrg.name)
} else {
    console.log('❌ Demo organization not found')
}

// Test 4: Check for any pending jobs
console.log('\n4️⃣ Checking for pending jobs...')
const pendingJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get('pending_review')
console.log(`📊 Pending jobs: ${pendingJobs.count}`)

// Test 5: Create a test job for admin review
console.log('\n5️⃣ Creating test job for admin review...')
const testJobId = `test-job-${Date.now()}`
const expiresAt = new Date()
expiresAt.setDate(expiresAt.getDate() + 30)

try {
    const insertJob = db.prepare(`
        INSERT INTO jobs (
            id, organization_id, posted_by_user_id, title, total_workers_needed,
            description, job_type, expected_start_date, working_hours,
            gender_preference, age_range_min, age_range_max, education_level,
            work_experience_years, language_preference, technical_skills,
            special_certifications, soft_skills, accommodation, electricity,
            meals, salary_min_ugx, salary_max_ugx, payment_mode, health_cover,
            transport_allowance, overtime_payments, bonus_payment,
            religious_affiliation, nationality_preference, ethnic_background_preference,
            status, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    insertJob.run(
        testJobId,
        'demo-org-1',
        'demo-user-1',
        'Test Farm Worker Position',
        2,
        'Looking for experienced farm workers to help with organic vegetable farming.',
        'full_time',
        new Date().toISOString(),
        'day_shift',
        'either',
        18,
        65,
        'not_specified',
        1,
        JSON.stringify(['English']),
        JSON.stringify(['Farming', 'Tractor Operation']),
        JSON.stringify([]),
        JSON.stringify(['Hardworking', 'Reliable']),
        'not_provided',
        'available',
        'provided',
        500000,
        800000,
        'mobile_money',
        'not_provided',
        'not_provided',
        'not_provided',
        'not_provided',
        'any',
        JSON.stringify(['uganda']),
        JSON.stringify(['any']),
        'pending_review',
        expiresAt.toISOString()
    )

    console.log('✅ Test job created successfully!')
    console.log(`   Job ID: ${testJobId}`)
    console.log(`   Status: pending_review`)
} catch (error) {
    console.log('❌ Failed to create test job:', error.message)
}

// Test 6: Verify the test job was created
console.log('\n6️⃣ Verifying test job...')
const testJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(testJobId)
if (testJob) {
    console.log('✅ Test job found:', testJob.title)
    console.log(`   Status: ${testJob.status}`)
} else {
    console.log('❌ Test job not found')
}

// Test 7: Count total pending jobs now
console.log('\n7️⃣ Final pending jobs count...')
const finalPendingJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE status = ?').get('pending_review')
console.log(`📊 Total pending jobs: ${finalPendingJobs.count}`)

console.log('\n🎉 Admin workflow test completed!')
console.log('\n📋 Next steps:')
console.log('1. Login as admin: admin@agrijobs.ug / admin123')
console.log('2. Go to Admin Panel')
console.log('3. Click on Jobs tab')
console.log('4. Review and approve/reject the test job')

db.close()

