'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
    Users,
    Briefcase,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    UserCheck,
    Building2
} from 'lucide-react'

interface AdminStats {
    totalUsers: number
    totalJobs: number
    pendingJobs: number
    approvedJobs: number
    rejectedJobs: number
    totalApplications: number
    activeOrganizations: number
    recentActivity: Array<{
        id: string
        type: 'job_posted' | 'job_approved' | 'job_rejected' | 'user_registered'
        description: string
        timestamp: string
    }>
}

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth()
    const [stats, setStats] = useState<AdminStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            window.location.href = '/'
            return
        }

        fetchAdminStats()
    }, [isAuthenticated, user])

    const fetchAdminStats = async () => {
        try {
            const response = await fetch('/api/admin/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data)
            }
        } catch (error) {
            console.error('Failed to fetch admin stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Here's what's happening on the platform.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Users */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                            <p className="text-xs text-gray-600">Registered users</p>
                        </CardContent>
                    </Card>

                    {/* Total Jobs */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                            <p className="text-xs text-gray-600">All job postings</p>
                        </CardContent>
                    </Card>

                    {/* Pending Jobs */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.pendingJobs || 0}</div>
                            <p className="text-xs text-gray-600">Awaiting approval</p>
                        </CardContent>
                    </Card>

                    {/* Active Organizations */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeOrganizations || 0}</div>
                            <p className="text-xs text-gray-600">Active organizations</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Status Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Job Status Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Status Overview</CardTitle>
                            <CardDescription>Current status of all job postings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium">Approved</span>
                                    </div>
                                    <span className="text-sm font-bold">{stats?.approvedJobs || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium">Pending</span>
                                    </div>
                                    <span className="text-sm font-bold">{stats?.pendingJobs || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium">Rejected</span>
                                    </div>
                                    <span className="text-sm font-bold">{stats?.rejectedJobs || 0}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common administrative tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button className="w-full justify-start" variant="outline">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    Review Pending Jobs
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Users className="h-4 w-4 mr-2" />
                                    Manage Users
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                </Button>
                                <Button className="w-full justify-start" variant="outline">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Manage Organizations
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest platform activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            {activity.type === 'job_posted' && <Briefcase className="h-4 w-4 text-blue-600" />}
                                            {activity.type === 'job_approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                            {activity.type === 'job_rejected' && <XCircle className="h-4 w-4 text-red-600" />}
                                            {activity.type === 'user_registered' && <UserCheck className="h-4 w-4 text-purple-600" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                                            <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No recent activity</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
