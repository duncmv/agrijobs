'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    User,
    GraduationCap,
    Briefcase,
    Settings,
    Target,
    Check,
    ArrowLeft,
    ArrowRight,
    Upload,
    X
} from 'lucide-react'
import { EmployeeProfile, EmployerReference, FileAttachment, UgandanRegion, EnterpriseType } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface EmployeeProfileFormProps {
    onSubmit: (profile: Partial<EmployeeProfile>) => Promise<void>
    initialData?: Partial<EmployeeProfile>
    isLoading?: boolean
}

const ugandanRegions: UgandanRegion[] = [
    'West Nile', 'Acholi', 'Karamoja', 'Lango', 'Teso', 'Sebei', 'Bunyoro',
    'Bukedi', 'Bugisu', 'Busoga', 'Tooro', 'Kigezi', 'Rwenzori', 'Ankole', 'Buganda'
]

const enterpriseTypes: EnterpriseType[] = [
    'crop_farm', 'livestock_farm', 'mixed', 'apiculture', 'horticulture', 'aquaculture',
    'agro_forestry', 'sericulture', 'vermiculture', 'entomology_based_agriculture', 'other'
]

const technicalSkills = [
    'Pest and Disease Management',
    'Organic agriculture',
    'Apiculture management',
    'Livestock Husbandry',
    'Vermiculture techniques',
    'Farm Machinery Operation',
    'Soil Fertility Management',
    'Horticulture management',
    'Agronomic techniques',
    'Entomology based agriculture',
    'Post-harvest Handling',
    'Aquaculture Techniques',
    'Agro-forestry management',
    'Greenhouse or Nursery Management',
    'Sericulture techniques',
    'Climate-smart Agriculture Practices'
]

const entrepreneurialSkills = [
    'Marketing and Sales',
    'Value Addition',
    'Record Keeping and Reporting',
    'Farm Planning and Budgeting',
    'Human Resource and Supervising Workers',
    'Scheduling and Coordination'
]

const specializedSkills = [
    'ICT in Agriculture',
    'Precision Agriculture',
    'Innovative Techniques'
]

const softSkills = [
    'Problem Solving',
    'Teamwork',
    'Adaptability',
    'Patience',
    'Communication'
]

export function EmployeeProfileForm({ onSubmit, initialData, isLoading = false }: EmployeeProfileFormProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const { user } = useAuth()

    const [formData, setFormData] = useState<Partial<EmployeeProfile>>({
        fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        email: user?.email || '',
        ...initialData
    })

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [newTraining, setNewTraining] = useState('')
    const [newLanguage, setNewLanguage] = useState('')
    const [newJobRole, setNewJobRole] = useState('')

    const steps = [
        { id: 1, title: 'Personal Information', icon: User },
        { id: 2, title: 'Education & Training', icon: GraduationCap },
        { id: 3, title: 'Work Experience', icon: Briefcase },
        { id: 4, title: 'Technical Competencies', icon: Settings },
        { id: 5, title: 'Job Preferences', icon: Target }
    ]

    const handleInputChange = (field: keyof EmployeeProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        clearFieldError(field)
    }

    const handleArrayChange = (field: keyof EmployeeProfile, value: string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleQualificationChange = (index: number, field: 'level' | 'name', value: string) => {
        const updatedQualifications = [...(formData.qualifications || [])]
        updatedQualifications[index] = { ...updatedQualifications[index], [field]: value }
        setFormData(prev => ({ ...prev, qualifications: updatedQualifications }))
    }

    const addQualification = () => {
        const newQual = { level: '', name: '' }
        setFormData(prev => ({
            ...prev,
            qualifications: [...(prev.qualifications || []), newQual]
        }))
    }

    const removeQualification = (index: number) => {
        const updatedQualifications = (formData.qualifications || []).filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, qualifications: updatedQualifications }))
    }

    const handleSkillLevelChange = (skill: string, level: number) => {
        const skillField = `${skill.toLowerCase().replace(/\s+/g, '')}Level` as keyof EmployeeProfile
        setFormData(prev => ({ ...prev, [skillField]: level }))
    }

    const addEmployerReference = () => {
        const newRef: EmployerReference = { farmName: '', contactName: '', telephone: '' }
        const currentRefs = formData.employerReferences || []
        setFormData(prev => ({
            ...prev,
            employerReferences: [...currentRefs, newRef]
        }))
    }

    const updateEmployerReference = (index: number, field: keyof EmployerReference, value: string) => {
        const currentRefs = formData.employerReferences || []
        const updatedRefs = currentRefs.map((ref, i) =>
            i === index ? { ...ref, [field]: value } : ref
        )
        setFormData(prev => ({ ...prev, employerReferences: updatedRefs }))
    }

    const removeEmployerReference = (index: number) => {
        const currentRefs = formData.employerReferences || []
        const updatedRefs = currentRefs.filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, employerReferences: updatedRefs }))
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
                fullName: 'Full Name',
                gender: 'Gender',
                dateOfBirth: 'Date of Birth',
                currentDistrict: 'Current District',
                currentSubCounty: 'Current Sub County',
                currentParish: 'Current Parish',
                currentVillage: 'Current Village',
                whatsappContact: 'WhatsApp Contact',
                email: 'Email',
                workingProfileDescription: 'Working Profile Description',
                highestEducationLevel: 'Highest Education Level',
                languagesSpoken: 'Languages Spoken',
                yearsExperience: 'Years of Experience',
                previousJobRoles: 'Previous Job Roles',
                enterpriseTypes: 'Enterprise Types',
                technicalSkills: 'Technical Skills',
                preferredRegions: 'Preferred Regions',
                workTypeDesired: 'Work Type Desired',
                preferredEnterprise: 'Preferred Enterprise',
                expectedSalaryMin: 'Expected Salary Min',
                expectedSalaryMax: 'Expected Salary Max',
                willingnessRelocate: 'Willingness to Relocate',
                willingnessRemote: 'Willingness to Work Remotely',
                preferredWorkingHours: 'Preferred Working Hours'
            }

            const missingFieldLabels = validationResult.missingFields.map(field =>
                fieldLabels[field] || field
            )

            alert(`Please fill in all required fields in ${validationResult.stepName}:\n\n${missingFieldLabels.join('\n')}`)
            return
        }

        // Clear errors if validation passes
        setFieldErrors({})
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const validateCurrentStep = () => {
        const stepValidations = {
            1: {
                stepName: 'Personal Information',
                requiredFields: ['fullName', 'gender', 'dateOfBirth', 'currentDistrict', 'currentSubCounty', 'currentParish', 'currentVillage', 'whatsappContact', 'email', 'workingProfileDescription'],
                fieldLabels: {
                    fullName: 'Full Name',
                    gender: 'Gender',
                    dateOfBirth: 'Date of Birth',
                    currentDistrict: 'Current District',
                    currentSubCounty: 'Current Sub County',
                    currentParish: 'Current Parish',
                    currentVillage: 'Current Village',
                    whatsappContact: 'WhatsApp Contact',
                    email: 'Email',
                    workingProfileDescription: 'Working Profile Description'
                }
            },
            2: {
                stepName: 'Education & Training',
                requiredFields: ['highestEducationLevel', 'languagesSpoken'],
                fieldLabels: {
                    highestEducationLevel: 'Highest Education Level',
                    languagesSpoken: 'Languages Spoken'
                }
            },
            3: {
                stepName: 'Work Experience',
                requiredFields: ['yearsExperience', 'previousJobRoles', 'enterpriseTypes'],
                fieldLabels: {
                    yearsExperience: 'Years of Experience',
                    previousJobRoles: 'Previous Job Roles',
                    enterpriseTypes: 'Enterprise Types'
                }
            },
            4: {
                stepName: 'Technical Competencies',
                requiredFields: ['technicalSkills'],
                fieldLabels: {
                    technicalSkills: 'Technical Skills'
                }
            },
            5: {
                stepName: 'Job Preferences',
                requiredFields: ['preferredRegions', 'workTypeDesired', 'preferredEnterprise', 'expectedSalaryMin', 'expectedSalaryMax', 'willingnessRelocate', 'willingnessRemote', 'preferredWorkingHours'],
                fieldLabels: {
                    preferredRegions: 'Preferred Regions',
                    workTypeDesired: 'Work Type Desired',
                    preferredEnterprise: 'Preferred Enterprise',
                    expectedSalaryMin: 'Expected Salary Min',
                    expectedSalaryMax: 'Expected Salary Max',
                    willingnessRelocate: 'Willingness to Relocate',
                    willingnessRemote: 'Willingness to Work Remotely',
                    preferredWorkingHours: 'Preferred Working Hours'
                }
            }
        }

        const currentStepValidation = stepValidations[currentStep as keyof typeof stepValidations]
        if (!currentStepValidation) {
            return { isValid: true, stepName: '', missingFields: [] }
        }

        const missingFields = currentStepValidation.requiredFields.filter(field => {
            const value = formData[field as keyof EmployeeProfile]
            return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
        })

        return {
            isValid: missingFields.length === 0,
            stepName: currentStepValidation.stepName,
            missingFields: missingFields // Return field names, not labels
        }
    }

    const getFieldClassName = (fieldName: string, baseClassName: string = '') => {
        const hasError = fieldErrors[fieldName]
        const errorClasses = hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        return `${baseClassName} ${errorClasses}`
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

    const handleSubmit = async () => {
        console.log('Form submission started')
        console.log('Current form data:', formData)

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
            const value = formData[field as keyof EmployeeProfile]
            const isEmpty = value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
            if (isEmpty) {
                console.log(`Missing field: ${field}, value:`, value)
            }
            return isEmpty
        })

        console.log('Missing fields:', missingFields)

        if (missingFields.length > 0) {
            const fieldLabels: Record<string, string> = {
                fullName: 'Full Name',
                gender: 'Gender',
                dateOfBirth: 'Date of Birth',
                currentDistrict: 'Current District',
                currentSubCounty: 'Current Sub County',
                currentParish: 'Current Parish',
                currentVillage: 'Current Village',
                whatsappContact: 'WhatsApp Contact',
                email: 'Email',
                workingProfileDescription: 'Working Profile Description',
                highestEducationLevel: 'Highest Education Level',
                languagesSpoken: 'Languages Spoken',
                yearsExperience: 'Years of Experience',
                previousJobRoles: 'Previous Job Roles',
                enterpriseTypes: 'Enterprise Types',
                technicalSkills: 'Technical Skills',
                preferredRegions: 'Preferred Regions',
                workTypeDesired: 'Work Type Desired',
                preferredEnterprise: 'Preferred Enterprise',
                expectedSalaryMin: 'Expected Salary Min',
                expectedSalaryMax: 'Expected Salary Max',
                willingnessRelocate: 'Willingness to Relocate',
                willingnessRemote: 'Willingness to Work Remotely',
                preferredWorkingHours: 'Preferred Working Hours'
            }

            const missingFieldLabels = missingFields.map(field => fieldLabels[field] || field)
            console.log('Showing alert for missing fields:', missingFieldLabels)
            alert(`Please fill in all required fields:\n\n${missingFieldLabels.join('\n')}`)
            return
        }

        console.log('All fields validated, calling onSubmit')
        await onSubmit(formData)
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                        value={formData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        error={!!getFieldError('fullName')}
                        required
                    />
                    {getFieldError('fullName') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('fullName')}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                        value={formData.gender || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className={getFieldClassName('gender', 'w-full h-10 px-3 py-2 rounded-lg focus:ring-2 focus:border-transparent')}
                        required
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {getFieldError('gender') && (
                        <p className="mt-1 text-sm text-red-600">{getFieldError('gender')}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <DatePicker
                        value={formData.dateOfBirth || ''}
                        onChange={(value) => handleInputChange('dateOfBirth', value)}
                        max={new Date().toISOString().split('T')[0]}
                        placeholder="Select your date of birth"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">National ID Number</label>
                    <Input
                        value={formData.nationalId || ''}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                        placeholder="Enter your National ID"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current District</label>
                    <Input
                        value={formData.currentDistrict || ''}
                        onChange={(e) => handleInputChange('currentDistrict', e.target.value)}
                        placeholder="Enter your district"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub County</label>
                    <Input
                        value={formData.currentSubCounty || ''}
                        onChange={(e) => handleInputChange('currentSubCounty', e.target.value)}
                        placeholder="Enter your sub county"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parish</label>
                    <Input
                        value={formData.currentParish || ''}
                        onChange={(e) => handleInputChange('currentParish', e.target.value)}
                        placeholder="Enter your parish"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                    <Input
                        value={formData.currentVillage || ''}
                        onChange={(e) => handleInputChange('currentVillage', e.target.value)}
                        placeholder="Enter your village"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Contact</label>
                    <Input
                        value={formData.whatsappContact || ''}
                        onChange={(e) => handleInputChange('whatsappContact', e.target.value)}
                        placeholder="+256 700 123 456"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Profile Description</label>
                <textarea
                    value={formData.workingProfileDescription || ''}
                    onChange={(e) => handleInputChange('workingProfileDescription', e.target.value)}
                    placeholder="Give a brief description of your working profile..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                />
            </div>
        </div>
    )

    const renderStep2 = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education Level Completed</label>
                <select
                    value={formData.highestEducationLevel || ''}
                    onChange={(e) => handleInputChange('highestEducationLevel', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                >
                    <option value="">Select education level</option>
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="degree">Degree</option>
                    <option value="masters">Masters</option>
                    <option value="phd">PhD</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relevant Certificates & Qualifications</label>
                <div className="space-y-3">
                    {(formData.qualifications || []).map((qual, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <select
                                value={qual.level}
                                onChange={(e) => handleQualificationChange(index, 'level', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Level</option>
                                <option value="certificate">Certificate</option>
                                <option value="diploma">Diploma</option>
                                <option value="degree">Degree</option>
                                <option value="masters">Masters</option>
                                <option value="phd">PhD</option>
                                <option value="other">Other</option>
                            </select>
                            <Input
                                value={qual.name}
                                onChange={(e) => handleQualificationChange(index, 'name', e.target.value)}
                                placeholder="Qualification name (e.g., Agricultural Science)"
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="p-2 text-red-600 hover:text-red-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addQualification}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                        <span>+</span>
                        <span>Add Qualification</span>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agricultural Training Attended</label>
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {(formData.agriculturalTraining || []).map((training, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                            >
                                {training}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (formData.agriculturalTraining || []).filter((_, i) => i !== index)
                                        handleArrayChange('agriculturalTraining', updated)
                                    }}
                                    className="ml-2 text-green-600 hover:text-green-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            value={newTraining}
                            onChange={(e) => setNewTraining(e.target.value)}
                            placeholder="Add training (e.g., Organic Farming Course)"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            onClick={() => {
                                if (newTraining && !(formData.agriculturalTraining || []).includes(newTraining)) {
                                    handleArrayChange('agriculturalTraining', [...(formData.agriculturalTraining || []), newTraining])
                                    setNewTraining('')
                                }
                            }}
                            size="sm"
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {(formData.languagesSpoken || []).map((lang, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                            >
                                {lang}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (formData.languagesSpoken || []).filter((_, i) => i !== index)
                                        handleArrayChange('languagesSpoken', updated)
                                    }}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Add language (e.g., English, Luganda)"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    const value = input.value.trim()
                                    if (value && !(formData.languagesSpoken || []).includes(value)) {
                                        handleArrayChange('languagesSpoken', [...(formData.languagesSpoken || []), value])
                                        input.value = ''
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience in Agriculture</label>
                    <Input
                        type="number"
                        value={formData.yearsExperience || ''}
                        onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value))}
                        placeholder="0"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Job Roles</label>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {(formData.previousJobRoles || []).map((role, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                >
                                    {role}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = (formData.previousJobRoles || []).filter((_, i) => i !== index)
                                            handleArrayChange('previousJobRoles', updated)
                                        }}
                                        className="ml-2 text-green-600 hover:text-green-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            placeholder="Add job role (e.g., Farm Manager, Tractor Operator)"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    const value = input.value.trim()
                                    if (value && !(formData.previousJobRoles || []).includes(value)) {
                                        handleArrayChange('previousJobRoles', [...(formData.previousJobRoles || []), value])
                                        input.value = ''
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Enterprises Worked In</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {enterpriseTypes.map((type) => {
                        const displayName = type
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase())
                        return (
                            <label key={type} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(formData.enterpriseTypes || []).includes(type)}
                                    onChange={(e) => {
                                        const current = formData.enterpriseTypes || []
                                        if (e.target.checked) {
                                            handleArrayChange('enterpriseTypes', [...current, type])
                                        } else {
                                            handleArrayChange('enterpriseTypes', current.filter(t => t !== type))
                                        }
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{displayName}</span>
                            </label>
                        )
                    })}
                </div>
            </div>

            {/* Dynamic fields based on enterprise types */}
            {(formData.enterpriseTypes || []).includes('crop_farm') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crops You Have Cared For</label>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {(formData.cropsCaredFor || []).map((crop, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                                >
                                    {crop}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = (formData.cropsCaredFor || []).filter((_, i) => i !== index)
                                            handleArrayChange('cropsCaredFor', updated)
                                        }}
                                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            placeholder="Add crop (e.g., Maize, Coffee, Bananas)"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    const value = input.value.trim()
                                    if (value && !(formData.cropsCaredFor || []).includes(value)) {
                                        handleArrayChange('cropsCaredFor', [...(formData.cropsCaredFor || []), value])
                                        input.value = ''
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {(formData.enterpriseTypes || []).includes('livestock_farm') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Animals and Poultry You Have Cared For</label>
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {(formData.livestockCaredFor || []).map((animal, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                                >
                                    {animal}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = (formData.livestockCaredFor || []).filter((_, i) => i !== index)
                                            handleArrayChange('livestockCaredFor', updated)
                                        }}
                                        className="ml-2 text-orange-600 hover:text-orange-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input
                            placeholder="Add animal (e.g., Cattle, Goats, Chickens)"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    const input = e.target as HTMLInputElement
                                    const value = input.value.trim()
                                    if (value && !(formData.livestockCaredFor || []).includes(value)) {
                                        handleArrayChange('livestockCaredFor', [...(formData.livestockCaredFor || []), value])
                                        input.value = ''
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Employer References */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-gray-700">Employer References</label>
                    <Button type="button" variant="outline" size="sm" onClick={addEmployerReference}>
                        Add Reference
                    </Button>
                </div>
                <div className="space-y-4">
                    {(formData.employerReferences || []).map((ref, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeEmployerReference(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Farm Name</label>
                                        <Input
                                            value={ref.farmName}
                                            onChange={(e) => updateEmployerReference(index, 'farmName', e.target.value)}
                                            placeholder="Farm name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                        <Input
                                            value={ref.contactName}
                                            onChange={(e) => updateEmployerReference(index, 'contactName', e.target.value)}
                                            placeholder="Contact person name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                                        <Input
                                            value={ref.telephone}
                                            onChange={(e) => updateEmployerReference(index, 'telephone', e.target.value)}
                                            placeholder="+256 700 123 456"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep4 = () => (
        <div className="space-y-8">
            {/* Technical Skills */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {technicalSkills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={(formData.technicalSkills || []).includes(skill)}
                                onChange={(e) => {
                                    const current = formData.technicalSkills || []
                                    if (e.target.checked) {
                                        handleArrayChange('technicalSkills', [...current, skill])
                                    } else {
                                        handleArrayChange('technicalSkills', current.filter(s => s !== skill))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Entrepreneurial Skills */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entrepreneurial and Management Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {entrepreneurialSkills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={(formData.entrepreneurialSkills || []).includes(skill)}
                                onChange={(e) => {
                                    const current = formData.entrepreneurialSkills || []
                                    if (e.target.checked) {
                                        handleArrayChange('entrepreneurialSkills', [...current, skill])
                                    } else {
                                        handleArrayChange('entrepreneurialSkills', current.filter(s => s !== skill))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Specialized Skills */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialized Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {specializedSkills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={(formData.specializedSkills || []).includes(skill)}
                                onChange={(e) => {
                                    const current = formData.specializedSkills || []
                                    if (e.target.checked) {
                                        handleArrayChange('specializedSkills', [...current, skill])
                                    } else {
                                        handleArrayChange('specializedSkills', current.filter(s => s !== skill))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Soft Skills */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Soft Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {softSkills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <input
                                type="checkbox"
                                checked={(formData.softSkills || []).includes(skill)}
                                onChange={(e) => {
                                    const current = formData.softSkills || []
                                    if (e.target.checked) {
                                        handleArrayChange('softSkills', [...current, skill])
                                    } else {
                                        handleArrayChange('softSkills', current.filter(s => s !== skill))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Work Desired</label>
                    <select
                        value={formData.workTypeDesired || ''}
                        onChange={(e) => handleInputChange('workTypeDesired', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select work type</option>
                        <option value="permanent">Permanent</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="internship">Internship</option>
                        <option value="part_time">Part Time</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Enterprise</label>
                    <select
                        value={formData.preferredEnterprise || ''}
                        onChange={(e) => handleInputChange('preferredEnterprise', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select enterprise</option>
                        <option value="crops">Crops</option>
                        <option value="livestock">Livestock</option>
                        <option value="mixed">Mixed</option>
                        <option value="apiculture">Apiculture</option>
                        <option value="horticulture">Horticulture</option>
                        <option value="aquaculture">Aquaculture</option>
                        <option value="agroforestry">Agroforestry</option>
                        <option value="any">Any</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Regions to Work In</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ugandanRegions.map((region) => (
                        <label key={region} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={(formData.preferredRegions || []).includes(region)}
                                onChange={(e) => {
                                    const current = formData.preferredRegions || []
                                    if (e.target.checked) {
                                        handleArrayChange('preferredRegions', [...current, region])
                                    } else {
                                        handleArrayChange('preferredRegions', current.filter(r => r !== region))
                                    }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{region}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary Range (Min UGX)</label>
                    <Input
                        type="number"
                        value={formData.expectedSalaryMin || ''}
                        onChange={(e) => handleInputChange('expectedSalaryMin', parseInt(e.target.value))}
                        placeholder="500000"
                        min="0"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary Range (Max UGX)</label>
                    <Input
                        type="number"
                        value={formData.expectedSalaryMax || ''}
                        onChange={(e) => handleInputChange('expectedSalaryMax', parseInt(e.target.value))}
                        placeholder="1000000"
                        min={formData.expectedSalaryMin || 0}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Willingness to Relocate</label>
                    <select
                        value={formData.willingnessRelocate || ''}
                        onChange={(e) => handleInputChange('willingnessRelocate', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Willingness to Work in Remote Areas</label>
                    <select
                        value={formData.willingnessRemote || ''}
                        onChange={(e) => handleInputChange('willingnessRemote', e.target.value)}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        <option value="">Select option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Working Hours</label>
                <select
                    value={formData.preferredWorkingHours || ''}
                    onChange={(e) => handleInputChange('preferredWorkingHours', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                >
                    <option value="">Select working hours</option>
                    <option value="day_shift">Day Shift</option>
                    <option value="night_shift">Night Shift</option>
                    <option value="rotational">Rotational</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deal Breaking Working Conditions</label>
                <textarea
                    value={formData.dealBreakingConditions || ''}
                    onChange={(e) => handleInputChange('dealBreakingConditions', e.target.value)}
                    placeholder="Describe any working conditions that would be deal breakers for you..."
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto">
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
                    <CardTitle>Employee Profile - {steps[currentStep - 1].title}</CardTitle>
                    <CardDescription>
                        Step {currentStep} of {steps.length}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        {currentStep < steps.length ? (
                            <Button onClick={nextStep}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Complete Profile'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
