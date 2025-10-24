'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/AuthModal'
import { useAuth } from '@/contexts/AuthContext'
import { Menu, X, User, Briefcase, Home, Users, Settings, LogOut } from 'lucide-react'

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false)
    const [showAuthModal, setShowAuthModal] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()

    const handleLogout = () => {
        logout()
        setIsOpen(false)
    }

    return (
        <>
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
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
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="flex items-center space-x-1 text-gray-700 transition-colors" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <Link href="/jobs" className="flex items-center space-x-1 text-gray-700 transition-colors" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                <Briefcase className="w-4 h-4" />
                                <span>Find Jobs</span>
                            </Link>
                            <Link href="/candidates" className="flex items-center space-x-1 text-gray-700 transition-colors" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                <Users className="w-4 h-4" />
                                <span>Find Workers</span>
                            </Link>
                            {isAuthenticated && (
                                <Link href="/my-jobs" className="flex items-center space-x-1 text-gray-700 transition-colors" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                    <User className="w-4 h-4" />
                                    <span>My Jobs</span>
                                </Link>
                            )}
                            <Link href="/about" className="text-gray-700 transition-colors" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                About
                            </Link>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            {isAuthenticated ? (
                                <>
                                    {user?.role === 'admin' && (
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href="/dashboard/admin">Admin Panel</Link>
                                        </Button>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-semibold text-sm">
                                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {user?.firstName} {user?.lastName}
                                        </span>
                                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                                            <LogOut className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                                    Sign In
                                </Button>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-700 transition-colors"
                                style={{ '--hover-color': '#d4b327' } as React.CSSProperties}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
                                <Link href="/" className="flex items-center space-x-2 text-gray-700 transition-colors px-3 py-2" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                    <Home className="w-4 h-4" />
                                    <span>Home</span>
                                </Link>
                                <Link href="/jobs" className="flex items-center space-x-2 text-gray-700 transition-colors px-3 py-2" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                    <Briefcase className="w-4 h-4" />
                                    <span>Find Jobs</span>
                                </Link>
                                <Link href="/candidates" className="flex items-center space-x-2 text-gray-700 transition-colors px-3 py-2" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                    <Users className="w-4 h-4" />
                                    <span>Find Workers</span>
                                </Link>
                                {isAuthenticated && (
                                    <Link href="/my-jobs" className="flex items-center space-x-2 text-gray-700 transition-colors px-3 py-2" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                        <User className="w-4 h-4" />
                                        <span>My Jobs</span>
                                    </Link>
                                )}
                                <Link href="/about" className="text-gray-700 transition-colors px-3 py-2 block" style={{ '--hover-color': '#d4b327' } as React.CSSProperties} onMouseEnter={(e) => e.currentTarget.style.color = '#d4b327'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>
                                    About
                                </Link>
                                <div className="pt-4 space-y-2">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="flex items-center space-x-2 px-3 py-2">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <span className="text-green-600 font-semibold text-sm">
                                                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {user?.firstName} {user?.lastName}
                                                </span>
                                            </div>
                                            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => setShowAuthModal(true)}>
                                            Sign In
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                redirectAfterAuth={typeof window !== 'undefined' ? window.location.pathname : '/'}
            />
        </>
    )
}
