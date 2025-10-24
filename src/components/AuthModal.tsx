'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultMode?: 'login' | 'register'
    redirectAfterAuth?: string
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login', redirectAfterAuth }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { login, register } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            if (mode === 'login') {
                await login(formData.email, formData.password)
                onClose()

                // Handle intended action after login
                const intendedAction = localStorage.getItem('intendedAction')
                if (intendedAction === 'apply') {
                    // User wanted to apply, check if they have a profile
                    setTimeout(() => {
                        const hasProfile = localStorage.getItem('hasEmployeeProfile')
                        if (hasProfile === 'false') {
                            window.location.href = '/create-profile'
                        }
                        // If profile exists, just stay on the page (modal already closed)
                    }, 100)
                } else if (redirectAfterAuth) {
                    window.location.href = redirectAfterAuth
                }
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Passwords do not match')
                }
                await register({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    role: 'job_seeker' // Default to job seeker for applying
                })
                onClose()

                // Handle intended action after registration
                const intendedAction = localStorage.getItem('intendedAction')
                if (intendedAction === 'apply') {
                    // New user needs to create profile first
                    setTimeout(() => {
                        window.location.href = '/create-profile'
                    }, 100)
                } else if (redirectAfterAuth) {
                    window.location.href = redirectAfterAuth
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            await signIn('google', { callbackUrl: '/' })
        } catch (error) {
            console.error('Google sign in error:', error)
            setError('Google sign in failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-white bg-opacity-5 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-center" style={{ color: '#3B546E' }}>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {mode === 'login'
                            ? 'Sign in to apply for jobs and manage your profile'
                            : 'Create an account to find agricultural opportunities'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="pl-10"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="pl-10"
                                            placeholder="Mukasa"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="pl-10"
                                    placeholder="john@farm.com"
                                    required
                                />
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className="pl-10"
                                        placeholder="+256 700 123 456"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="pl-10 pr-10"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="pl-10"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </Button>
                    </form>

                    {/* Google Sign In */}
                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-4"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                                className="ml-1 text-green-600 hover:text-green-700 font-medium"
                            >
                                {mode === 'login' ? 'Sign up' : 'Sign in'}
                            </button>
                        </p>
                    </div>

                    {mode === 'login' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
                            <p className="text-sm text-blue-700">Employer: demo@agrijobs.ug / demo123</p>
                            <p className="text-sm text-blue-700">Admin: admin@agrijobs.ug / admin123</p>
                        </div>
                    )}

                    <div className="mt-4 text-center">
                        <button
                            onClick={onClose}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
