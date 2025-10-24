import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import {
    Heart,
    Users,
    Target,
    Mail,
    Phone,
    MapPin,
    Send,
    CheckCircle,
    Globe,
    Shield,
    Lightbulb
} from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Empowering Rural Employment
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        We believe that agriculture is not just a job—it's a calling. Our mission is to connect
                        passionate agricultural professionals with opportunities that help them grow and thrive.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            To bridge the gap between agricultural talent and opportunity, creating a more
                            connected and prosperous agricultural community.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle>Passion-Driven</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    We understand that agriculture is more than a job—it's a way of life.
                                    We connect people who share this passion.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle>Community-Focused</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Building strong relationships between employers and workers,
                                    creating lasting partnerships that benefit everyone.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-purple-600" />
                                </div>
                                <CardTitle>Results-Oriented</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Using AI-powered matching and data-driven insights to ensure
                                    the right people find the right opportunities.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-lg text-gray-600">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
                                <p className="text-sm text-gray-600">
                                    Building transparent relationships based on honesty and reliability.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                                <p className="text-sm text-gray-600">
                                    Making agricultural opportunities accessible to everyone, everywhere.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                                <p className="text-sm text-gray-600">
                                    Leveraging technology to solve traditional challenges in agriculture.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                                <p className="text-sm text-gray-600">
                                    Committed to delivering the highest quality service and results.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-lg text-gray-600">
                            Have questions? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a Message</CardTitle>
                                <CardDescription>
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="What's this about?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="Tell us more about your inquiry..."
                                        ></textarea>
                                    </div>

                                    <Button className="w-full flex items-center space-x-2">
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Mail className="w-5 h-5 text-green-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Email</p>
                                                <p className="text-gray-600">hello@agrijobs.ug</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Phone className="w-5 h-5 text-green-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Phone</p>
                                                <p className="text-gray-600">+256 700 123 456</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <MapPin className="w-5 h-5 text-green-600 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Address</p>
                                                <p className="text-gray-600">
                                                    Plot 15, Nakasero Hill<br />
                                                    Kampala, Central Region, Uganda
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Monday - Friday</span>
                                            <span className="text-gray-900">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Saturday</span>
                                            <span className="text-gray-900">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Sunday</span>
                                            <span className="text-gray-900">Closed</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                                    <div className="space-y-2">
                                        <a href="/jobs" className="block text-green-600 hover:text-green-700">
                                            Browse Jobs
                                        </a>
                                        <a href="/candidates" className="block text-green-600 hover:text-green-700">
                                            Find Workers
                                        </a>
                                        <a href="/employers/pricing" className="block text-green-600 hover:text-green-700">
                                            Pricing Plans
                                        </a>
                                        <a href="/help" className="block text-green-600 hover:text-green-700">
                                            Help Center
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
