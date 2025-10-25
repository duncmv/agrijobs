'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Building2
} from 'lucide-react'

interface Job {
    id: string
    title: string
    organization_id: string
    posted_by_user_id: string
    total_workers_needed: number
    description: string
    job_type: string
    contract_duration_months: number
    expected_start_date: string
    working_hours: string
    gender_preference: string
    age_range_min: number
    age_range_max: number
    education_level: string
    work_experience_years: number
    language_preference: string
    technical_skills: string
    special_certifications: string
    soft_skills: string
    accommodation: string
    electricity: string
    meals: string
    salary_min_ugx: number
    salary_max_ugx: number
    payment_mode: string
    health_cover: string
    transport_allowance: string
    overtime_payments: string
    bonus_payment: string
    religious_affiliation: string
    nationality_preference: string
    ethnic_background_preference: string
    remarks: string
    status: string
    posted_at: string
    expires_at: string
    organization_name: string
    organization_type: string
    enterprise_type: string
    district: string
    sub_county: string
    parish: string
    village: string
    contact_person_name: string
    whatsapp_contact: string
    email: string
}

export default function AdminJobs() {
    const { user, isAuthenticated } = useAuth()
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            window.location.href = '/'
            return
        }

        fetchJobs()
    }, [isAuthenticated, user, filter])

    const fetchJobs = async () => {
        try {
            const response = await fetch(`/api/admin/jobs?filter=${filter}`)
            if (response.ok) {
                const data = await response.json()
                setJobs(data.jobs || [])
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch('/api/admin/jobs/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, status }),
            })

            if (response.ok) {
                // Refresh the jobs list
                fetchJobs()
            } else {
                console.error('Failed to update job status')
            }
        } catch (error) {
            console.error('Error updating job status:', error)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending_review':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
            case 'approved':
                return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
            case 'rejected':
                return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatSalary = (min: number, max: number) => {
        return `UGX ${min.toLocaleString()} - ${max.toLocaleString()}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
                    <p className="text-gray-600 mt-2">Review and manage job postings</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                        {[
                            { key: 'pending', label: 'Pending Review', count: jobs.filter(j => j.status === 'pending_review').length },
                            { key: 'approved', label: 'Approved', count: jobs.filter(j => j.status === 'approved').length },
                            { key: 'rejected', label: 'Rejected', count: jobs.filter(j => j.status === 'rejected').length },
                            { key: 'all', label: 'All Jobs', count: jobs.length }
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key as any)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === tab.key
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Jobs List */}
                <div className="space-y-6">
                    {jobs.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                                <p className="text-gray-600">No jobs match the current filter.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        jobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{job.title}</CardTitle>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Building2 className="w-4 h-4" />
                                                        <span>{job.organization_name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{job.district}, {job.sub_county}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Start: {formatDate(job.expected_start_date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusBadge(job.status)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{job.total_workers_needed} workers needed</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{formatSalary(job.salary_min_ugx, job.salary_max_ugx)}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm capitalize">{job.job_type.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Posted on {formatDate(job.posted_at)}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {job.status === 'pending_review' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateJobStatus(job.id, 'approved')}
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateJobStatus(job.id, 'rejected')}
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="sm" variant="outline">
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
