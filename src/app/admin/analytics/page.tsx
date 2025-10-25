'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase,
    Building2,
    Calendar,
    MapPin
} from 'lucide-react'

interface AnalyticsData {
    userGrowth: Array<{ month: string; count: number }>
    jobPostings: Array<{ month: string; count: number }>
    topDistricts: Array<{ district: string; count: number }>
    enterpriseTypes: Array<{ type: string; count: number }>
    jobTypes: Array<{ type: string; count: number }>
    monthlyStats: {
        newUsers: number
        newJobs: number
        newOrganizations: number
        totalApplications: number
    }
}

export default function AdminAnalytics() {
    const { user, isAuthenticated } = useAuth()
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            window.location.href = '/'
            return
        }

        fetchAnalytics()
    }, [isAuthenticated, user])

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/admin/analytics')
            if (response.ok) {
                const data = await response.json()
                setAnalytics(data)
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
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
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-600 mt-2">Platform insights and performance metrics</p>
                </div>

                {/* Monthly Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Users This Month</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.monthlyStats.newUsers || 0}</div>
                            <p className="text-xs text-gray-600">+12% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Jobs This Month</CardTitle>
                            <Briefcase className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.monthlyStats.newJobs || 0}</div>
                            <p className="text-xs text-gray-600">+8% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.monthlyStats.newOrganizations || 0}</div>
                            <p className="text-xs text-gray-600">+5% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics?.monthlyStats.totalApplications || 0}</div>
                            <p className="text-xs text-gray-600">+15% from last month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Districts */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Districts by Job Postings</CardTitle>
                            <CardDescription>Most active districts on the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics?.topDistricts.slice(0, 5).map((district, index) => (
                                    <div key={district.district} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm font-medium">{district.district}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold">{district.count} jobs</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enterprise Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enterprise Types Distribution</CardTitle>
                            <CardDescription>Breakdown by agricultural enterprise types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics?.enterpriseTypes.map((enterprise) => (
                                    <div key={enterprise.type} className="flex items-center justify-between">
                                        <span className="text-sm font-medium capitalize">
                                            {enterprise.type.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(enterprise.count / Math.max(...analytics.enterpriseTypes.map(e => e.count))) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold w-8 text-right">{enterprise.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Types */}
                <Card>
                    <CardHeader>
                        <CardTitle>Job Types Distribution</CardTitle>
                        <CardDescription>Breakdown of job postings by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {analytics?.jobTypes.map((jobType) => (
                                <div key={jobType.type} className="text-center p-4 bg-gray-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{jobType.count}</div>
                                    <div className="text-sm text-gray-600 capitalize">
                                        {jobType.type.replace('_', ' ')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
