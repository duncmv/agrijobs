import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, DollarSign, Users } from 'lucide-react'
import { mockJobs } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export function FeaturedJobs() {
    const featuredJobs = mockJobs.slice(0, 3)

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
                    <p className="text-lg text-gray-600">
                        Discover exciting opportunities in agriculture
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                            {job.employer.companyName}
                                        </CardDescription>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        {job.employmentType.replace('_', ' ')}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="w-4 h-4 mr-2" />
                                        {job.applicationsCount} applications
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-4">
                                    {job.requirements.slice(0, 2).map((req, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                                        >
                                            {req}
                                        </span>
                                    ))}
                                </div>

                                <Button className="w-full">
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                        View All Jobs
                    </Button>
                </div>
            </div>
        </section>
    )
}

