const Database = require('better-sqlite3')
const path = require('path')

// Connect to the existing database
const dbPath = path.join(process.cwd(), 'dev.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

console.log('🧪 Testing job insertion...')

try {
    // Try to insert a simple job
    const insertJob = db.prepare(`
        INSERT INTO jobs (
            id, organization_id, posted_by_user_id, title, total_workers_needed, description,
            job_type, contract_duration_months, expected_start_date, working_hours,
            gender_preference, age_range_min, age_range_max, education_level, work_experience_years,
            language_preference, technical_skills, special_certifications, soft_skills,
            accommodation, electricity, meals, salary_min_ugx, salary_max_ugx, payment_mode,
            health_cover, transport_allowance, overtime_payments, bonus_payment,
            religious_affiliation, nationality_preference, ethnic_background_preference,
            remarks, status, posted_at, expires_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertJob.run(
        'test-job-1',                    // id
        'org-1',                         // organization_id
        'duncan-asiimwe-1',              // posted_by_user_id
        'Test Job',                      // title
        1,                               // total_workers_needed
        'Test job description',          // description
        'full_time',                     // job_type
        12,                              // contract_duration_months
        '2024-02-01',                    // expected_start_date
        'day_shift',                     // working_hours
        'either',                        // gender_preference
        18,                              // age_range_min
        45,                              // age_range_max
        'secondary',                     // education_level
        2,                               // work_experience_years
        JSON.stringify(['English']),     // language_preference
        JSON.stringify(['test_skill']),  // technical_skills
        JSON.stringify([]),              // special_certifications
        JSON.stringify(['teamwork']),    // soft_skills
        'provided',                      // accommodation
        'available',                     // electricity
        'provided',                      // meals
        800000,                          // salary_min_ugx
        1200000,                         // salary_max_ugx
        'bank_transfer',                 // payment_mode
        'provided',                      // health_cover
        'provided',                      // transport_allowance
        'provided',                      // overtime_payments
        'provided',                      // bonus_payment
        'any',                           // religious_affiliation
        JSON.stringify(['Ugandan']),     // nationality_preference
        JSON.stringify(['any']),         // ethnic_background_preference
        'Test remarks',                  // remarks
        'approved',                      // status
        new Date().toISOString(),        // posted_at
        '2024-12-31',                    // expires_at
        1                                // is_active
    )

    console.log('✅ Test job inserted successfully!')
    console.log('Result:', result)

    // Check if the job was actually inserted
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get('test-job-1')
    console.log('Retrieved job:', job)

} catch (error) {
    console.error('❌ Job insertion failed:', error.message)
    console.error('Error details:', error)
} finally {
    db.close()
}
