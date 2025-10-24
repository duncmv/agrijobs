'use client'

import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { EmployeeProfileForm } from '@/components/EmployeeProfileForm'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function CreateEmployeeProfilePage() {
    const [isLoading, setIsLoading] = useState(false)
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    const handleSubmit = async (profileData: any) => {
        if (!user) return

        console.log('handleSubmit called with profileData:', profileData)
        console.log('User ID:', user.id)

        setIsLoading(true)
        try {
            const requestBody = {
                userId: user.id,
                ...profileData
            }
            console.log('Sending request body:', requestBody)

            const response = await fetch('/api/employee-profiles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            console.log('Response status:', response.status)
            console.log('Response ok:', response.ok)

            if (!response.ok) {
                const errorData = await response.json()
                console.log('Error data:', errorData)
                throw new Error(errorData.error || 'Failed to save profile')
            }

            const result = await response.json()
            console.log('Success result:', result)
            alert('Profile saved successfully!')
            router.push('/jobs')
        } catch (error) {
            console.error('Error saving profile:', error)
            alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navigation />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Employee Profile</h1>
                        <p className="text-lg text-gray-600 mb-8">Please sign in to create your profile</p>
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Employee Profile</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Complete your profile to apply for jobs and get matched with the right opportunities.
                            This information helps employers find candidates with the right skills and experience.
                        </p>
                    </div>

                    <EmployeeProfileForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            <Footer />
        </div>
    )
}
