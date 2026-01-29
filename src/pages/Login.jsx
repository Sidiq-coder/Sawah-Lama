import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [formState, setFormState] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-soft">
          <p className="text-lg font-semibold text-slate-900">Supabase belum dikonfigurasi</p>
          <p className="text-sm text-slate-600">
            Tambahkan kredensial Supabase pada file .env untuk mengaktifkan halaman login.
          </p>
        </div>
      </div>
    )
  }

  if (!loading && session) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      const { error: authError } = await supabase.auth.signInWithPassword(formState)
      if (authError) {
        throw authError
      }
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Gagal masuk, coba lagi.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Dashboard</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Masuk ke Admin Panel</h1>
          <p className="mt-2 text-sm text-slate-500">Gunakan akun resmi kelurahan.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="admin@sawahlama.id"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Kata sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  )
}
