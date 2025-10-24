'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    MapPin,
    Clock,
    DollarSign,
    Users,
    Calendar,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Briefcase,
    Settings
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
    OrganizationDetails,
    JobDetails,
    WorkerRequirements,
    WorkConditions,
    AdditionalPreferences
} from '@/types'

interface JobPreviewProps {
    organizationDetails: OrganizationDetails
    jobDetails: JobDetails
    workerRequirements: WorkerRequirements
    workConditions: WorkConditions
    additionalPreferences: AdditionalPreferences
    onEdit: () => void
    onSubmit: () => void
}

export function JobPreview({
    organizationDetails,
    jobDetails,
    workerRequirements,
    workConditions,
    additionalPreferences,
    onEdit,
    onSubmit
}: JobPreviewProps) {
    const getEnterpriseTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'crop_farm': 'Crop Farm',
            'livestock_farm': 'Livestock Farm',
            'mixed': 'Mixed',
            'apiculture': 'Apiculture',
            'horticulture': 'Horticulture',
            'aquaculture': 'Aquaculture',
            'agro_forestry': 'Agro Forestry',
            'sericulture': 'Sericulture',
            'vermiculture': 'Vermiculture',
            'entomology_based_agriculture': 'Entomology Based Agriculture',
            'other': 'Other'
        }
        return types[type] || type
    }

    const getFarmStageLabel = (stage: string) => {
        const stages: Record<string, string> = {
            'planning': 'Planning',
            'startup': 'Start-up',
            'growing': 'Growing',
            'established': 'Established'
        }
        return stages[stage] || stage
    }

    const getJobTypeLabel = (type: string) => {
        const types: Record<string, string> = {
            'full_time': 'Full-time',
            'part_time': 'Part-time',
            'seasonal': 'Seasonal',
            'contract': 'Contract'
        }
        return types[type] || type
    }

    const getEducationLabel = (level: string) => {
        const levels: Record<string, string> = {
            'primary': 'Primary',
            'secondary': 'Secondary',
            'certificate': 'Certificate',
            'diploma': 'Diploma',
            'degree': 'Degree',
            'not_specified': 'Not specified'
        }
        return levels[level] || level
    }

    const getPaymentModeLabel = (mode: string) => {
        const modes: Record<string, string> = {
            'mobile_money': 'Mobile Money',
            'bank_transfer': 'Bank Transfer',
            'cash': 'Cash'
        }
        return modes[mode] || mode
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Posting Preview</h2>
                <p className="text-gray-600">Review your job posting before submitting for approval</p>
            </div>

            {/* Organization Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span>Organization Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-900">{organizationDetails.organizationId}</h4>
                            <p className="text-sm text-gray-600">{getEnterpriseTypeLabel(organizationDetails.enterpriseType)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                {organizationDetails.location.district}, {organizationDetails.location.subCounty}
                            </p>
                            <p className="text-sm text-gray-500">
                                {organizationDetails.location.parish}, {organizationDetails.location.village}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Farm Size</p>
                            <p className="text-sm text-gray-600">{organizationDetails.farmSize} acres</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Farm Stage</p>
                            <p className="text-sm text-gray-600">{getFarmStageLabel(organizationDetails.farmStage)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Contact Person</p>
                            <p className="text-sm text-gray-600">{organizationDetails.contactPerson.name}</p>
                            <p className="text-xs text-gray-500">{organizationDetails.contactPerson.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{organizationDetails.whatsappContact}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{organizationDetails.email}</span>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Main Enterprises</p>
                        <div className="flex flex-wrap gap-2">
                            {organizationDetails.mainEnterprises.filter(e => e.trim()).map((enterprise, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                    {enterprise}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span>Job Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">{jobDetails.title}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Total Workers Needed</p>
                            <p className="text-sm text-gray-600">{jobDetails.totalWorkersNeeded}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Job Type</p>
                            <p className="text-sm text-gray-600">{getJobTypeLabel(jobDetails.jobType)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Working Hours</p>
                            <p className="text-sm text-gray-600">{jobDetails.workingHours.replace('_', ' ')}</p>
                        </div>
                    </div>

                    {jobDetails.contractDuration && (
                        <div>
                            <p className="text-sm font-medium text-gray-700">Contract Duration</p>
                            <p className="text-sm text-gray-600">{jobDetails.contractDuration} months</p>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                            Expected Start Date: {formatDate(jobDetails.expectedStartDate)}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Job Description</p>
                        <p className="text-sm text-gray-600">{jobDetails.description}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Worker Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span>Worker Requirements</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Gender Preference</p>
                            <p className="text-sm text-gray-600">{workerRequirements.genderPreference}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Age Range</p>
                            <p className="text-sm text-gray-600">{workerRequirements.ageRange.min} - {workerRequirements.ageRange.max} years</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Education Level</p>
                            <p className="text-sm text-gray-600">{getEducationLabel(workerRequirements.educationLevel)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Work Experience</p>
                            <p className="text-sm text-gray-600">{workerRequirements.workExperience} years</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Language Preference</p>
                        <div className="flex flex-wrap gap-2">
                            {workerRequirements.languagePreference.filter(l => l.trim()).map((language, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                    {language}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Technical Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {workerRequirements.technicalSkills.filter(s => s.trim()).map((skill, index) => (
                                <span key={index} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Special Certifications</p>
                        <div className="flex flex-wrap gap-2">
                            {workerRequirements.specialCertifications.filter(c => c.trim()).map((cert, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Soft Skills</p>
                        <div className="flex flex-wrap gap-2">
                            {workerRequirements.softSkills.filter(s => s.trim()).map((skill, index) => (
                                <span key={index} className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Work Conditions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span>Work Conditions & Benefits</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Monthly Salary Range</p>
                            <p className="text-sm text-gray-600">
                                {formatCurrency(workConditions.salaryRange.min)} - {formatCurrency(workConditions.salaryRange.max)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Payment Mode</p>
                            <p className="text-sm text-gray-600">{getPaymentModeLabel(workConditions.paymentMode)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            {workConditions.accommodation === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Accommodation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.electricity === 'available' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Electricity</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.meals === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Meals</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.healthCover === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Health Cover</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.transportAllowance === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Transport</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.overtimePayments === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Overtime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            {workConditions.bonusPayment === 'provided' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">Bonus</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Additional Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-green-600" />
                        <span>Additional Preferences</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Religious Affiliation</p>
                            <p className="text-sm text-gray-600">{additionalPreferences.religiousAffiliation}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Nationality Preference</p>
                            <div className="flex flex-wrap gap-1">
                                {additionalPreferences.nationality.map((nationality, index) => (
                                    <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                                        {nationality}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Ethnic Background Preference</p>
                        <div className="flex flex-wrap gap-1">
                            {additionalPreferences.ethnicBackground.map((background, index) => (
                                <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs">
                                    {background.replace('_', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>

                    {additionalPreferences.remarks && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Additional Remarks</p>
                            <p className="text-sm text-gray-600">{additionalPreferences.remarks}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onEdit}>
                    Edit Job Posting
                </Button>
                <Button onClick={onSubmit}>
                    Submit for Review
                </Button>
            </div>
        </div>
    )
}
