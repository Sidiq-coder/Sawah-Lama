import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"

const emptyContent = {
  heroSlides: [],
  featureCards: [],
  aboutInfo: null,
  wilayahInfo: [],
  wilayahMap: null,
  services: [],
  organization: [],
  galleryItems: [],
  galleryMedia: [],
  serviceMedia: [],
  dataGroups: [],
  contactInfo: [],
  newsPosts: [],
}

async function fetchOrdered(table, fallback = [], { orderBy = "sort_order", ascending = true } = {}) {
  if (!isSupabaseConfigured || !supabase) return fallback

  const query = supabase.from(table).select("*")
  if (orderBy) {
    query.order(orderBy, { ascending })
  }

  const { data, error } = await query
  if (error) {
    console.error(`Supabase error (${table}):`, error.message)
    return fallback
  }

  return data?.length ? data : fallback
}

async function fetchSingle(table, fallback = null, { orderBy = "updated_at", ascending = false } = {}) {
  if (!isSupabaseConfigured || !supabase) return fallback
  const query = supabase.from(table).select("*").limit(1)
  if (orderBy) {
    query.order(orderBy, { ascending })
  }
  const { data, error } = await query.maybeSingle()
  if (error) {
    console.error(`Supabase error (${table}):`, error.message)
    return fallback
  }
  return data || fallback
}

async function fetchOrderedRaw(table, { orderBy = "sort_order", ascending = true } = {}) {
  ensureSupabase()
  const query = supabase.from(table).select("*")
  if (orderBy) {
    query.order(orderBy, { ascending })
  }
  const { data, error } = await query
  if (error) {
    const missingTable = error.code === "42P01"
    if (missingTable) {
      console.warn(`Tabel ${table} belum tersedia. Jalankan migrasi Supabase terbaru agar data muncul.`)
      return []
    }
    throw error
  }
  return data || []
}

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.")
  }
}

async function fetchGalleryCollections() {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, media:gallery_media(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "gallery_media" })

  if (!error) {
    return (
      data?.map((item) => ({
        ...item,
        media: item.media?.map((mediaItem) => ({ ...mediaItem })) || [],
      })) || []
    )
  }

  const relationMissing = error?.code === "42P01" || /gallery_media/.test(error?.message || "")
  console.warn(
    relationMissing
      ? "Tabel gallery_media belum tersedia, menggunakan data galeri dasar sebagai fallback."
      : `Supabase error (gallery_items): ${error.message}`
  )

  const fallbackItems = await fetchOrdered("gallery_items")
  return fallbackItems.map((item) => ({
    ...item,
    media: Array.isArray(item.media) ? item.media : [],
  }))
}

async function fetchServiceCollections() {
  if (!isSupabaseConfigured || !supabase) return []

  const { data, error } = await supabase
    .from("services")
    .select("*, media:service_media(*)")
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, foreignTable: "service_media" })

  if (!error) {
    return (
      data?.map((item) => ({
        ...item,
        media: item.media?.map((entry) => ({ ...entry })) || [],
      })) || []
    )
  }

  const relationMissing = error?.code === "42P01" || /service_media/.test(error?.message || "")
  console.warn(
    relationMissing
      ? "Tabel service_media belum tersedia, menggunakan data layanan dasar sebagai fallback."
      : `Supabase error (services): ${error.message}`,
  )

  const fallbackItems = await fetchOrdered("services")
  return fallbackItems.map((item) => ({
    ...item,
    media: Array.isArray(item.media) ? item.media : [],
  }))
}

export async function fetchPublicContent() {
  if (!isSupabaseConfigured || !supabase) {
    return emptyContent
  }

  try {
    const [
      heroSlides,
      featureCards,
      aboutInfo,
      wilayahInfo,
      wilayahMap,
      services,
      organization,
      galleryItems,
      dataGroups,
      contactInfo,
      newsPosts,
    ] = await Promise.all([
      fetchOrdered("hero_slides"),
      fetchOrdered("feature_cards"),
      fetchSingle("about_info"),
      fetchOrdered("wilayah_stats"),
      fetchSingle("wilayah_map"),
      fetchServiceCollections(),
      fetchOrdered("organization_members"),
      fetchGalleryCollections(),
      fetchOrdered("data_groups"),
      fetchOrdered("contact_info"),
      fetchNewsPosts(),
    ])

    return {
      heroSlides,
      featureCards,
      aboutInfo,
      wilayahInfo,
      wilayahMap,
      services,
      organization,
      galleryItems,
      dataGroups,
      contactInfo,
      newsPosts,
    }
  } catch (error) {
    console.error("Failed to load Supabase content:", error)
    return emptyContent
  }
}

export async function fetchNewsPosts(limit = 8) {
  if (!isSupabaseConfigured || !supabase) {
    return []
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Supabase error (news_posts):", error.message)
    return []
  }

  return data?.length ? data : []
}

export async function fetchDashboardContent() {
  ensureSupabase()
  const [
    heroSlides,
    featureCards,
    aboutInfo,
    wilayahInfo,
    wilayahMap,
    services,
    organization,
    galleryItems,
    galleryMedia,
    serviceMedia,
    dataGroups,
    contactInfo,
    newsPosts,
  ] = await Promise.all([
    fetchOrderedRaw("hero_slides"),
    fetchOrderedRaw("feature_cards"),
    fetchSingle("about_info", {}),
    fetchOrderedRaw("wilayah_stats"),
    fetchSingle("wilayah_map", {}),
    fetchOrderedRaw("services"),
    fetchOrderedRaw("organization_members"),
    fetchOrderedRaw("gallery_items"),
    fetchOrderedRaw("gallery_media"),
    fetchOrderedRaw("service_media"),
    fetchOrderedRaw("data_groups"),
    fetchOrderedRaw("contact_info"),
    supabase
      .from("news_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) throw error
        return data || []
      }),
  ])

  return {
    heroSlides,
    featureCards,
    aboutInfo,
    wilayahInfo,
    wilayahMap,
    services,
    organization,
    galleryItems,
    galleryMedia,
    serviceMedia,
    dataGroups,
    contactInfo,
    newsPosts,
  }
}
