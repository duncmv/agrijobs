import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

// Get all job seekers/candidates
export async function GET(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase()

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const candidates = db.prepare(`
            SELECT 
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                u.created_at,
                ep.years_experience as experience_years,
                ep.technical_skills as skills,
                ep.highest_education_level as education_level,
                ep.preferred_regions as preferred_locations,
                'available' as availability_status,
                ep.expected_salary_min as salary_expectation_min,
                ep.expected_salary_max as salary_expectation_max,
                ep.work_type_desired as preferred_job_types,
                ep.languages_spoken,
                ep.relevant_certificates as certifications,
                ep.working_profile_description as bio,
                NULL as profile_picture_url
            FROM users u
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            WHERE u.role = 'job_seeker' AND u.is_active = 1
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset) as any[]

        // Process candidates data
        const processedCandidates = candidates.map(candidate => ({
            id: candidate.id,
            firstName: candidate.first_name,
            lastName: candidate.last_name,
            email: candidate.email,
            phone: candidate.phone,
            createdAt: candidate.created_at,
            experience: candidate.experience_years ? `${candidate.experience_years} years` : 'No experience',
            skills: candidate.skills ? JSON.parse(candidate.skills) : [],
            educationLevel: candidate.education_level || 'Not specified',
            preferredLocations: candidate.preferred_locations ? JSON.parse(candidate.preferred_locations) : [],
            availabilityStatus: candidate.availability_status || 'available',
            salaryExpectation: {
                min: candidate.salary_expectation_min || 0,
                max: candidate.salary_expectation_max || 0
            },
            preferredJobTypes: candidate.preferred_job_types ? JSON.parse(candidate.preferred_job_types) : [],
            languagesSpoken: candidate.languages_spoken ? JSON.parse(candidate.languages_spoken) : [],
            certifications: candidate.certifications ? JSON.parse(candidate.certifications) : [],
            bio: candidate.bio || 'No bio available',
            profilePictureUrl: candidate.profile_picture_url,
            location: candidate.preferred_locations ? JSON.parse(candidate.preferred_locations)[0] || 'Uganda' : 'Uganda',
            availability: candidate.availability_status || 'available'
        }))

        return NextResponse.json({ candidates: processedCandidates }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch candidates:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
