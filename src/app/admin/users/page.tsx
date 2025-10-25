'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    Users,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Calendar,
    Shield,
    Briefcase,
    Building2
} from 'lucide-react'

interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone: string
    role: string
    email_verified: boolean
    last_login: string
    is_active: boolean
    created_at: string
    organizations_count: number
    jobs_posted_count: number
    applications_count: number
}

export default function AdminUsers() {
    const { user, isAuthenticated } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'job_seekers' | 'employers' | 'admins'>('all')

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            window.location.href = '/'
            return
        }

        fetchUsers()
    }, [isAuthenticated, user, filter])

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/admin/users?filter=${filter}`)
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleUserStatus = async (userId: string, isActive: boolean) => {
        try {
            const response = await fetch('/api/admin/users/toggle-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, isActive: !isActive }),
            })

            if (response.ok) {
                // Refresh the users list
                fetchUsers()
            } else {
                console.error('Failed to toggle user status')
            }
        } catch (error) {
            console.error('Error toggling user status:', error)
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge variant="outline" className="text-red-600 border-red-600"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
            case 'employer':
                return <Badge variant="outline" className="text-blue-600 border-blue-600"><Building2 className="w-3 h-3 mr-1" />Employer</Badge>
            case 'job_seeker':
                return <Badge variant="outline" className="text-green-600 border-green-600"><Users className="w-3 h-3 mr-1" />Job Seeker</Badge>
            default:
                return <Badge variant="outline">{role}</Badge>
        }
    }

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge variant="outline" className="text-green-600 border-green-600"><UserCheck className="w-3 h-3 mr-1" />Active</Badge>
        ) : (
            <Badge variant="outline" className="text-red-600 border-red-600"><UserX className="w-3 h-3 mr-1" />Inactive</Badge>
        )
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
                    <p className="mt-4 text-gray-600">Loading users...</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage platform users and their accounts</p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                        {[
                            { key: 'all', label: 'All Users', count: users.length },
                            { key: 'job_seekers', label: 'Job Seekers', count: users.filter(u => u.role === 'job_seeker').length },
                            { key: 'employers', label: 'Employers', count: users.filter(u => u.role === 'employer').length },
                            { key: 'admins', label: 'Admins', count: users.filter(u => u.role === 'admin').length }
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

                {/* Users List */}
                <div className="space-y-6">
                    {users.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-600">No users match the current filter.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        users.map((user) => (
                            <Card key={user.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">
                                                {user.first_name} {user.last_name}
                                            </CardTitle>
                                            <div className="text-sm text-gray-500 mt-1">
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center space-x-1">
                                                            <Phone className="w-4 h-4" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Joined: {formatDate(user.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getRoleBadge(user.role)}
                                            {getStatusBadge(user.is_active)}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{user.organizations_count} organizations</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Briefcase className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{user.jobs_posted_count} jobs posted</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{user.applications_count} applications</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            {user.last_login ? (
                                                <>Last login: {formatDate(user.last_login)}</>
                                            ) : (
                                                <>Never logged in</>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                className={user.is_active ?
                                                    "text-red-600 border-red-600 hover:bg-red-50" :
                                                    "text-green-600 border-green-600 hover:bg-green-50"
                                                }
                                            >
                                                {user.is_active ? (
                                                    <>
                                                        <UserX className="w-4 h-4 mr-1" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="w-4 h-4 mr-1" />
                                                        Activate
                                                    </>
                                                )}
                                            </Button>
                                            <Button size="sm" variant="outline">
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
