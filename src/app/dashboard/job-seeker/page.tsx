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
    Search,
    MapPin,
    Filter,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react'
import { mockJobs, mockJobSeekers, mockApplications } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function JobSeekerDashboard() {
    const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'applications'>('profile')
    const user = mockJobSeekers[0] // Simulate logged-in user
    const applications = mockApplications.filter(app => app.jobSeekerId === user.id)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'hired':
                return <CheckCircle className="w-4 h-4 text-green-600" />
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-600" />
            case 'shortlisted':
                return <Star className="w-4 h-4 text-yellow-600" />
            case 'reviewed':
                return <AlertCircle className="w-4 h-4 text-blue-600" />
            default:
                return <Clock className="w-4 h-4 text-gray-600" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hired':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            case 'shortlisted':
                return 'bg-yellow-100 text-yellow-800'
            case 'reviewed':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

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
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-600">{user.experience} experience</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setActiveTab('profile')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'profile' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('jobs')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'jobs' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span>Find Jobs</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('applications')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'applications' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Applications</span>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>Manage your professional profile and preferences</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={user.name}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={user.email}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={user.location || ''}
                                                    placeholder="Enter your location"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                                <input
                                                    type="text"
                                                    value={user.experience}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {skill.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Job Types</label>
                                            <div className="flex flex-wrap gap-2">
                                                {user.preferredJobTypes.map((type, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {type.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Button className="w-full">
                                            Update Profile
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div className="space-y-6">
                                {/* Search and Filters */}
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Job title or keywords"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder="Location"
                                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <Button className="flex items-center space-x-2">
                                                <Filter className="w-4 h-4" />
                                                <span>Filters</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Job Recommendations */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Jobs</h2>
                                    <div className="space-y-4">
                                        {mockJobs.map((job) => (
                                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                            <p className="text-gray-600">{job.employer.companyName}</p>
                                                        </div>
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                            {job.employmentType.replace('_', ' ')}
                                                        </span>
                                                    </div>

                                                    <p className="text-gray-700 mb-4">{job.description}</p>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {job.location}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <span className="mr-2">💰</span>
                                                            {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
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
                                                        <Button size="sm">
                                                            Apply Now
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Applications</h2>
                                    <div className="space-y-4">
                                        {applications.map((application) => (
                                            <Card key={application.id} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{application.job.title}</h3>
                                                            <p className="text-gray-600">{application.job.employer.companyName}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {getStatusIcon(application.status)}
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2" />
                                                            {application.job.location}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Applied {formatDate(application.appliedAt)}
                                                        </div>
                                                    </div>

                                                    {application.coverLetter && (
                                                        <div className="mb-4">
                                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                                {application.coverLetter}
                                                            </p>
                                                        </div>
                                                    )}
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

