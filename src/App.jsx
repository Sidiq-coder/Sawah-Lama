import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicHome from "./pages/PublicHome"
import LoginPage from "./pages/Login"
import NewsList from "./pages/NewsList"
import NewsDetail from "./pages/NewsDetail"
import GalleryList from "./pages/GalleryList"
import ServicesList from "./pages/ServicesList"
import DataPage from "./pages/DataPage"
import WilayahInfo from "./pages/WilayahInfo"
import DashboardLayout from "./pages/dashboard/DashboardLayout"
import SectionPage from "./pages/dashboard/SectionPage"
import AboutPage from "./pages/dashboard/AboutPage"
import NewsPage from "./pages/dashboard/NewsPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicHome />} />
        <Route path="/berita" element={<NewsList />} />
        <Route path="/berita/:slug" element={<NewsDetail />} />
        <Route path="/galeri" element={<GalleryList />} />
        <Route path="/layanan" element={<ServicesList />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/wilayah" element={<WilayahInfo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/tentang" replace />} />
            <Route path="tentang" element={<AboutPage />} />
            <Route path="berita" element={<NewsPage />} />
            <Route path=":sectionKey" element={<SectionPage />} />
          </Route>
        </Route>
        <Route path="*" element={<PublicHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
