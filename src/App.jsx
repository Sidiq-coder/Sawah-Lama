import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import InfoCards from "./components/InfoCards"
import AboutSection from "./components/AboutSection"
import ServicesSection from "./components/ServicesSection"
import OrganizationSection from "./components/OrganizationSection"
import GallerySection from "./components/GallerySection"
import DataSection from "./components/DataSection"
import ContactSection from "./components/ContactSection"
import Footer from "./components/Footer"

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <InfoCards />
        <AboutSection />
        <ServicesSection />
        <OrganizationSection />
        <GallerySection />
        <DataSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
