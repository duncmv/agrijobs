import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserPlus, Search, Handshake, TrendingUp } from 'lucide-react'

export function HowItWorks() {
    const steps = [
        {
            icon: UserPlus,
            title: 'Create Your Profile',
            description: 'Sign up and build your professional profile with skills, experience, and preferences.',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            icon: Search,
            title: 'Discover Opportunities',
            description: 'Browse jobs or candidates using our smart search and AI-powered recommendations.',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            icon: Handshake,
            title: 'Connect & Apply',
            description: 'Apply to jobs or reach out to candidates through our secure messaging system.',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            icon: TrendingUp,
            title: 'Grow Your Career',
            description: 'Build lasting relationships and advance your agricultural career with confidence.',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ]

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600">
                        Simple steps to connect agricultural talent with opportunity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <step.icon className={`w-8 h-8 ${step.color}`} />
                                </div>
                                <CardTitle className="text-lg">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm">
                                    {step.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}

