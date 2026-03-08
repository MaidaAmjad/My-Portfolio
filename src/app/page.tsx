import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import ExperienceSection from '@/components/ExperienceSection'
import CertificationsSection from '@/components/CertificationsSection'
import QuoteSection from '@/components/QuoteSection'
import ContactSection from '@/components/ContactSection'

// Always render fresh so profile updates from admin show without hard refresh
export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="neon-boundary relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-24">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertificationsSection />
        <QuoteSection />
        <ContactSection />
      </main>
    </div>
  )
}
