'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { JobPreview } from '@/components/JobPreview'
import {
    ArrowLeft,
    ArrowRight,
    Check,
    MapPin,
    Briefcase,
    Users,
    DollarSign,
    Settings,
    Plus,
    X,
    Eye
} from 'lucide-react'
import {
    OrganizationDetails,
    JobDetails,
    WorkerRequirements,
    WorkConditions,
    AdditionalPreferences,
    EnterpriseType,
    FarmStage,
    Nationality,
    EthnicBackground
} from '@/types'

interface JobPostingFormProps {
    onSubmit: (data: {
        organizationDetails: OrganizationDetails
        jobDetails: JobDetails
        workerRequirements: WorkerRequirements
        workConditions: WorkConditions
        additionalPreferences: AdditionalPreferences
    }) => void
    selectedOrganizationId?: string
}

export function JobPostingForm({ onSubmit, selectedOrganizationId }: JobPostingFormProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoadingOrgDetails, setIsLoadingOrgDetails] = useState(false)
    const [formData, setFormData] = useState({
        organizationDetails: {
            id: '',
            organizationId: selectedOrganizationId || '',
            organizationName: '',
            enterpriseType: 'individual_farm' as EnterpriseType,
            mainEnterprises: [''],
            location: {
                district: '',
                subCounty: '',
                parish: '',
                village: ''
            },
            farmSize: 0,
            farmStage: 'established' as FarmStage,
            contactPerson: {
                name: '',
                title: ''
            },
            whatsappContact: '',
            email: '',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        jobDetails: {
            title: '',
            totalWorkersNeeded: 1,
            description: '',
            jobType: 'full_time' as 'full_time' | 'part_time' | 'seasonal' | 'contract',
            contractDuration: undefined,
            expectedStartDate: new Date(),
            workingHours: 'day_shift' as const
        },
        workerRequirements: {
            genderPreference: 'either' as const,
            ageRange: { min: 18, max: 65 },
            educationLevel: 'not_specified' as const,
            workExperience: 0,
            languagePreference: ['English'],
            technicalSkills: [''],
            specialCertifications: [''],
            softSkills: ['']
        },
        workConditions: {
            accommodation: 'not_provided' as const,
            electricity: 'not_available' as const,
            meals: 'not_provided' as const,
            salaryRange: { min: 0, max: 0 },
            paymentMode: 'mobile_money' as const,
            healthCover: 'not_provided' as const,
            transportAllowance: 'not_provided' as const,
            overtimePayments: 'not_provided' as const,
            bonusPayment: 'not_provided' as const
        },
        additionalPreferences: {
            religiousAffiliation: 'any' as const,
            nationality: ['uganda'] as Nationality[],
            ethnicBackground: ['any'] as EthnicBackground[],
            remarks: ''
        }
    })

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    // Update organizationId and fetch organization details when selectedOrganizationId prop changes
    useEffect(() => {
        if (selectedOrganizationId) {
            // First update the organizationId
            setFormData(prev => ({
                ...prev,
                organizationDetails: {
                    ...prev.organizationDetails,
                    organizationId: selectedOrganizationId
                }
            }))

            // If it's a new organization, don't fetch details - user will fill them out
            if (selectedOrganizationId !== 'new') {
                fetchOrganizationDetails(selectedOrganizationId)
            }
        }
    }, [selectedOrganizationId])

    const fetchOrganizationDetails = async (orgId: string) => {
        setIsLoadingOrgDetails(true)
        try {
            const response = await fetch(`/api/organizations/${orgId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch organization details')
            }

            const data = await response.json()

            if (data.organizationDetails) {
                setFormData(prev => ({
                    ...prev,
                    organizationDetails: {
                        ...prev.organizationDetails,
                        organizationId: orgId,
                        enterpriseType: data.organizationDetails.enterpriseType,
                        mainEnterprises: data.organizationDetails.mainEnterprises,
                        location: {
                            district: data.organizationDetails.location.district,
                            subCounty: data.organizationDetails.location.subCounty,
                            parish: data.organizationDetails.location.parish,
                            village: data.organizationDetails.location.village
                        },
                        farmSize: data.organizationDetails.farmSize,
                        farmStage: data.organizationDetails.farmStage,
                        contactPerson: {
                            name: data.organizationDetails.contactPerson.name,
                            title: data.organizationDetails.contactPerson.title
                        },
                        whatsappContact: data.organizationDetails.whatsappContact,
                        email: data.organizationDetails.email
                    }
                }))
            }
        } catch (error) {
            console.error('Failed to fetch organization details:', error)
        } finally {
            setIsLoadingOrgDetails(false)
        }
    }

    const steps = [
        { id: 1, title: 'Farm Details', icon: MapPin },
        { id: 2, title: 'Job Details', icon: Briefcase },
        { id: 3, title: 'Worker Requirements', icon: Users },
        { id: 4, title: 'Work Conditions', icon: DollarSign },
        { id: 5, title: 'Additional Preferences', icon: Settings },
        { id: 6, title: 'Preview & Submit', icon: Eye }
    ]

    const enterpriseTypes = [
        { value: 'individual_farm', label: 'Individual Farm' },
        { value: 'cooperative', label: 'Cooperative' },
        { value: 'agribusiness', label: 'Agribusiness' },
        { value: 'ngo', label: 'NGO' },
        { value: 'government', label: 'Government' },
        { value: 'other', label: 'Other' }
    ]

    const farmStages = [
        { value: 'planning', label: 'Planning' },
        { value: 'startup', label: 'Start-up' },
        { value: 'growing', label: 'Growing' },
        { value: 'established', label: 'Established' }
    ]

    const jobTypes = [
        { value: 'full_time', label: 'Full-time' },
        { value: 'part_time', label: 'Part-time' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'contract', label: 'Contract' }
    ]

    const workingHours = [
        { value: 'day_shift', label: 'Day shift' },
        { value: 'night_shift', label: 'Night shift' },
        { value: 'rotational', label: 'Rotational' }
    ]

    const educationLevels = [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'certificate', label: 'Certificate' },
        { value: 'diploma', label: 'Diploma' },
        { value: 'degree', label: 'Degree' },
        { value: 'not_specified', label: 'Not specified' }
    ]

    const paymentModes = [
        { value: 'mobile_money', label: 'Mobile Money' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'cash', label: 'Cash' }
    ]

    const nationalities = [
        { value: 'uganda', label: 'Uganda' },
        { value: 'kenya', label: 'Kenya' },
        { value: 'tanzania', label: 'Tanzania' },
        { value: 'rwanda', label: 'Rwanda' },
        { value: 'dr_congo', label: 'DR Congo' },
        { value: 'burundi', label: 'Burundi' },
        { value: 'sudan', label: 'Sudan' },
        { value: 'somalia', label: 'Somalia' },
        { value: 'ethiopia', label: 'Ethiopia' },
        { value: 'eritrea', label: 'Eritrea' },
        { value: 'djibouti', label: 'Djibouti' }
    ]

    const ethnicBackgrounds = [
        { value: 'west_nile', label: 'West Nile' },
        { value: 'acholi', label: 'Acholi' },
        { value: 'karamoja', label: 'Karamoja' },
        { value: 'lango', label: 'Lango' },
        { value: 'teso', label: 'Teso' },
        { value: 'sebei', label: 'Sebei' },
        { value: 'bunyoro', label: 'Bunyoro' },
        { value: 'bukedi', label: 'Bukedi' },
        { value: 'bugisu', label: 'Bugisu' },
        { value: 'busoga', label: 'Busoga' },
        { value: 'tooro', label: 'Tooro' },
        { value: 'kigezi', label: 'Kigezi' },
        { value: 'rwenzori', label: 'Rwenzori' },
        { value: 'ankole', label: 'Ankole' },
        { value: 'buganda', label: 'Buganda' },
        { value: 'any', label: 'Any' }
    ]

    const updateFormData = (section: keyof typeof formData, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
        // Clear field error when user starts typing
        clearFieldError(field)
    }

    const updateNestedFormData = (section: keyof typeof formData, parentField: string, childField: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parentField]: {
                    ...(prev[section] as any)[parentField],
                    [childField]: value
                }
            }
        }))
    }

    const addArrayItem = (section: keyof typeof formData, field: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: [...(prev[section] as any)[field], '']
            }
        }))
    }

    const removeArrayItem = (section: keyof typeof formData, field: string, index: number) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
            }
        }))
    }

    const updateArrayItem = (section: keyof typeof formData, field: string, index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: (prev[section] as any)[field].map((item: any, i: number) => i === index ? value : item)
            }
        }))
    }

    const nextStep = () => {
        // Validate current step before proceeding
        const validationResult = validateCurrentStep()
        if (!validationResult.isValid) {
            // Set field errors for highlighting
            const newErrors: Record<string, string> = {}
            validationResult.missingFields.forEach(field => {
                newErrors[field] = 'This field is required'
            })
            setFieldErrors(newErrors)

            // Also show alert for debugging
            const fieldLabels: Record<string, string> = {
                organizationName: 'Organization Name',
                enterpriseType: 'Enterprise Type',
                farmStage: 'Farm Stage',
                district: 'District',
                subCounty: 'Sub County',
                parish: 'Parish',
                village: 'Village',
                contactPersonName: 'Contact Person Name',
                whatsappContact: 'WhatsApp Contact',
                email: 'Email',
                title: 'Job Title',
                totalWorkersNeeded: 'Total Workers Needed',
                description: 'Job Description',
                jobType: 'Job Type',
                expectedStartDate: 'Expected Start Date',
                workingHours: 'Working Hours',
                genderPreference: 'Gender Preference',
                educationLevel: 'Education Level',
                ageRangeMin: 'Minimum Age',
                ageRangeMax: 'Maximum Age',
                workExperience: 'Work Experience',
                languagePreference: 'Language Preference',
                accommodation: 'Accommodation',
                electricity: 'Electricity/Solar Power',
                meals: 'Meals',
                salaryRangeMin: 'Minimum Salary (UGX)',
                salaryRangeMax: 'Maximum Salary (UGX)',
                paymentMode: 'Payment Mode'
            }

            const missingFieldLabels = validationResult.missingFields.map(field =>
                fieldLabels[field] || field
            )

            alert(`Please fill in all required fields in ${validationResult.stepName}:\n\n${missingFieldLabels.join('\n')}`)
            return
        }

        // Clear errors if validation passes
        setFieldErrors({})
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1)
        }
    }

    const validateCurrentStep = () => {
        const stepValidations = {
            1: {
                stepName: 'Organization Details',
                requiredFields: ['organizationName', 'enterpriseType', 'farmStage', 'district', 'subCounty', 'parish', 'village', 'contactPersonName', 'whatsappContact', 'email'],
                fieldLabels: {
                    organizationName: 'Organization Name',
                    enterpriseType: 'Enterprise Type',
                    farmStage: 'Farm Stage',
                    district: 'District',
                    subCounty: 'Sub County',
                    parish: 'Parish',
                    village: 'Village',
                    contactPersonName: 'Contact Person Name',
                    whatsappContact: 'WhatsApp Contact',
                    email: 'Email'
                }
            },
            2: {
                stepName: 'Job Details',
                requiredFields: ['title', 'totalWorkersNeeded', 'description', 'jobType', 'expectedStartDate', 'workingHours'],
                fieldLabels: {
                    title: 'Job Title',
                    totalWorkersNeeded: 'Total Workers Needed',
                    description: 'Job Description',
                    jobType: 'Job Type',
                    expectedStartDate: 'Expected Start Date',
                    workingHours: 'Working Hours'
                }
            },
            3: {
                stepName: 'Worker Requirements',
                requiredFields: ['genderPreference', 'educationLevel', 'ageRangeMin', 'ageRangeMax', 'workExperience', 'languagePreference'],
                fieldLabels: {
                    genderPreference: 'Gender Preference',
                    educationLevel: 'Education Level',
                    ageRangeMin: 'Minimum Age',
                    ageRangeMax: 'Maximum Age',
                    workExperience: 'Work Experience',
                    languagePreference: 'Language Preference'
                }
            },
            4: {
                stepName: 'Work Conditions & Benefits',
                requiredFields: ['accommodation', 'electricity', 'meals', 'salaryRangeMin', 'salaryRangeMax', 'paymentMode'],
                fieldLabels: {
                    accommodation: 'Accommodation',
                    electricity: 'Electricity/Solar Power',
                    meals: 'Meals',
                    salaryRangeMin: 'Minimum Salary (UGX)',
                    salaryRangeMax: 'Maximum Salary (UGX)',
                    paymentMode: 'Payment Mode'
                }
            },
            5: {
                stepName: 'Additional Preferences',
                requiredFields: [],
                fieldLabels: {}
            }
        }

        const currentStepValidation = stepValidations[currentStep as keyof typeof stepValidations]
        if (!currentStepValidation) {
            return { isValid: true, stepName: '', missingFields: [] }
        }

        const missingFields = currentStepValidation.requiredFields.filter(field => {
            // Access nested fields properly
            let value: any
            if (field === 'organizationName' || field === 'enterpriseType' || field === 'farmStage' || field === 'whatsappContact' || field === 'email') {
                value = formData.organizationDetails[field as keyof typeof formData.organizationDetails]
            } else if (field === 'district' || field === 'subCounty' || field === 'parish' || field === 'village') {
                value = formData.organizationDetails.location[field as keyof typeof formData.organizationDetails.location]
            } else if (field === 'contactPersonName') {
                value = formData.organizationDetails.contactPerson.name
            } else if (field === 'title' || field === 'totalWorkersNeeded' || field === 'description' || field === 'jobType' || field === 'expectedStartDate' || field === 'workingHours') {
                value = formData.jobDetails[field as keyof typeof formData.jobDetails]
            } else if (field === 'genderPreference' || field === 'educationLevel' || field === 'workExperience' || field === 'languagePreference') {
                value = formData.workerRequirements[field as keyof typeof formData.workerRequirements]
            } else if (field === 'ageRangeMin') {
                value = formData.workerRequirements.ageRange.min
            } else if (field === 'ageRangeMax') {
                value = formData.workerRequirements.ageRange.max
            } else if (field === 'accommodation' || field === 'electricity' || field === 'meals' || field === 'paymentMode') {
                value = formData.workConditions[field as keyof typeof formData.workConditions]
            } else if (field === 'salaryRangeMin') {
                value = formData.workConditions.salaryRange.min
            } else if (field === 'salaryRangeMax') {
                value = formData.workConditions.salaryRange.max
            }

            const isEmpty = value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)

            // Special case: workExperience of 0 is valid (no experience required)
            if (field === 'workExperience' && value === 0) {
                return false // Not empty
            }

            // Debug logging for workExperience
            if (field === 'workExperience') {
                console.log(`Work Experience validation: field=${field}, value=${value}, isEmpty=${isEmpty}, type=${typeof value}`)
            }

            return isEmpty
        })

        return {
            isValid: missingFields.length === 0,
            stepName: currentStepValidation.stepName,
            missingFields: missingFields // Return field names, not labels
        }
    }

    const getFieldError = (fieldName: string) => {
        return fieldErrors[fieldName]
    }

    const clearFieldError = (fieldName: string) => {
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldName]
                return newErrors
            })
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        onSubmit(formData)
    }

    const handleEdit = () => {
        setCurrentStep(1)
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            {formData.organizationDetails.organizationId === 'new' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                    <Input
                        value={formData.organizationDetails.organizationName || ''}
                        onChange={(e) => updateFormData('organizationDetails', 'organizationName', e.target.value)}
                        placeholder="e.g., Nakasero Organic Farms"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Enter the name of your farm, cooperative, or agricultural business
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization ID *</label>
                <Input
                    value={formData.organizationDetails.organizationId}
                    onChange={(e) => updateFormData('organizationDetails', 'organizationId', e.target.value)}
                    placeholder="Organization ID will be set automatically"
                    disabled
                    className="bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {isLoadingOrgDetails
                        ? '⏳ Loading organization details...'
                        : formData.organizationDetails.organizationId === 'new'
                            ? '🆕 Creating new organization'
                            : formData.organizationDetails.organizationId
                                ? `✅ Data prefilled from existing organization`
                                : 'This will be set based on your selected organization'
                    }
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Enterprise *</label>
                <select
                    value={formData.organizationDetails.enterpriseType}
                    onChange={(e) => updateFormData('organizationDetails', 'enterpriseType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {enterpriseTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Enterprises (ranked by importance) *</label>
                {formData.organizationDetails.mainEnterprises.map((enterprise, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            value={enterprise}
                            onChange={(e) => updateArrayItem('organizationDetails', 'mainEnterprises', index, e.target.value)}
                            placeholder={`Enterprise ${index + 1}`}
                        />
                        {formData.organizationDetails.mainEnterprises.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('organizationDetails', 'mainEnterprises', index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('organizationDetails', 'mainEnterprises')}
                    className="mt-2"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Enterprise
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <Input
                        value={formData.organizationDetails.location.district}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'location', 'district', e.target.value)}
                        placeholder="e.g., Wakiso"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub County *</label>
                    <Input
                        value={formData.organizationDetails.location.subCounty}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'location', 'subCounty', e.target.value)}
                        placeholder="e.g., Nangabo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parish *</label>
                    <Input
                        value={formData.organizationDetails.location.parish}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'location', 'parish', e.target.value)}
                        placeholder="e.g., Nangabo"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village *</label>
                    <Input
                        value={formData.organizationDetails.location.village}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'location', 'village', e.target.value)}
                        placeholder="e.g., Nangabo"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres) *</label>
                    <Input
                        type="number"
                        value={formData.organizationDetails.farmSize}
                        onChange={(e) => updateFormData('organizationDetails', 'farmSize', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Stage *</label>
                    <select
                        value={formData.organizationDetails.farmStage}
                        onChange={(e) => updateFormData('organizationDetails', 'farmStage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {farmStages.map(stage => (
                            <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person Name *</label>
                    <Input
                        value={formData.organizationDetails.contactPerson.name}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'contactPerson', 'name', e.target.value)}
                        placeholder="e.g., John Mukasa"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title/Role *</label>
                    <Input
                        value={formData.organizationDetails.contactPerson.title}
                        onChange={(e) => updateNestedFormData('organizationDetails', 'contactPerson', 'title', e.target.value)}
                        placeholder="e.g., Farm Manager"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Contact *</label>
                    <Input
                        value={formData.organizationDetails.whatsappContact}
                        onChange={(e) => updateFormData('organizationDetails', 'whatsappContact', e.target.value)}
                        placeholder="e.g., +256 700 123 456"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <Input
                        type="email"
                        value={formData.organizationDetails.email}
                        onChange={(e) => updateFormData('organizationDetails', 'email', e.target.value)}
                        placeholder="e.g., contact@farm.com"
                    />
                </div>
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title / Position Required *</label>
                <Input
                    value={formData.jobDetails.title}
                    onChange={(e) => updateFormData('jobDetails', 'title', e.target.value)}
                    placeholder="e.g., Farm Supervisor, Herdsman, Farm Assistant"
                />
            </div>


            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Number of Workers Needed *</label>
                <Input
                    type="number"
                    value={formData.jobDetails.totalWorkersNeeded}
                    onChange={(e) => updateFormData('jobDetails', 'totalWorkersNeeded', parseInt(e.target.value) || 1)}
                    placeholder="e.g., 5"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                <textarea
                    value={formData.jobDetails.description}
                    onChange={(e) => updateFormData('jobDetails', 'description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the job responsibilities, duties, and what the worker will be expected to do..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                    <select
                        value={formData.jobDetails.jobType}
                        onChange={(e) => updateFormData('jobDetails', 'jobType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {jobTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours *</label>
                    <select
                        value={formData.jobDetails.workingHours}
                        onChange={(e) => updateFormData('jobDetails', 'workingHours', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {workingHours.map(hours => (
                            <option key={hours.value} value={hours.value}>{hours.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {formData.jobDetails.jobType === 'contract' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contract Duration (months)</label>
                    <Input
                        type="number"
                        value={formData.jobDetails.contractDuration || ''}
                        onChange={(e) => updateFormData('jobDetails', 'contractDuration', parseInt(e.target.value) || undefined)}
                        placeholder="e.g., 6"
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date *</label>
                <Input
                    type="date"
                    value={formData.jobDetails.expectedStartDate.toISOString().split('T')[0]}
                    onChange={(e) => updateFormData('jobDetails', 'expectedStartDate', new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-1">Cannot select dates before today</p>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference *</label>
                    <select
                        value={formData.workerRequirements.genderPreference}
                        onChange={(e) => updateFormData('workerRequirements', 'genderPreference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="either">Either</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level Required *</label>
                    <select
                        value={formData.workerRequirements.educationLevel}
                        onChange={(e) => updateFormData('workerRequirements', 'educationLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {educationLevels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Minimum) *</label>
                    <Input
                        type="number"
                        value={formData.workerRequirements.ageRange.min}
                        onChange={(e) => updateNestedFormData('workerRequirements', 'ageRange', 'min', parseInt(e.target.value) || 18)}
                        placeholder="e.g., 18"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Range (Maximum) *</label>
                    <Input
                        type="number"
                        value={formData.workerRequirements.ageRange.max}
                        onChange={(e) => updateNestedFormData('workerRequirements', 'ageRange', 'max', parseInt(e.target.value) || 65)}
                        placeholder="e.g., 65"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience Required (years) *</label>
                <Input
                    type="number"
                    min="0"
                    value={formData.workerRequirements.workExperience}
                    onChange={(e) => updateFormData('workerRequirements', 'workExperience', parseInt(e.target.value) || 0)}
                    placeholder="e.g., 2 (0 = no experience required)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language Preference *</label>
                {formData.workerRequirements.languagePreference.map((language, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            value={language}
                            onChange={(e) => updateArrayItem('workerRequirements', 'languagePreference', index, e.target.value)}
                            placeholder="e.g., English, Luganda"
                        />
                        {formData.workerRequirements.languagePreference.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('workerRequirements', 'languagePreference', index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('workerRequirements', 'languagePreference')}
                    className="mt-2"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Language
                </Button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills Required</label>
                {formData.workerRequirements.technicalSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            value={skill}
                            onChange={(e) => updateArrayItem('workerRequirements', 'technicalSkills', index, e.target.value)}
                            placeholder="e.g., Tractor operation, Animal handling"
                        />
                        {formData.workerRequirements.technicalSkills.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('workerRequirements', 'technicalSkills', index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('workerRequirements', 'technicalSkills')}
                    className="mt-2"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                </Button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Certifications</label>
                {formData.workerRequirements.specialCertifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            value={cert}
                            onChange={(e) => updateArrayItem('workerRequirements', 'specialCertifications', index, e.target.value)}
                            placeholder="e.g., Pesticide use, Driving license"
                        />
                        {formData.workerRequirements.specialCertifications.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('workerRequirements', 'specialCertifications', index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('workerRequirements', 'specialCertifications')}
                    className="mt-2"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Certification
                </Button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soft Skills Desired</label>
                {formData.workerRequirements.softSkills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                            value={skill}
                            onChange={(e) => updateArrayItem('workerRequirements', 'softSkills', index, e.target.value)}
                            placeholder="e.g., Communication, Teamwork"
                        />
                        {formData.workerRequirements.softSkills.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeArrayItem('workerRequirements', 'softSkills', index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('workerRequirements', 'softSkills')}
                    className="mt-2"
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                </Button>
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation *</label>
                    <select
                        value={formData.workConditions.accommodation}
                        onChange={(e) => updateFormData('workConditions', 'accommodation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="provided">Provided</option>
                        <option value="not_provided">Not provided</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Electricity/Solar Power *</label>
                    <select
                        value={formData.workConditions.electricity}
                        onChange={(e) => updateFormData('workConditions', 'electricity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="available">Available</option>
                        <option value="not_available">Not available</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meals *</label>
                <select
                    value={formData.workConditions.meals}
                    onChange={(e) => updateFormData('workConditions', 'meals', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="provided">Provided</option>
                    <option value="not_provided">Not provided</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary Range (Minimum UGX) *</label>
                    <Input
                        type="number"
                        value={formData.workConditions.salaryRange.min}
                        onChange={(e) => updateNestedFormData('workConditions', 'salaryRange', 'min', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 500000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Salary Range (Maximum UGX) *</label>
                    <Input
                        type="number"
                        value={formData.workConditions.salaryRange.max}
                        onChange={(e) => updateNestedFormData('workConditions', 'salaryRange', 'max', parseInt(e.target.value) || 0)}
                        placeholder="e.g., 800000"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode *</label>
                <select
                    value={formData.workConditions.paymentMode}
                    onChange={(e) => updateFormData('workConditions', 'paymentMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {paymentModes.map(mode => (
                        <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Health Cover *</label>
                    <select
                        value={formData.workConditions.healthCover}
                        onChange={(e) => updateFormData('workConditions', 'healthCover', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="provided">Provided</option>
                        <option value="not_provided">Not provided</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Allowance *</label>
                    <select
                        value={formData.workConditions.transportAllowance}
                        onChange={(e) => updateFormData('workConditions', 'transportAllowance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="provided">Provided</option>
                        <option value="not_provided">Not provided</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Payments *</label>
                    <select
                        value={formData.workConditions.overtimePayments}
                        onChange={(e) => updateFormData('workConditions', 'overtimePayments', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="provided">Provided</option>
                        <option value="not_provided">Not provided</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Payment *</label>
                    <select
                        value={formData.workConditions.bonusPayment}
                        onChange={(e) => updateFormData('workConditions', 'bonusPayment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="provided">Provided</option>
                        <option value="not_provided">Not provided</option>
                    </select>
                </div>
            </div>
        </div>
    )

    const renderStep5 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religious Affiliation *</label>
                <select
                    value={formData.additionalPreferences.religiousAffiliation}
                    onChange={(e) => updateFormData('additionalPreferences', 'religiousAffiliation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="any">Any</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality Preference</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {nationalities.map(nationality => (
                        <label key={nationality.value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.additionalPreferences.nationality.includes(nationality.value as Nationality)}
                                onChange={(e) => {
                                    const current = formData.additionalPreferences.nationality
                                    if (e.target.checked) {
                                        updateFormData('additionalPreferences', 'nationality', [...current, nationality.value as Nationality])
                                    } else {
                                        updateFormData('additionalPreferences', 'nationality', current.filter(n => n !== nationality.value))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{nationality.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ethnic Background Preference</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ethnicBackgrounds.map(background => (
                        <label key={background.value} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.additionalPreferences.ethnicBackground.includes(background.value as EthnicBackground)}
                                onChange={(e) => {
                                    const current = formData.additionalPreferences.ethnicBackground
                                    if (e.target.checked) {
                                        updateFormData('additionalPreferences', 'ethnicBackground', [...current, background.value as EthnicBackground])
                                    } else {
                                        updateFormData('additionalPreferences', 'ethnicBackground', current.filter(b => b !== background.value))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{background.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Remarks (Optional)</label>
                <textarea
                    value={formData.additionalPreferences.remarks || ''}
                    onChange={(e) => updateFormData('additionalPreferences', 'remarks', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any other remarks about the kind of worker desired..."
                />
            </div>
        </div>
    )

    const renderStep6 = () => (
        <JobPreview
            organizationDetails={formData.organizationDetails}
            jobDetails={formData.jobDetails}
            workerRequirements={formData.workerRequirements}
            workConditions={formData.workConditions}
            additionalPreferences={formData.additionalPreferences}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
        />
    )

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1()
            case 2: return renderStep2()
            case 3: return renderStep3()
            case 4: return renderStep4()
            case 5: return renderStep5()
            case 6: return renderStep6()
            default: return renderStep1()
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Current Stage Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 bg-blue-50 border-blue-600 text-blue-600">
                            {(() => {
                                const Icon = steps[currentStep - 1].icon
                                return <Icon className="w-6 h-6" />
                            })()}
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-blue-600">
                                {steps[currentStep - 1].title}
                            </p>
                            <p className="text-sm text-gray-600">
                                Step {currentStep} of {steps.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        {currentStep === 1 && "Tell us about your farm or agribusiness"}
                        {currentStep === 2 && "Describe the job positions you need to fill"}
                        {currentStep === 3 && "Specify the requirements for workers"}
                        {currentStep === 4 && "Define work conditions and benefits"}
                        {currentStep === 5 && "Set additional preferences"}
                        {currentStep === 6 && "Review your job posting before submitting"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {renderCurrentStep()}
                </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                {currentStep < 6 ? (
                    <Button onClick={nextStep}>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        Submit Job Posting
                        <Check className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    )
}
