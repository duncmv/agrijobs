import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Image
                                src="/images/logo.png"
                                alt="Feasts AgriJobs Logo"
                                width={32}
                                height={32}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-bold">
                                <span style={{ color: '#d4b327' }}>Feasts</span> AgriJobs
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Connecting agricultural talent with opportunity. Building the future of farming, one job at a time.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                            <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/jobs" className="text-gray-400 hover:text-white">
                                    Find Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/candidates" className="text-gray-400 hover:text-white">
                                    Find Workers
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Employers</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/employers/post-job" className="text-gray-400 hover:text-white">
                                    Post a Job
                                </Link>
                            </li>
                            <li>
                                <Link href="/employers/pricing" className="text-gray-400 hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/employers/solutions" className="text-gray-400 hover:text-white">
                                    Solutions
                                </Link>
                            </li>
                            <li>
                                <Link href="/employers/support" className="text-gray-400 hover:text-white">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-gray-400">info@feasts.co.ug</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-gray-400">+256 393 246 820</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-gray-400">Kampala, Uganda</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2025 Feasts Consultants International. All rights reserved. | Privacy Policy | Terms of Service
                    </p>
                </div>
            </div>
        </footer>
    )
}
