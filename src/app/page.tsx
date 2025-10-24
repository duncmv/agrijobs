import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedJobs } from '@/components/FeaturedJobs'
import { HowItWorks } from '@/components/HowItWorks'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturedJobs />
      <HowItWorks />
      <Testimonials />
      <Footer />
      <Chatbot />
    </div>
  )
}