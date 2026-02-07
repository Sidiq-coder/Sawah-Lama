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

const PREVIEW_LIMIT = 3

function sortNewest(items = []) {
  return [...items].sort((a, b) => {
    const timeA = getTimestamp(a?.created_at ?? a?.createdAt)
    const timeB = getTimestamp(b?.created_at ?? b?.createdAt)
    if (timeA !== timeB) {
      return timeB - timeA
    }
    const orderA = Number.isFinite(a?.sort_order) ? a.sort_order : Number(a?.sortOrder) || 0
    const orderB = Number.isFinite(b?.sort_order) ? b.sort_order : Number(b?.sortOrder) || 0
    return orderA - orderB
  })
}

function getTimestamp(value) {
  if (!value) return 0
  const parsed = new Date(value).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

const emptyContent = {
  heroSlides: [],
  featureCards: [],
  aboutInfo: null,
  wilayahInfo: [],
  wilayahMap: null,
  services: [],
  organizationPositions: [],
  organization: [],
  galleryItems: [],
  dataGroups: [],
  contactInfo: [],
  newsPosts: [],
}

export default function PublicHome() {
  const { data, isLoading } = usePublicContent()
  const content = data || emptyContent
  const latestGalleryItems = sortNewest(content.galleryItems).slice(0, PREVIEW_LIMIT)
  const latestNewsPosts = sortNewest(content.newsPosts).slice(0, PREVIEW_LIMIT)

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
        <OrganizationSection organization={content.organization} positions={content.organizationPositions} />
        <GallerySection items={latestGalleryItems} />
        <NewsSection news={latestNewsPosts} />
        <DataSection dataGroups={content.dataGroups} />
        <ContactSection contactInfo={content.contactInfo} />
      </main>
      <Footer quickLinks={quickLinks} />
    </div>
  )
}
