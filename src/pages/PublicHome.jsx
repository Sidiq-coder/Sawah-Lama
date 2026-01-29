import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import InfoCards from "../components/InfoCards"
import AboutSection from "../components/AboutSection"
import ServicesSection from "../components/ServicesSection"
import OrganizationSection from "../components/OrganizationSection"
import GallerySection from "../components/GallerySection"
import NewsSection from "../components/NewsSection"
import DataSection from "../components/DataSection"
import ContactSection from "../components/ContactSection"
import Footer from "../components/Footer"
import { usePublicContent } from "../hooks/usePublicContent"
import { navItems, quickLinks } from "../data/siteData"

const emptyContent = {
  heroSlides: [],
  featureCards: [],
  aboutInfo: null,
  wilayahInfo: [],
  services: [],
  organization: [],
  galleryItems: [],
  dataGroups: [],
  contactInfo: [],
  newsPosts: [],
}

export default function PublicHome() {
  const { data, isLoading } = usePublicContent()
  const content = data || emptyContent

  return (
    <div className="min-h-screen bg-white">
      <Navbar navItems={navItems} />
      {isLoading ? (
        <div className="h-1 w-full bg-brand-100">
          <div className="h-full w-1/3 animate-pulse bg-brand-600" />
        </div>
      ) : null}
      <main>
        <Hero slides={content.heroSlides} />
        <InfoCards cards={content.featureCards} />
        <AboutSection aboutInfo={content.aboutInfo} wilayahInfo={content.wilayahInfo} />
        <ServicesSection services={content.services} />
        <OrganizationSection organization={content.organization} />
        <GallerySection items={content.galleryItems} />
        <NewsSection news={content.newsPosts} />
        <DataSection dataGroups={content.dataGroups} />
        <ContactSection contactInfo={content.contactInfo} />
      </main>
      <Footer quickLinks={quickLinks} />
    </div>
  )
}
