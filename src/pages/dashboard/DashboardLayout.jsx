import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "../../lib/supabaseClient"
import { dashboardSections, sidebarGroups } from "./sectionsConfig"

export default function DashboardLayout() {
  const location = useLocation()
  const queryClient = useQueryClient()

  const handleSignOut = async () => {
    await supabase?.auth?.signOut()
    await queryClient.invalidateQueries({ queryKey: ["dashboard-content"] })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-section flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Dashboard</p>
            <h1 className="text-xl font-semibold text-slate-900">Kelurahan Sawah Lama</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Lihat Situs
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="container-section grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="space-y-6">
            {sidebarGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {group.title}
                </p>
                <nav className="mt-3 space-y-2">
                  {group.keys.map((key) => {
                    const item = dashboardSections.find((section) => section.key === key)
                    if (!item) return null
                    return (
                      <NavLink
                        key={item.key}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center justify-between rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? "bg-brand-50 text-brand-700"
                              : "text-slate-600 hover:bg-slate-50"
                          }`
                        }
                      >
                        <span>{item.label}</span>
                        {location.pathname === item.path ? (
                          <span className="text-xs text-brand-500">●</span>
                        ) : null}
                      </NavLink>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
