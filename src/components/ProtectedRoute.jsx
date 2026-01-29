import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const allowedEmail = (import.meta.env.VITE_DASHBOARD_ALLOWED_EMAIL || "").toLowerCase().trim()

export default function ProtectedRoute() {
  const { session, user, loading, isConfigured } = useAuth()

  if (!isConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-soft">
          <p className="text-lg font-semibold text-slate-900">Supabase belum siap</p>
          <p className="text-sm text-slate-600">
            Konfigurasi variabel lingkungan Supabase untuk mengaktifkan dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (allowedEmail && user?.email?.toLowerCase() !== allowedEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md space-y-4 rounded-2xl bg-white p-8 shadow-soft">
          <p className="text-lg font-semibold text-slate-900">Akses ditolak</p>
          <p className="text-sm text-slate-600">
            Akun ini tidak memiliki izin untuk membuka dashboard. Gunakan email yang terdaftar.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
