#!/usr/bin/env node

console.log('🧪 Testing Admin Job Review Workflow...\n')

// Test 1: Check if admin jobs API works
console.log('1️⃣ Testing admin jobs API...')
fetch('http://localhost:3001/api/admin/jobs?status=pending_review')
    .then(response => response.json())
    .then(data => {
        console.log(`✅ Found ${data.jobs.length} pending jobs`)
        if (data.jobs.length > 0) {
            const firstJob = data.jobs[0]
            console.log(`   First job: ${firstJob.title} (ID: ${firstJob.id})`)

            // Test 2: Check if job detail API works
            console.log('\n2️⃣ Testing job detail API...')
            return fetch(`http://localhost:3001/api/admin/jobs/${firstJob.id}`)
        }
    })
    .then(response => {
        if (response) {
            return response.json()
        }
    })
    .then(data => {
        if (data && data.job) {
            console.log(`✅ Job details retrieved successfully`)
            console.log(`   Job: ${data.job.title}`)
            console.log(`   Organization: ${data.job.organization_name}`)
            console.log(`   Posted by: ${data.job.posted_by_name}`)
            console.log(`   Status: ${data.job.status}`)
        }
    })
    .catch(error => {
        console.log('❌ Error:', error.message)
    })

console.log('\n📋 Next steps:')
console.log('1. Login as admin: admin@agrijobs.ug / admin123')
console.log('2. Go to Admin Panel → Jobs tab')
console.log('3. Click "Review Details" on any pending job')
console.log('4. Approve or reject the job')

