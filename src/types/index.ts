export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    role: 'job_seeker' | 'employer' | 'admin'
    emailVerified: boolean
    lastLogin?: Date
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Organization {
    id: string
    name: string
    type: 'individual_farm' | 'cooperative' | 'agribusiness' | 'ngo' | 'government' | 'other'
    description?: string
    website?: string
    logoUrl?: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UserOrganization {
    id: string
    userId: string
    organizationId: string
    role: 'owner' | 'manager' | 'recruiter' | 'viewer'
    isPrimary: boolean
    joinedAt: Date
    createdAt: Date
    user?: User
    organization?: Organization
}

export interface JobSeeker extends User {
    role: 'job_seeker'
    skills: string[]
    experience: string
    preferredJobTypes: JobType[]
    availability: 'full_time' | 'part_time' | 'seasonal' | 'internship'
    resume?: string
    certifications?: string[]
}

export interface Employer extends User {
    role: 'employer'
    organizations: UserOrganization[]
}

// Organization details (extends Organization with farm-specific info)
export interface OrganizationDetails {
    id: string
    organizationId: string
    organizationType: EnterpriseType
    enterpriseType: EnterpriseType
    mainEnterprises: string[] // ranked by importance
    location: {
        district: string
        subCounty: string
        parish: string
        village: string
    }
    farmSize: number // acres
    farmStage: FarmStage
    contactPerson: {
        name: string
        title: string
    }
    whatsappContact: string
    email: string
    createdAt: Date
    updatedAt: Date
}

export type UgandanRegion =
    | 'West Nile' | 'Acholi' | 'Karamoja' | 'Lango' | 'Teso' | 'Sebei' | 'Bunyoro'
    | 'Bukedi' | 'Bugisu' | 'Busoga' | 'Tooro' | 'Kigezi' | 'Rwenzori' | 'Ankole' | 'Buganda'

export type EnterpriseType =
    | 'individual_farm'
    | 'cooperative'
    | 'agribusiness'
    | 'ngo'
    | 'government'
    | 'other'
    | 'crop_farm'
    | 'livestock_farm'
    | 'mixed'
    | 'apiculture'
    | 'horticulture'
    | 'aquaculture'
    | 'agro_forestry'
    | 'sericulture'
    | 'vermiculture'
    | 'entomology_based_agriculture'

export type FarmStage = 'planning' | 'startup' | 'growing' | 'established'

// Job Details
export interface JobDetails {
    title: string
    totalWorkersNeeded: number
    description: string // job description
    jobType: 'full_time' | 'part_time' | 'seasonal' | 'contract'
    contractDuration?: number // months
    expectedStartDate: Date
    workingHours: 'day_shift' | 'night_shift' | 'rotational'
}

// Worker Requirements
export interface WorkerRequirements {
    genderPreference: 'male' | 'female' | 'either'
    ageRange: {
        min: number
        max: number
    }
    educationLevel: 'primary' | 'secondary' | 'certificate' | 'diploma' | 'degree' | 'not_specified'
    workExperience: number // years
    languagePreference: string[]
    technicalSkills: string[]
    specialCertifications: string[]
    softSkills: string[]
}

// Work Conditions & Benefits
export interface WorkConditions {
    accommodation: 'provided' | 'not_provided'
    electricity: 'available' | 'not_available'
    meals: 'provided' | 'not_provided'
    salaryRange: {
        min: number
        max: number
    }
    paymentMode: 'mobile_money' | 'bank_transfer' | 'cash'
    healthCover: 'provided' | 'not_provided'
    transportAllowance: 'provided' | 'not_provided'
    overtimePayments: 'provided' | 'not_provided'
    bonusPayment: 'provided' | 'not_provided'
}

// Additional Preferences
export interface AdditionalPreferences {
    religiousAffiliation: 'christianity' | 'islam' | 'any'
    nationality: Nationality[]
    ethnicBackground: EthnicBackground[]
    remarks?: string
}

export type Nationality =
    | 'uganda' | 'kenya' | 'tanzania' | 'rwanda' | 'dr_congo'
    | 'burundi' | 'sudan' | 'somalia' | 'ethiopia' | 'eritrea'
    | 'djibouti'

export type EthnicBackground =
    | 'west_nile' | 'acholi' | 'karamoja' | 'lango' | 'teso'
    | 'sebei' | 'bunyoro' | 'bukedi' | 'bugisu' | 'busoga'
    | 'tooro' | 'kigezi' | 'rwenzori' | 'ankole' | 'buganda'
    | 'any'

export interface Job {
    id: string
    organizationId: string
    postedByUserId: string
    organization: Organization
    postedByUser: User
    organizationDetails: OrganizationDetails
    jobDetails: JobDetails
    workerRequirements: WorkerRequirements
    workConditions: WorkConditions
    additionalPreferences: AdditionalPreferences
    postedAt: Date
    expiresAt: Date
    isActive: boolean
    applicationsCount: number
    status: 'draft' | 'pending_review' | 'approved' | 'rejected'
}

export type JobType =
    | 'harvest'
    | 'livestock'
    | 'irrigation'
    | 'crop_production'
    | 'equipment_operation'
    | 'farm_management'
    | 'agricultural_research'
    | 'sales_marketing'
    | 'logistics'
    | 'maintenance'

export interface Application {
    id: string
    jobId: string
    jobSeekerId: string
    jobSeeker: JobSeeker
    job: Job
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired'
    appliedAt: Date
    coverLetter?: string
    notes?: string
}

export interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: Date
    isRead: boolean
}

export interface Analytics {
    totalJobs: number
    totalUsers: number
    totalApplications: number
    jobsByRegion: Record<string, number>
    skillsInDemand: Array<{ skill: string; count: number }>
    monthlyTrends: Array<{ month: string; jobs: number; applications: number }>
}

// Employee Profile Types
export interface EmployeeProfile {
    id: string
    userId: string

    // Section 1: Personal Information
    fullName: string
    gender: 'male' | 'female' | 'other'
    dateOfBirth: string
    currentDistrict: string
    currentSubCounty: string
    currentParish: string
    currentVillage: string
    nationalId?: string
    whatsappContact: string
    email: string
    workingProfileDescription: string

    // Section 2: Education & Training
    highestEducationLevel: 'primary' | 'secondary' | 'certificate' | 'diploma' | 'degree' | 'masters' | 'phd'
    qualifications?: { level: string; name: string }[]
    agriculturalTraining?: string[]
    languagesSpoken: string[]

    // Section 3: Work Experience
    yearsExperience: number
    previousJobRoles: string[]
    enterpriseTypes: EnterpriseType[]
    cropsCaredFor?: string[]
    livestockCaredFor?: string[]
    apicultureProducts?: string[]
    horticulturePlants?: string[]
    aquacultureSpecies?: string[]
    agroforestryTrees?: string[]
    sericultureWorms?: string[]
    vermicultureActivities?: string[]
    entomologyInsects?: string[]
    employerReferences?: EmployerReference[]

    // Section 4: Technical Competencies (Checkbox selections)
    technicalSkills: string[]
    entrepreneurialSkills: string[]
    specializedSkills: string[]
    softSkills: string[]

    // Section 5: Job Preferences
    workTypeDesired: 'permanent' | 'seasonal' | 'internship' | 'part_time'
    preferredEnterprise: 'crops' | 'livestock' | 'mixed' | 'apiculture' | 'horticulture' | 'aquaculture' | 'agroforestry' | 'any'
    preferredRegions: UgandanRegion[]
    expectedSalaryMin: number
    expectedSalaryMax: number
    willingnessRelocate: 'yes' | 'no'
    willingnessRemote: 'yes' | 'no'
    preferredWorkingHours: 'day_shift' | 'night_shift' | 'rotational'
    dealBreakingConditions?: string

    // File attachments
    attachments?: FileAttachment[]

    createdAt: Date
    updatedAt: Date
}

export interface EmployerReference {
    farmName: string
    contactName: string
    telephone: string
}

export interface FileAttachment {
    type: 'cv' | 'academic_certificates' | 'academic_transcripts' | 'short_course_certificates' | 'national_id' | 'drivers_license'
    fileName: string
    fileUrl: string
    uploadedAt: Date
}
