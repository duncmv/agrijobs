import { Card, CardContent } from '@/components/ui/Card'
import { Star } from 'lucide-react'

export function Testimonials() {
    const testimonials = [
        {
            name: 'Sarah Mukasa',
            role: 'Farm Manager',
            company: 'Nakasero Organic Farms',
            content: 'Feasts AgriJobs helped us find skilled workers quickly. The platform is intuitive and the quality of candidates is excellent. We found our best tractor operator through this platform.',
            rating: 5,
            avatar: 'SM',
        },
        {
            name: 'Miguel Kato',
            role: 'Tractor Operator',
            company: 'Nakasero Organic Farms',
            content: 'I found my dream job through Feasts AgriJobs. The application process was smooth and the employer was very professional. The salary and benefits are exactly what I was looking for.',
            rating: 5,
            avatar: 'MK',
        },
        {
            name: 'Grace Nakamya',
            role: 'Agricultural Student',
            company: 'Makerere University',
            content: 'As a student, Feasts AgriJobs connected me with internship opportunities that helped launch my career in agriculture. The platform understands the needs of young professionals.',
            rating: 5,
            avatar: 'GN',
        },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
                    <p className="text-lg text-gray-600">
                        Real stories from farmers, workers, and agricultural professionals across Uganda
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                <p className="text-gray-700 mb-4 italic">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-green-600 font-semibold text-sm">
                                            {testimonial.avatar}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {testimonial.role} at {testimonial.company}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
