'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Search, MapPin, Filter, Briefcase, DollarSign, Clock, Users } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from '@/components/AuthModal'

interface Job {
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
    organization_name: string
    location: string
    technical_skills: string[]
    special_certifications: string[]
    soft_skills: string[]
    language_preference: string[]
    posted_by_user_id: string
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [employeeProfile, setEmployeeProfile] = useState<any>(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        fetchJobs()
        if (isAuthenticated && user) {
            fetchEmployeeProfile()
        }
    }, [isAuthenticated, user])

    const fetchJobs = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/jobs')
            if (!response.ok) {
                throw new Error('Failed to fetch jobs')
            }
            const data = await response.json()
            setJobs(data.jobs)
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setError('Failed to load jobs')
        } finally {
            setLoading(false)
        }
    }

    const fetchEmployeeProfile = async () => {
        if (!user) return

        try {
            setProfileLoading(true)
            const response = await fetch(`/api/employee-profiles?userId=${user.id}`)
            if (response.ok) {
                const data = await response.json()
                setEmployeeProfile(data.profile)
                // Store profile status in localStorage for AuthModal
                localStorage.setItem('hasEmployeeProfile', data.profile ? 'true' : 'false')
            }
        } catch (error) {
            console.error('Error fetching employee profile:', error)
            localStorage.setItem('hasEmployeeProfile', 'false')
        } finally {
            setProfileLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Agricultural Jobs</h1>
                            <p className="text-lg text-gray-600">
                                Discover opportunities that match your skills and passion for agriculture
                            </p>
                        </div>

                        {/* Employee Profile Status */}
                        {isAuthenticated && (
                            <div className="text-right">
                                {profileLoading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto" style={{ borderColor: '#3B546E' }}></div>
                                ) : employeeProfile ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-sm">
                                                {employeeProfile.fullName?.split(' ').map((n: string) => n[0]).join('')}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-green-800">Profile Complete</span>
                                    </div>
                                ) : (
                                    <Button size="sm" asChild>
                                        <a href="/create-profile">Add Profile</a>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Job title or keywords"
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Location"
                                    className="pl-10"
                                />
                            </div>
                            <div>
                                <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option>All Job Types</option>
                                    <option>Full Time</option>
                                    <option>Part Time</option>
                                    <option>Seasonal</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                            <Button className="flex items-center space-x-2">
                                <Filter className="w-4 h-4" />
                                <span>Filters</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#3B546E' }}></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchJobs}>Try Again</Button>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">No jobs available at the moment.</p>
                                <p className="text-sm text-gray-500">Check back later for new opportunities!</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                                                <p className="text-gray-600 mb-1">{job.organization_name}</p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {job.location}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: '#3B546E' }}>
                                                    {job.job_type.replace('_', ' ')}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {job.applications_count} applications
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                {formatCurrency(job.salary_min_ugx)} - {formatCurrency(job.salary_max_ugx)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="w-4 h-4 mr-2" />
                                                {job.total_workers_needed} workers needed
                                            </div>
                                        </div>

                                        {/* Skills Section - Organized Layout */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Required Skills & Qualifications</h4>

                                            {/* Skills Grid Layout */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Left Column - Technical Skills */}
                                                {job.technical_skills && job.technical_skills.length > 0 && (
                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-600 mb-2">Technical Skills</h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {job.technical_skills.map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="text-xs px-2 py-1 rounded-full text-white font-medium capitalize"
                                                                    style={{ backgroundColor: '#d4b327' }}
                                                                >
                                                                    {skill.toLowerCase()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Right Column - Certifications */}
                                                {job.special_certifications && job.special_certifications.length > 0 && (
                                                    <div>
                                                        <h5 className="text-xs font-medium text-gray-600 mb-2">Certifications</h5>
                                                        <div className="flex flex-wrap gap-1">
                                                            {job.special_certifications.map((cert, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="text-xs px-2 py-1 rounded-full text-white font-medium capitalize"
                                                                    style={{ backgroundColor: '#3B546E' }}
                                                                >
                                                                    {cert.toLowerCase()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Soft Skills - Full Width */}
                                            {job.soft_skills && job.soft_skills.length > 0 && (
                                                <div className="mt-3">
                                                    <h5 className="text-xs font-medium text-gray-600 mb-2">Soft Skills</h5>
                                                    <div className="flex flex-wrap gap-1">
                                                        {job.soft_skills.map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-xs px-2 py-1 rounded-full border font-medium capitalize"
                                                                style={{
                                                                    backgroundColor: '#f8fafc',
                                                                    color: '#3B546E',
                                                                    borderColor: '#3B546E'
                                                                }}
                                                            >
                                                                {skill.toLowerCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Language Preferences */}
                                        {job.language_preference && job.language_preference.length > 0 && (
                                            <div className="mb-4">
                                                <h5 className="text-xs font-medium text-gray-600 mb-2">Language Requirements</h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {job.language_preference.map((lang, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize"
                                                        >
                                                            {lang.toLowerCase()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-500">
                                                Posted {formatDate(new Date(job.posted_at))}
                                            </div>
                                            {isAuthenticated && user?.id === job.posted_by_user_id ? (
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-500 italic">Your job posting</span>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href="/my-jobs">Manage</a>
                                                    </Button>
                                                </div>
                                            ) : !isAuthenticated ? (
                                                <Button onClick={() => {
                                                    // Store intended action and open auth modal
                                                    localStorage.setItem('intendedAction', 'apply')
                                                    localStorage.setItem('jobId', job.id)
                                                    setShowAuthModal(true)
                                                }}>
                                                    Apply Now
                                                </Button>
                                            ) : !employeeProfile ? (
                                                <Button asChild>
                                                    <a href="/create-profile">Add Profile to Apply</a>
                                                </Button>
                                            ) : (
                                                <Button onClick={() => {
                                                    // TODO: Implement actual application logic
                                                    alert('Application feature coming soon!')
                                                }}>
                                                    Apply Now
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Job Alerts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Job Alerts</CardTitle>
                                <CardDescription>Get notified about new opportunities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                                        <Input placeholder="e.g., tractor operator" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <Input placeholder="e.g., California" />
                                    </div>
                                    <Button className="w-full">
                                        Create Alert
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Searches */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Searches</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {['Tractor Operator', 'Livestock Manager', 'Harvest Worker', 'Irrigation Specialist', 'Farm Manager'].map((search, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left text-sm text-gray-600 py-1 transition-colors"
                                            style={{ '--hover-color': '#d4b327' } as React.CSSProperties}
                                            onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                                        >
                                            {search}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured Employers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Employers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {jobs.slice(0, 3).map((job) => (
                                        <div key={job.id} className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
                                                <span className="font-semibold text-sm" style={{ color: '#3B546E' }}>
                                                    {job.organization_name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{job.organization_name}</p>
                                                <p className="text-xs text-gray-500">Agricultural company</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                redirectAfterAuth={typeof window !== 'undefined' ? window.location.pathname : '/jobs'}
            />
        </div>
    )
}
