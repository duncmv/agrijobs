'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    User,
    Briefcase,
    Bell,
    Settings,
    Plus,
    Users,
    Eye,
    MessageCircle,
    Star,
    MapPin,
    DollarSign,
    Calendar
} from 'lucide-react'
import { mockJobs, mockEmployers, mockJobSeekers, mockApplications } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function EmployerDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates' | 'messages'>('overview')
    const user = mockEmployers[0] // Simulate logged-in employer
    const companyJobs = mockJobs.filter(job => job.employerId === user.id)
    const companyApplications = mockApplications.filter(app =>
        companyJobs.some(job => job.id === app.jobId)
    )

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/images/logo.png"
                                alt="Feasts AgriJobs Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold text-gray-900">
                                <span style={{ color: '#d4b327' }}>Feasts</span> AgriJobs
                            </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-semibold text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-lg">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.companyName}</h3>
                                            <p className="text-sm text-gray-600">{user.companySize} company</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'overview' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span>Overview</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('jobs')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'jobs' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span>My Jobs</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('candidates')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'candidates' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Candidates</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('messages')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'messages' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Messages</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Briefcase className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                                                    <p className="text-2xl font-bold text-gray-900">{companyJobs.length}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Users className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                                    <p className="text-2xl font-bold text-gray-900">{companyApplications.length}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Star className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {companyApplications.filter(app => app.status === 'shortlisted').length}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Applications */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Applications</CardTitle>
                                        <CardDescription>Latest applications for your job postings</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {companyApplications.slice(0, 3).map((application) => (
                                                <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                            <span className="text-green-600 font-semibold text-sm">
                                                                {application.jobSeeker.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{application.jobSeeker.name}</h4>
                                                            <p className="text-sm text-gray-600">{application.job.title}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                                                            application.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </span>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">My Job Postings</h2>
                                    <Button className="flex items-center space-x-2">
                                        <Plus className="w-4 h-4" />
                                        <span>Post New Job</span>
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {companyJobs.map((job) => (
                                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                        <p className="text-gray-600">{job.location}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            {job.employmentType.replace('_', ' ')}
                                                        </span>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-4">{job.description}</p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <DollarSign className="w-4 h-4 mr-2" />
                                                        {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Users className="w-4 h-4 mr-2" />
                                                        {job.applicationsCount} applications
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Posted {formatDate(job.postedAt)}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-wrap gap-1">
                                                        {job.requirements.slice(0, 2).map((req, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                                            >
                                                                {req}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            Edit
                                                        </Button>
                                                        <Button size="sm">
                                                            View Applications
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'candidates' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">AI-Recommended Candidates</h2>
                                    <div className="space-y-4">
                                        {mockJobSeekers.map((candidate) => (
                                            <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                                <span className="text-green-600 font-semibold text-lg">
                                                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                                                                <p className="text-gray-600">{candidate.experience} experience</p>
                                                                <p className="text-sm text-gray-500">{candidate.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                                95% Match
                                                            </span>
                                                            <Button size="sm" variant="outline">
                                                                <MessageCircle className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {candidate.skills.map((skill, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                                                                >
                                                                    {skill.replace('_', ' ')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Preferred Job Types</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {candidate.preferredJobTypes.map((type, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                                >
                                                                    {type.replace('_', ' ')}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span>Availability: {candidate.availability.replace('_', ' ')}</span>
                                                            {candidate.certifications && (
                                                                <span>Certifications: {candidate.certifications.length}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button size="sm" variant="outline">
                                                                View Profile
                                                            </Button>
                                                            <Button size="sm">
                                                                Contact
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
                                    <div className="space-y-4">
                                        {companyApplications.map((application) => (
                                            <Card key={application.id} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                <span className="text-green-600 font-semibold text-sm">
                                                                    {application.jobSeeker.name.split(' ').map(n => n[0]).join('')}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">{application.jobSeeker.name}</h3>
                                                                <p className="text-sm text-gray-600">{application.job.title}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(application.appliedAt)}
                                                        </span>
                                                    </div>

                                                    {application.coverLetter && (
                                                        <div className="mb-4">
                                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                                {application.coverLetter}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="flex justify-end space-x-2">
                                                        <Button size="sm" variant="outline">
                                                            Reply
                                                        </Button>
                                                        <Button size="sm">
                                                            Schedule Interview
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

