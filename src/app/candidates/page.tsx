'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Search, MapPin, Filter, Users, Star, MessageCircle, Eye } from 'lucide-react'
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'

interface Candidate {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    experience: string
    skills: string[]
    educationLevel: string
    location: string
    availabilityStatus: string
    bio: string
    createdAt: string
    preferredJobTypes: string[]
    certifications: string[]
    availability: string
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { isAuthenticated } = useAuth()

    useEffect(() => {
        fetchCandidates()
    }, [])

    // Check if user came from hero section to post a job
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const fromHero = urlParams.get('fromHero')

        if (fromHero === 'true') {
            // User came from hero section, trigger post job functionality
            if (isAuthenticated) {
                // User is logged in, redirect to post-job
                window.location.href = '/post-job'
            } else {
                // User not logged in, open auth modal
                setShowAuthModal(true)
            }
        }
    }, [isAuthenticated])

    const fetchCandidates = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/candidates')
            if (!response.ok) {
                throw new Error('Failed to fetch candidates')
            }
            const data = await response.json()
            setCandidates(data.candidates)
        } catch (error) {
            console.error('Error fetching candidates:', error)
            setError('Failed to load candidates')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Agricultural Workers</h1>
                        <p className="text-lg text-gray-600">
                            Connect with skilled agricultural professionals ready to contribute to your farm
                        </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <Button
                            size="lg"
                            className="flex items-center space-x-2"
                            onClick={() => {
                                if (isAuthenticated) {
                                    window.location.href = '/post-job'
                                } else {
                                    setShowAuthModal(true)
                                }
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Post a Job</span>
                        </Button>
                        <p className="text-sm text-gray-500 text-right max-w-xs">
                            {isAuthenticated
                                ? 'Click to post a job for your organization'
                                : 'Need to sign in to post jobs for your organization'
                            }
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Skills or experience"
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
                                <select className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option>All Availability</option>
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

                {/* Candidate Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Candidate Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">{error}</p>
                                <Button onClick={fetchCandidates}>Try Again</Button>
                            </div>
                        ) : candidates.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">No candidates available at the moment.</p>
                                <p className="text-sm text-gray-500">Check back later for new profiles!</p>
                            </div>
                        ) : (
                            candidates.map((candidate) => (
                                <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 font-semibold text-xl">
                                                        {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{candidate.firstName} {candidate.lastName}</h3>
                                                    <p className="text-gray-600 mb-1">{candidate.experience} experience</p>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {candidate.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                    {candidate.availabilityStatus}
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm text-gray-600">95% Match</span>
                                                </div>
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

                                        {candidate.certifications && candidate.certifications.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Certifications</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.certifications.map((cert, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                                        >
                                                            {cert}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-600">
                                                <p>Availability: {candidate.availability.replace('_', ' ')}</p>
                                                {candidate.certifications && (
                                                    <p>Certifications: {candidate.certifications.length}</p>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Profile
                                                </Button>
                                                <Button size="sm">
                                                    <MessageCircle className="w-4 h-4 mr-1" />
                                                    Contact
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* AI Matching */}
                        <Card>
                            <CardHeader>
                                <CardTitle>AI-Powered Matching</CardTitle>
                                <CardDescription>Get personalized candidate recommendations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Requirements</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Describe the role and requirements..."
                                        ></textarea>
                                    </div>
                                    <Button className="w-full">
                                        Get AI Recommendations
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Popular Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {['Tractor Operation', 'Livestock Management', 'Irrigation Systems', 'Crop Monitoring', 'Equipment Maintenance'].map((skill, index) => (
                                        <button
                                            key={index}
                                            className="w-full text-left text-sm text-gray-600 hover:text-green-600 py-1"
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employer Resources */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Employer Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <a href="/employers/pricing" className="block text-green-600 hover:text-green-700 text-sm">
                                        Pricing Plans
                                    </a>
                                    <a href="/employers/guide" className="block text-green-600 hover:text-green-700 text-sm">
                                        Hiring Guide
                                    </a>
                                    <a href="/employers/support" className="block text-green-600 hover:text-green-700 text-sm">
                                        Support Center
                                    </a>
                                    <a href="/employers/success-stories" className="block text-green-600 hover:text-green-700 text-sm">
                                        Success Stories
                                    </a>
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
                defaultMode="login"
                redirectAfterAuth={typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('fromHero') === 'true' ? '/post-job' : '/candidates'}
            />
        </div>
    )
}
