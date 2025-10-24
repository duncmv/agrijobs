'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    User,
    Briefcase,
    Bell,
    Settings,
    Users,
    BarChart3,
    TrendingUp,
    MapPin,
    Calendar,
    Eye,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react'
import { mockJobs, mockEmployers, mockJobSeekers, mockApplications, mockAnalytics } from '@/data/mockData'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'analytics'>('overview')
    const [pendingJobs, setPendingJobs] = useState<any[]>([])
    const [selectedJob, setSelectedJob] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')

    // Fetch pending jobs
    const fetchPendingJobs = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/jobs?status=pending_review')
            if (response.ok) {
                const data = await response.json()
                setPendingJobs(data.jobs)
            }
        } catch (error) {
            console.error('Failed to fetch pending jobs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch job details
    const fetchJobDetails = async (jobId: string) => {
        try {
            const response = await fetch(`/api/admin/jobs/${jobId}`)
            if (response.ok) {
                const data = await response.json()
                setSelectedJob(data.job)
            }
        } catch (error) {
            console.error('Failed to fetch job details:', error)
        }
    }

    // Approve or reject job
    const updateJobStatus = async (jobId: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch('/api/admin/jobs', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobId, status }),
            })

            if (response.ok) {
                // Refresh pending jobs
                fetchPendingJobs()
                setSelectedJob(null)
                alert(`Job ${status} successfully!`)
            } else {
                const error = await response.json()
                alert(`Failed to ${status} job: ${error.error}`)
            }
        } catch (error) {
            console.error('Failed to update job status:', error)
            alert('Failed to update job status')
        }
    }

    useEffect(() => {
        if (activeTab === 'jobs') {
            fetchPendingJobs()
        }
    }, [activeTab])

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
                                <span style={{ color: '#d4b327' }}>Feasts</span> AgriJobs Admin
                            </span>
                        </Link>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-semibold text-sm">A</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Admin User</span>
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
                                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                            <span className="text-red-600 font-semibold text-lg">A</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                                            <p className="text-sm text-gray-600">System Management</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => setActiveTab('overview')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'overview' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            <span>Overview</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('users')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'users' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Users className="w-4 h-4" />
                                            <span>Users</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('jobs')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'jobs' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Briefcase className="w-4 h-4" />
                                            <span>Jobs</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('analytics')}
                                            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === 'analytics' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <TrendingUp className="w-4 h-4" />
                                            <span>Analytics</span>
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
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Users className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalUsers}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <Briefcase className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                                                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalJobs}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Applications</p>
                                                    <p className="text-2xl font-bold text-gray-900">{mockAnalytics.totalApplications}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Calendar className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">This Month</p>
                                                    <p className="text-2xl font-bold text-gray-900">+12%</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Job Postings</CardTitle>
                                            <CardDescription>Latest jobs posted on the platform</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {mockJobs.slice(0, 3).map((job) => (
                                                    <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{job.title}</h4>
                                                            <p className="text-sm text-gray-600">{job.employer.companyName}</p>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {formatDate(job.postedAt)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Top Skills in Demand</CardTitle>
                                            <CardDescription>Most requested skills by employers</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                {mockAnalytics.skillsInDemand.slice(0, 5).map((skill, index) => (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
                                                        <span className="text-sm text-gray-500">{skill.count} jobs</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                                    <div className="flex space-x-2">
                                        <Button variant="outline">Export Users</Button>
                                        <Button>Add User</Button>
                                    </div>
                                </div>

                                {/* Users Table */}
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {[...mockEmployers, ...mockJobSeekers].map((user) => (
                                                        <tr key={user.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                        <span className="text-green-600 font-semibold text-sm">
                                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-3">
                                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'employer' ? 'bg-blue-100 text-blue-800' :
                                                                    user.role === 'job_seeker' ? 'bg-green-100 text-green-800' :
                                                                        'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {user.role.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {user.location || 'Not specified'}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {formatDate(user.createdAt)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                <div className="flex space-x-2">
                                                                    <Button size="sm" variant="outline">
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline">
                                                                        <Edit className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Job Review</h2>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" onClick={fetchPendingJobs}>
                                            Refresh
                                        </Button>
                                        <Button onClick={() => setReviewStatus('pending')}>
                                            Pending Review ({pendingJobs.length})
                                        </Button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                ) : pendingJobs.length === 0 ? (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Jobs</h3>
                                            <p className="text-gray-600">All jobs have been reviewed. Great work!</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingJobs.map((job) => (
                                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                                                            <p className="text-gray-600">{job.organization_name}</p>
                                                            <p className="text-sm text-gray-500">Posted by: {job.posted_by_name}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                <Clock className="w-3 h-3 inline mr-1" />
                                                                Pending Review
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => fetchJobDetails(job.id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Users className="w-4 h-4 mr-2" />
                                                            {job.total_workers_needed} workers needed
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <span className="mr-2">💰</span>
                                                            {formatCurrency(job.salary_min_ugx)} - {formatCurrency(job.salary_max_ugx)}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Start: {formatDate(new Date(job.expected_start_date))}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-wrap gap-1">
                                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                                {job.job_type.replace('_', ' ')}
                                                            </span>
                                                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                                                {job.working_hours.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => fetchJobDetails(job.id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                Review Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Job Detail Modal */}
                                {selectedJob && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                                                        <p className="text-gray-600">{selectedJob.organization_name}</p>
                                                        <p className="text-sm text-gray-500">Posted by: {selectedJob.posted_by_name}</p>
                                                    </div>
                                                    <Button variant="ghost" onClick={() => setSelectedJob(null)}>
                                                        <XCircle className="w-6 h-6" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-lg">Job Details</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-3">
                                                            <div>
                                                                <span className="font-medium">Workers Needed:</span> {selectedJob.total_workers_needed}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Job Type:</span> {selectedJob.job_type.replace('_', ' ')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Working Hours:</span> {selectedJob.working_hours.replace('_', ' ')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Start Date:</span> {formatDate(new Date(selectedJob.expected_start_date))}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Description:</span>
                                                                <p className="text-sm text-gray-600 mt-1">{selectedJob.description}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>

                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-lg">Work Conditions</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-3">
                                                            <div>
                                                                <span className="font-medium">Salary Range:</span>
                                                                {formatCurrency(selectedJob.salary_min_ugx)} - {formatCurrency(selectedJob.salary_max_ugx)}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Payment Mode:</span> {selectedJob.payment_mode.replace('_', ' ')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Accommodation:</span> {selectedJob.accommodation.replace('_', ' ')}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Meals:</span> {selectedJob.meals.replace('_', ' ')}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                <div className="flex justify-end space-x-4">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setSelectedJob(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        onClick={() => updateJobStatus(selectedJob.id, 'rejected')}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Reject Job
                                                    </Button>
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => updateJobStatus(selectedJob.id, 'approved')}
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Approve Job
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>

                                {/* Regional Distribution */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Jobs by Region</CardTitle>
                                        <CardDescription>Distribution of job postings across different regions</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {Object.entries(mockAnalytics.jobsByRegion).map(([region, count]) => (
                                                <div key={region} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-700">{region}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{ width: `${(count / Math.max(...Object.values(mockAnalytics.jobsByRegion))) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-500 w-8">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Monthly Trends */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Monthly Trends</CardTitle>
                                        <CardDescription>Job postings and applications over time</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {mockAnalytics.monthlyTrends.map((trend, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-700">{trend.month}</span>
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-500">Jobs</p>
                                                            <p className="text-lg font-semibold text-gray-900">{trend.jobs}</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm text-gray-500">Applications</p>
                                                            <p className="text-lg font-semibold text-gray-900">{trend.applications}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
