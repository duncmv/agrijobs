'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { JobPostingForm } from '@/components/JobPostingForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { Plus, ArrowRight } from 'lucide-react'

export default function PostJobPage() {
    const router = useRouter()
    const { user, organizations, isAuthenticated, isLoading } = useAuth()
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('')

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, isLoading, router])

    const handleJobSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/jobs/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    organizationId: selectedOrganizationId,
                    postedByUserId: user?.id
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Job posting failed')
            }

            const result = await response.json()
            alert(`Job posted successfully! Job ID: ${result.jobId}. It will be reviewed before going live.`)

            // Reset form or redirect
            router.push('/')
        } catch (error) {
            console.error('Job posting error:', error)
            alert('Failed to post job. Please try again.')
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#3B546E' }}></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="mb-8">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f8fafc' }}>
                            <svg className="w-8 h-8" style={{ color: '#3B546E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
                        <p className="text-gray-600 mb-6">
                            You need to sign in to post jobs for your organization. Create an account or sign in to get started.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => {
                                // Store the intended destination
                                localStorage.setItem('agrijobs_redirect', '/post-job')
                                window.location.href = '/'
                            }}
                        >
                            Sign In / Create Account
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full"
                            onClick={() => window.location.href = '/'}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    // Show organization selection or job posting form
    if (!selectedOrganizationId) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />

                <div className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a Job</h1>
                            <p className="text-lg text-gray-600">
                                Choose an organization to post your job under
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Existing Organizations */}
                            {organizations.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-center">Your Organizations</CardTitle>
                                        <CardDescription className="text-center">
                                            Post a job under one of your existing organizations
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-24 overflow-y-scroll space-y-1 pr-2" style={{ scrollbarWidth: 'thin' }}>
                                            {organizations.map((org) => (
                                                <div
                                                    key={org.organizationId}
                                                    className="p-2 border border-gray-200 rounded cursor-pointer transition-all duration-200"
                                                    style={{
                                                        '--hover-border': '#3B546E',
                                                        '--hover-bg': '#f8fafc'
                                                    } as React.CSSProperties}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#3B546E'
                                                        e.currentTarget.style.backgroundColor = '#f8fafc'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#e5e7eb'
                                                        e.currentTarget.style.backgroundColor = 'transparent'
                                                    }}
                                                    onClick={() => setSelectedOrganizationId(org.organizationId)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-semibold text-gray-900">
                                                                {org.organization.name}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                Your role: {org.role}
                                                            </p>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Create New Organization */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-center">Create New Organization</CardTitle>
                                    <CardDescription className="text-center">
                                        Set up a new farm or agricultural business
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setSelectedOrganizationId('new')}
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create New Organization
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    // Show job posting form
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a Job</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Create a detailed job posting to attract the right agricultural workers.
                            Fill out all sections to ensure your job reaches qualified candidates.
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: '#3B546E' }}>
                                Posting for: {selectedOrganizationId === 'new' ? 'New Organization' : organizations.find(org => org.organizationId === selectedOrganizationId)?.organization?.name}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrganizationId('')}
                            >
                                Change Organization
                            </Button>
                        </div>
                    </div>

                    <JobPostingForm onSubmit={handleJobSubmit} selectedOrganizationId={selectedOrganizationId} />
                </div>
            </div>

            <Footer />
        </div>
    )
}
