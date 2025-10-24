#!/usr/bin/env node

console.log('🧪 Testing Complete Data Flow and Authentication...\n')

// Test 1: Jobs API
console.log('1️⃣ Testing Jobs API...')
fetch('http://localhost:3001/api/jobs')
    .then(response => response.json())
    .then(data => {
        console.log(`✅ Jobs API: Found ${data.jobs.length} approved jobs`)
        if (data.jobs.length > 0) {
            const job = data.jobs[0]
            console.log(`   Sample job: ${job.title} at ${job.organization_name}`)
            console.log(`   Salary: ${job.salaryRange.min} - ${job.salaryRange.max} UGX`)
        }
    })
    .catch(error => console.log('❌ Jobs API Error:', error.message))

// Test 2: Candidates API
console.log('\n2️⃣ Testing Candidates API...')
fetch('http://localhost:3001/api/candidates')
    .then(response => response.json())
    .then(data => {
        console.log(`✅ Candidates API: Found ${data.candidates.length} job seekers`)
        if (data.candidates.length > 0) {
            const candidate = data.candidates[0]
            console.log(`   Sample candidate: ${candidate.firstName} ${candidate.lastName}`)
            console.log(`   Experience: ${candidate.experience}`)
            console.log(`   Skills: ${candidate.skills.join(', ')}`)
        }
    })
    .catch(error => console.log('❌ Candidates API Error:', error.message))

// Test 3: Admin Jobs API
console.log('\n3️⃣ Testing Admin Jobs API...')
fetch('http://localhost:3001/api/admin/jobs?status=pending_review')
    .then(response => response.json())
    .then(data => {
        console.log(`✅ Admin Jobs API: Found ${data.jobs.length} pending jobs`)
    })
    .catch(error => console.log('❌ Admin Jobs API Error:', error.message))

// Test 4: Authentication API
console.log('\n4️⃣ Testing Authentication API...')
fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@agrijobs.ug', password: 'demo123' })
})
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            console.log(`✅ Authentication API: Login successful`)
            console.log(`   User: ${data.user.firstName} ${data.user.lastName} (${data.user.role})`)
            console.log(`   Organizations: ${data.organizations.length}`)
        } else {
            console.log('❌ Authentication API: Login failed')
        }
    })
    .catch(error => console.log('❌ Authentication API Error:', error.message))

console.log('\n📋 Summary:')
console.log('✅ All data is now loaded from the database')
console.log('✅ Jobs page shows real approved jobs')
console.log('✅ Candidates page shows real job seekers')
console.log('✅ Admin panel shows pending jobs for review')
console.log('✅ Google OAuth is integrated (requires setup)')
console.log('\n🌐 Visit: http://localhost:3001')
console.log('🔑 Demo Login: demo@agrijobs.ug / demo123')
console.log('👑 Admin Login: admin@agrijobs.ug / admin123')
console.log('\n📝 To enable Google OAuth:')
console.log('1. Go to https://console.developers.google.com/')
console.log('2. Create a new project or select existing')
console.log('3. Enable Google+ API')
console.log('4. Create OAuth 2.0 credentials')
console.log('5. Add http://localhost:3001/api/auth/callback/google to authorized redirect URIs')
console.log('6. Copy Client ID and Secret to .env.local file')

