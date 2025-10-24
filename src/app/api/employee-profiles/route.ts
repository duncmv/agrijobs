import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/database'

// Get employee profile by user ID
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        const profile = db.prepare(`
            SELECT * FROM employee_profiles WHERE user_id = ?
        `).get(userId) as any

        if (!profile) {
            return NextResponse.json({ profile: null }, { status: 200 })
        }

        // Parse JSON fields
        const processedProfile = {
            ...profile,
            languagesSpoken: profile.languages_spoken ? JSON.parse(profile.languages_spoken) : [],
            previousJobRoles: profile.previous_job_roles ? JSON.parse(profile.previous_job_roles) : [],
            enterpriseTypes: profile.enterprise_types ? JSON.parse(profile.enterprise_types) : [],
            cropsCaredFor: profile.crops_cared_for ? JSON.parse(profile.crops_cared_for) : [],
            livestockCaredFor: profile.livestock_cared_for ? JSON.parse(profile.livestock_cared_for) : [],
            apicultureProducts: profile.apiculture_products ? JSON.parse(profile.apiculture_products) : [],
            horticulturePlants: profile.horticulture_plants ? JSON.parse(profile.horticulture_plants) : [],
            aquacultureSpecies: profile.aquaculture_species ? JSON.parse(profile.aquaculture_species) : [],
            agroforestryTrees: profile.agroforestry_trees ? JSON.parse(profile.agroforestry_trees) : [],
            sericultureWorms: profile.sericulture_worms ? JSON.parse(profile.sericulture_worms) : [],
            vermicultureActivities: profile.vermiculture_activities ? JSON.parse(profile.vermiculture_activities) : [],
            entomologyInsects: profile.entomology_insects ? JSON.parse(profile.entomology_insects) : [],
            employerReferences: profile.employer_references ? JSON.parse(profile.employer_references) : [],
            technicalSkills: profile.technical_skills ? JSON.parse(profile.technical_skills) : [],
            preferredRegions: profile.preferred_regions ? JSON.parse(profile.preferred_regions) : [],
            attachments: profile.attachments ? JSON.parse(profile.attachments) : []
        }

        return NextResponse.json({ profile: processedProfile }, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch employee profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Create or update employee profile
export async function POST(request: NextRequest) {
    try {
        const data = await request.json()
        const { userId, ...profileData } = data

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Validate required fields
        const requiredFields = [
            'fullName', 'gender', 'dateOfBirth', 'currentDistrict', 'currentSubCounty',
            'currentParish', 'currentVillage', 'whatsappContact', 'email', 'workingProfileDescription',
            'highestEducationLevel', 'languagesSpoken', 'yearsExperience', 'previousJobRoles',
            'enterpriseTypes', 'technicalSkills', 'preferredRegions', 'workTypeDesired',
            'preferredEnterprise', 'expectedSalaryMin', 'expectedSalaryMax', 'willingnessRelocate',
            'willingnessRemote', 'preferredWorkingHours'
        ]

        const missingFields = requiredFields.filter(field => {
            const value = profileData[field]
            return !value || (Array.isArray(value) && value.length === 0)
        })

        if (missingFields.length > 0) {
            return NextResponse.json({
                error: `Missing required fields: ${missingFields.join(', ')}`
            }, { status: 400 })
        }

        // Check if profile exists
        const existingProfile = db.prepare(`
            SELECT id FROM employee_profiles WHERE user_id = ?
        `).get(userId)

        const profileId = existingProfile?.id || `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        if (existingProfile) {
            // Update existing profile
            const updateQuery = `
                UPDATE employee_profiles SET
                    full_name = ?, gender = ?, date_of_birth = ?, current_district = ?, current_sub_county = ?,
                    current_parish = ?, current_village = ?, national_id = ?, whatsapp_contact = ?,
                    email = ?, working_profile_description = ?, highest_education_level = ?,
                    qualifications = ?, agricultural_training = ?, languages_spoken = ?,
                    years_experience = ?, previous_job_roles = ?, enterprise_types = ?,
                    crops_cared_for = ?, livestock_cared_for = ?, apiculture_products = ?,
                    horticulture_plants = ?, aquaculture_species = ?, agroforestry_trees = ?,
                    sericulture_worms = ?, vermiculture_activities = ?, entomology_insects = ?,
                    employer_references = ?, technical_skills = ?, entrepreneurial_skills = ?,
                    specialized_skills = ?, soft_skills = ?, preferred_regions = ?,
                    work_type_desired = ?, preferred_enterprise = ?, expected_salary_min = ?,
                    expected_salary_max = ?, willingness_relocate = ?, willingness_remote = ?,
                    preferred_working_hours = ?, deal_breaking_conditions = ?, attachments = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            `

            const updateStmt = db.prepare(updateQuery)
            updateStmt.run(
                profileData.fullName,
                profileData.gender,
                profileData.dateOfBirth,
                profileData.currentDistrict,
                profileData.currentSubCounty,
                profileData.currentParish,
                profileData.currentVillage,
                profileData.nationalId || null,
                profileData.whatsappContact,
                profileData.email,
                profileData.workingProfileDescription,
                profileData.highestEducationLevel,
                JSON.stringify(profileData.qualifications || []),
                JSON.stringify(profileData.agriculturalTraining || []),
                JSON.stringify(profileData.languagesSpoken || []),
                profileData.yearsExperience,
                JSON.stringify(profileData.previousJobRoles || []),
                JSON.stringify(profileData.enterpriseTypes || []),
                JSON.stringify(profileData.cropsCaredFor || []),
                JSON.stringify(profileData.livestockCaredFor || []),
                JSON.stringify(profileData.apicultureProducts || []),
                JSON.stringify(profileData.horticulturePlants || []),
                JSON.stringify(profileData.aquacultureSpecies || []),
                JSON.stringify(profileData.agroforestryTrees || []),
                JSON.stringify(profileData.sericultureWorms || []),
                JSON.stringify(profileData.vermicultureActivities || []),
                JSON.stringify(profileData.entomologyInsects || []),
                JSON.stringify(profileData.employerReferences || []),
                JSON.stringify(profileData.technicalSkills || []),
                JSON.stringify(profileData.entrepreneurialSkills || []),
                JSON.stringify(profileData.specializedSkills || []),
                JSON.stringify(profileData.softSkills || []),
                JSON.stringify(profileData.preferredRegions || []),
                profileData.workTypeDesired,
                profileData.preferredEnterprise,
                profileData.expectedSalaryMin,
                profileData.expectedSalaryMax,
                profileData.willingnessRelocate,
                profileData.willingnessRemote,
                profileData.preferredWorkingHours,
                profileData.dealBreakingConditions || null,
                JSON.stringify(profileData.attachments || []),
                userId
            )
        } else {
            // Create new profile
            const insertQuery = `
                INSERT INTO employee_profiles (
                    id, user_id, full_name, gender, date_of_birth, current_district, current_sub_county,
                    current_parish, current_village, national_id, whatsapp_contact, email,
                    working_profile_description, highest_education_level, qualifications,
                    agricultural_training, languages_spoken, years_experience, previous_job_roles,
                    enterprise_types, crops_cared_for, livestock_cared_for, apiculture_products,
                    horticulture_plants, aquaculture_species, agroforestry_trees, sericulture_worms,
                    vermiculture_activities, entomology_insects, employer_references, technical_skills,
                    entrepreneurial_skills, specialized_skills, soft_skills, preferred_regions, 
                    work_type_desired, preferred_enterprise, expected_salary_min,
                    expected_salary_max, willingness_relocate, willingness_remote, preferred_working_hours,
                    deal_breaking_conditions, attachments
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `

            const insertStmt = db.prepare(insertQuery)
            insertStmt.run(
                profileId,
                userId,
                profileData.fullName,
                profileData.gender,
                profileData.dateOfBirth,
                profileData.currentDistrict,
                profileData.currentSubCounty,
                profileData.currentParish,
                profileData.currentVillage,
                profileData.nationalId || null,
                profileData.whatsappContact,
                profileData.email,
                profileData.workingProfileDescription,
                profileData.highestEducationLevel,
                JSON.stringify(profileData.qualifications || []),
                JSON.stringify(profileData.agriculturalTraining || []),
                JSON.stringify(profileData.languagesSpoken || []),
                profileData.yearsExperience,
                JSON.stringify(profileData.previousJobRoles || []),
                JSON.stringify(profileData.enterpriseTypes || []),
                JSON.stringify(profileData.cropsCaredFor || []),
                JSON.stringify(profileData.livestockCaredFor || []),
                JSON.stringify(profileData.apicultureProducts || []),
                JSON.stringify(profileData.horticulturePlants || []),
                JSON.stringify(profileData.aquacultureSpecies || []),
                JSON.stringify(profileData.agroforestryTrees || []),
                JSON.stringify(profileData.sericultureWorms || []),
                JSON.stringify(profileData.vermicultureActivities || []),
                JSON.stringify(profileData.entomologyInsects || []),
                JSON.stringify(profileData.employerReferences || []),
                JSON.stringify(profileData.technicalSkills || []),
                JSON.stringify(profileData.entrepreneurialSkills || []),
                JSON.stringify(profileData.specializedSkills || []),
                JSON.stringify(profileData.softSkills || []),
                JSON.stringify(profileData.preferredRegions || []),
                profileData.workTypeDesired,
                profileData.preferredEnterprise,
                profileData.expectedSalaryMin,
                profileData.expectedSalaryMax,
                profileData.willingnessRelocate,
                profileData.willingnessRemote,
                profileData.preferredWorkingHours,
                profileData.dealBreakingConditions || null,
                JSON.stringify(profileData.attachments || [])
            )
        }

        return NextResponse.json({
            success: true,
            message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
            profileId
        }, { status: 200 })

    } catch (error) {
        console.error('Failed to save employee profile:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
