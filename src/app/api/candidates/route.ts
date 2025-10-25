import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDatabase } from '@/lib/database'

// Get all job seekers/candidates
export async function GET(request: NextRequest) {
    try {
        // Initialize database if needed
        initializeDatabase(true)

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = parseInt(searchParams.get('offset') || '0')

        const candidates = db.prepare(`
            SELECT 
                u.id,
                u.first_name,
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
                ep.current_district,
                ep.current_sub_county,
                ep.agricultural_training,
                ep.previous_job_roles,
                ep.enterprise_types,
                ep.crops_cared_for,
                ep.livestock_cared_for,
                ep.apiculture_products,
                ep.horticulture_plants,
                ep.aquaculture_species,
                ep.agroforestry_trees,
                ep.sericulture_worms,
                ep.vermiculture_activities,
                ep.entomology_insects,
                ep.employer_references,
                ep.work_type_desired,
                ep.preferred_enterprise,
                ep.willingness_relocate,
                ep.willingness_remote,
                ep.preferred_working_hours,
                ep.deal_breaking_conditions
            FROM users u
            INNER JOIN employee_profiles ep ON u.id = ep.user_id
            WHERE u.role = 'job_seeker' AND u.is_active = 1
            ORDER BY u.created_at DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset) as any[]

        // Process candidates data
        const processedCandidates = candidates.map(candidate => {
            // Helper function to safely parse JSON arrays
            const safeParseJSON = (jsonString: string | null | undefined): string[] => {
                if (!jsonString || jsonString.trim() === '') return []
                try {
                    const parsed = JSON.parse(jsonString)
                    return Array.isArray(parsed) ? parsed : []
                } catch (error) {
                    console.warn('Failed to parse JSON:', jsonString, error)
                    return []
                }
            }

            return {
                id: candidate.id,
                firstName: candidate.first_name,
                createdAt: candidate.created_at,
                experience: candidate.experience_years ? `${candidate.experience_years} years` : 'No experience',
                skills: safeParseJSON(candidate.skills),
                educationLevel: candidate.education_level || 'Not specified',
                preferredLocations: safeParseJSON(candidate.preferred_locations),
                availabilityStatus: candidate.availability_status || 'available',
                salaryExpectation: {
                    min: candidate.salary_expectation_min || 0,
                    max: candidate.salary_expectation_max || 0
                },
                preferredJobTypes: safeParseJSON(candidate.preferred_job_types),
                languagesSpoken: safeParseJSON(candidate.languages_spoken),
                certifications: safeParseJSON(candidate.certifications),
                bio: candidate.bio || 'No bio available',
                location: `${candidate.current_district || 'Unknown'}, ${candidate.current_sub_county || 'Unknown'}`,
                availability: candidate.availability_status || 'available',
                // Additional fields for expanded view
                agriculturalTraining: safeParseJSON(candidate.agricultural_training),
                previousJobRoles: safeParseJSON(candidate.previous_job_roles),
                enterpriseTypes: safeParseJSON(candidate.enterprise_types),
                cropsCaredFor: safeParseJSON(candidate.crops_cared_for),
                livestockCaredFor: safeParseJSON(candidate.livestock_cared_for),
                apicultureProducts: safeParseJSON(candidate.apiculture_products),
                horticulturePlants: safeParseJSON(candidate.horticulture_plants),
                aquacultureSpecies: safeParseJSON(candidate.aquaculture_species),
                agroforestryTrees: safeParseJSON(candidate.agroforestry_trees),
                sericultureWorms: safeParseJSON(candidate.sericulture_worms),
                vermicultureActivities: safeParseJSON(candidate.vermiculture_activities),
                entomologyInsects: safeParseJSON(candidate.entomology_insects),
                employerReferences: safeParseJSON(candidate.employer_references),
                workTypeDesired: candidate.work_type_desired,
                preferredEnterprise: candidate.preferred_enterprise,
                willingnessRelocate: candidate.willingness_relocate,
                willingnessRemote: candidate.willingness_remote,
                preferredWorkingHours: candidate.preferred_working_hours,
                dealBreakingConditions: candidate.deal_breaking_conditions
            }
        })

        return NextResponse.json({ candidates: processedCandidates }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch candidates:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
