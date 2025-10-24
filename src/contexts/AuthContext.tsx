'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Organization, UserOrganization } from '@/types'

interface AuthContextType {
    user: User | null
    organizations: UserOrganization[]
    primaryOrganization: Organization | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    register: (userData: RegisterData) => Promise<void>
    isLoading: boolean
    isAuthenticated: boolean
}

interface RegisterData {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: 'job_seeker' | 'employer'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [organizations, setOrganizations] = useState<UserOrganization[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const primaryOrganization = organizations.find(org => org.isPrimary)?.organization || null

    useEffect(() => {
        // Check for existing session on mount
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            // In a real app, this would check localStorage or make an API call
            const savedUser = localStorage.getItem('agrijobs_user')
            if (savedUser) {
                const userData = JSON.parse(savedUser)
                setUser(userData)

                // Load user's organizations
                const savedOrgs = localStorage.getItem(`agrijobs_orgs_${userData.id}`)
                if (savedOrgs) {
                    setOrganizations(JSON.parse(savedOrgs))
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Login failed')
            }

            const data = await response.json()

            setUser(data.user)
            setOrganizations(data.organizations)

            // Save to localStorage
            localStorage.setItem('agrijobs_user', JSON.stringify(data.user))
            localStorage.setItem(`agrijobs_orgs_${data.user.id}`, JSON.stringify(data.organizations))
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const register = async (userData: RegisterData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Registration failed')
            }

            const data = await response.json()

            setUser(data.user)
            setOrganizations(data.organizations)

            // Save to localStorage
            localStorage.setItem('agrijobs_user', JSON.stringify(data.user))
            localStorage.setItem(`agrijobs_orgs_${data.user.id}`, JSON.stringify(data.organizations))
        } catch (error) {
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUser(null)
        setOrganizations([])
        localStorage.removeItem('agrijobs_user')
        localStorage.removeItem('intendedAction')
        localStorage.removeItem('jobId')
        localStorage.removeItem('hasEmployeeProfile')
        if (user) {
            localStorage.removeItem(`agrijobs_orgs_${user.id}`)
        }
    }

    const value: AuthContextType = {
        user,
        organizations,
        primaryOrganization,
        login,
        logout,
        register,
        isLoading,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
