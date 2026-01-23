import Header from '@/components/Header'
import Hero from '@/components/Hero'
import PropertyCategories from '@/components/PropertyCategories'
import FeaturedProperties from '@/components/FeaturedProperties'
import InvestmentOpportunities from '@/components/InvestmentOpportunities'
import PropertyGeography from '@/components/PropertyGeography'
import CompanyAdvantages from '@/components/CompanyAdvantages'
import WorkProcess from '@/components/WorkProcess'
import ClientTestimonials from '@/components/ClientTestimonials'
import PartnerLogos from '@/components/PartnerLogos'
import FAQ from '@/components/FAQ'
import StrongCTA from '@/components/StrongCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      <Header />
      <Hero />
      <PropertyCategories />
      <FeaturedProperties />
      <InvestmentOpportunities />
      {/* <PropertyGeography /> */}
      <CompanyAdvantages />
      {/* <WorkProcess /> */}
      {/* <ClientTestimonials /> */}
      {/* <PartnerLogos /> */}
      {/* <FAQ /> */}
      <StrongCTA />
      <Footer />
    </main>
  )
}

