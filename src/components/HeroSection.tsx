'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search, MapPin, Briefcase } from 'lucide-react'

export function HeroSection() {
    const [searchType, setSearchType] = useState<'jobs' | 'workers'>('jobs')
    const [searchQuery, setSearchQuery] = useState('')
    const [location, setLocation] = useState('')
    const [currentSlide, setCurrentSlide] = useState(0)

    // Agricultural background images
    const backgroundImages = [
        '/images/1.webp',
        '/images/2.jpeg',
        '/images/3.jpg',
        '/images/4.png'
    ]

    // Auto-advance slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
        }, 5000) // Change slide every 5 seconds

        return () => clearInterval(interval)
    }, [backgroundImages.length])

    return (
        <section className="relative py-20 overflow-hidden">
            {/* Slideshow Background */}
            <div className="absolute inset-0 z-0">
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                ))}
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                    }} />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                        Connecting Hands That{' '}
                        <span style={{ color: '#d4b327' }} className="drop-shadow-lg">Grow the Nation</span>
                    </h1>
                    <p className="text-xl text-gray-100 mb-12 max-w-3xl mx-auto drop-shadow-md">
                        Bridge the gap between agricultural employers and skilled workers.
                        Find your next opportunity or discover the perfect candidate for your farm.
                    </p>

                    {/* Search Section */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <Button
                                    variant={searchType === 'jobs' ? 'primary' : 'outline'}
                                    onClick={() => setSearchType('jobs')}
                                    className="flex items-center space-x-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>Find Jobs</span>
                                </Button>
                                <Button
                                    variant={searchType === 'workers' ? 'secondary' : 'outline'}
                                    onClick={() => setSearchType('workers')}
                                    className="flex items-center space-x-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>Find Workers</span>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder={searchType === 'jobs' ? 'Job title or keywords' : 'Skills or experience'}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button size="lg" className="w-full">
                                    Search {searchType === 'jobs' ? 'Jobs' : 'Workers'}
                                </Button>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" className="flex items-center space-x-2" asChild>
                                <Link href="/candidates?fromHero=true">
                                    <span>Post a Job</span>
                                </Link>
                            </Button>
                            <Button size="lg" variant="primary" className="flex items-center space-x-2" asChild>
                                <Link href="/jobs">
                                    <span>Find Work</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
