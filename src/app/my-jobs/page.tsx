'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import {
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    Calendar,
    Building
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface PostedJob {
    id: string
    title: string
    total_workers_needed: number
    description: string
    job_type: string
    expected_start_date: string
    working_hours: string
    salary_min_ugx: number
    salary_max_ugx: number
    posted_at: string
    applications_count: number
    status: 'pending_review' | 'approved' | 'rejected'
    organization_name: string
    location: string
    technical_skills: string[]
    special_certifications: string[]
    soft_skills: string[]
    language_preference: string[]
}

interface AppliedJob {
    id: string
    job_id: string
    job_title: string
    organization_name: string
    location: string
    applied_at: string
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
    salary_min_ugx: number
    salary_max_ugx: number
    job_type: string
}

export default function MyJobsPage() {
    const [postedJobs, setPostedJobs] = useState<PostedJob[]>([])
    const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchMyJobs()
        }
    }, [isAuthenticated, user])

    const fetchMyJobs = async () => {
        try {
            setLoading(true)

            // Fetch posted jobs
            const postedResponse = await fetch(`/api/jobs/my-posted?userId=${user?.id}`)
            if (postedResponse.ok) {
                const postedData = await postedResponse.json()
                setPostedJobs(postedData.jobs || [])
            }

            // Fetch applied jobs
            const appliedResponse = await fetch(`/api/applications/my-applications?userId=${user?.id}`)
            if (appliedResponse.ok) {
                const appliedData = await appliedResponse.json()
                setAppliedJobs(appliedData.applications || [])
            }
        } catch (error) {
            console.error('Error fetching my jobs:', error)
            setError('Failed to load your jobs')
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'pending_review':
            case 'pending':
                return 'bg-yellow-100 text-yellow-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'reviewed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />
            case 'pending_review':
            case 'pending':
                return <Clock className="w-4 h-4" />
            case 'rejected':
                return <XCircle className="w-4 h-4" />
            case 'reviewed':
                return <Eye className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Jobs</h1>
                        <p className="text-lg text-gray-600 mb-8">Please sign in to view your jobs</p>
                        <Button onClick={() => window.location.href = '/auth/login'}>
                            Sign In
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">My Jobs</h1>
                    <p className="text-lg text-gray-600">
                        Manage your posted jobs and track your applications
                    </p>
                </div>

                <Tabs defaultValue="posted" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="posted" className="flex items-center space-x-2">
                            <Briefcase className="w-4 h-4" />
                            <span>Posted Jobs ({postedJobs.length})</span>
                        </TabsTrigger>
                        <TabsTrigger value="applied" className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Applied Jobs ({appliedJobs.length})</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Posted Jobs Tab */}
                    <TabsContent value="posted" className="mt-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#3B546E' }}></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchMyJobs}>Try Again</Button>
                            </div>
                        ) : postedJobs.length === 0 ? (
                            <div className="text-center py-8">
                                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posted Jobs</h3>
                                <p className="text-gray-600 mb-6">You haven't posted any jobs yet.</p>
                                <Button asChild>
                                    <a href="/post-job">Post Your First Job</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {postedJobs.map((job) => (
                                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                                                        <Badge className={getStatusColor(job.status)}>
                                                            <div className="flex items-center space-x-1">
                                                                {getStatusIcon(job.status)}
                                                                <span className="capitalize">{job.status.replace('_', ' ')}</span>
                                                            </div>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 mb-2">
                                                        <Building className="w-4 h-4 mr-2" />
                                                        <span>{job.organization_name}</span>
                                                        <MapPin className="w-4 h-4 ml-4 mr-2" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                    {job.status === 'pending_review' && (
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="w-4 h-4 mr-2" />
                                                    {formatCurrency(job.salary_min_ugx)} - {formatCurrency(job.salary_max_ugx)}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Start: {formatDate(new Date(job.expected_start_date))}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="w-4 h-4 mr-2" />
                                                    {job.total_workers_needed} workers needed
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    {job.applications_count} applications
                                                </div>
                                            </div>

                                            {/* Skills Preview */}
                                            <div className="flex flex-wrap gap-1">
                                                {job.technical_skills.slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-xs px-2 py-1 rounded-full text-white font-medium capitalize"
                                                        style={{ backgroundColor: '#d4b327' }}
                                                    >
                                                        {skill.toLowerCase()}
                                                    </span>
                                                ))}
                                                {job.technical_skills.length > 3 && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                        +{job.technical_skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Applied Jobs Tab */}
                    <TabsContent value="applied" className="mt-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#3B546E' }}></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchMyJobs}>Try Again</Button>
                            </div>
                        ) : appliedJobs.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications</h3>
                                <p className="text-gray-600 mb-6">You haven't applied to any jobs yet.</p>
                                <Button asChild>
                                    <a href="/jobs">Browse Available Jobs</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {appliedJobs.map((application) => (
                                    <Card key={application.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-xl font-semibold text-gray-900">{application.job_title}</h3>
                                                        <Badge className={getStatusColor(application.status)}>
                                                            <div className="flex items-center space-x-1">
                                                                {getStatusIcon(application.status)}
                                                                <span className="capitalize">{application.status}</span>
                                                            </div>
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 mb-2">
                                                        <Building className="w-4 h-4 mr-2" />
                                                        <span>{application.organization_name}</span>
                                                        <MapPin className="w-4 h-4 ml-4 mr-2" />
                                                        <span>{application.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Job
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="w-4 h-4 mr-2" />
                                                    {formatCurrency(application.salary_min_ugx)} - {formatCurrency(application.salary_max_ugx)}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Briefcase className="w-4 h-4 mr-2" />
                                                    {application.job_type.replace('_', ' ')}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Applied: {formatDate(new Date(application.applied_at))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </div>
    )
}
