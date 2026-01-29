import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"
import {
  heroSlides as heroSlidesFallback,
  featureCards as featureCardsFallback,
  aboutInfo as aboutInfoFallback,
  wilayahInfo as wilayahInfoFallback,
  services as servicesFallback,
  organization as organizationFallback,
  galleryItems as galleryItemsFallback,
  dataGroups as dataGroupsFallback,
  contactInfo as contactInfoFallback,
  quickLinks as quickLinksFallback,
  newsPosts as newsPostsFallback,
} from "../data/siteData"

const fallbackContent = {
  heroSlides: heroSlidesFallback,
  featureCards: featureCardsFallback,
  aboutInfo: aboutInfoFallback,
  wilayahInfo: wilayahInfoFallback,
  services: servicesFallback,
  organization: organizationFallback,
  galleryItems: galleryItemsFallback,
  dataGroups: dataGroupsFallback,
  contactInfo: contactInfoFallback,
  quickLinks: quickLinksFallback,
  newsPosts: newsPostsFallback,
}

async function fetchOrdered(table, fallback, { orderBy = "sort_order", ascending = true } = {}) {
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

async function fetchSingle(table, fallback, { orderBy = "updated_at", ascending = false } = {}) {
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
    throw error
  }
  return data || []
}

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi.")
  }
}

export async function fetchPublicContent() {
  if (!isSupabaseConfigured || !supabase) {
    return fallbackContent
  }

  try {
    const [
      heroSlides,
      featureCards,
      aboutInfo,
      wilayahInfo,
      services,
      organization,
      galleryItems,
      dataGroups,
      contactInfo,
      newsPosts,
    ] = await Promise.all([
      fetchOrdered("hero_slides", heroSlidesFallback),
      fetchOrdered("feature_cards", featureCardsFallback),
      fetchSingle("about_info", aboutInfoFallback),
      fetchOrdered("wilayah_stats", wilayahInfoFallback),
      fetchOrdered("services", servicesFallback),
      fetchOrdered("organization_members", organizationFallback),
      fetchOrdered("gallery_items", galleryItemsFallback),
      fetchOrdered("data_groups", dataGroupsFallback),
      fetchOrdered("contact_info", contactInfoFallback),
      fetchNewsPosts(),
    ])

    return {
      heroSlides,
      featureCards,
      aboutInfo,
      wilayahInfo,
      services,
      organization,
      galleryItems,
      dataGroups,
      contactInfo,
      quickLinks: quickLinksFallback,
      newsPosts,
    }
  } catch (error) {
    console.error("Failed to load Supabase content:", error)
    return fallbackContent
  }
}

export async function fetchNewsPosts(limit = 8) {
  if (!isSupabaseConfigured || !supabase) {
    return newsPostsFallback.slice(0, limit)
  }

  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Supabase error (news_posts):", error.message)
    return newsPostsFallback.slice(0, limit)
  }

  return data?.length ? data : newsPostsFallback.slice(0, limit)
}

export async function fetchDashboardContent() {
  ensureSupabase()
  const [
    heroSlides,
    featureCards,
    aboutInfo,
    wilayahInfo,
    services,
    organization,
    galleryItems,
    dataGroups,
    contactInfo,
    newsPosts,
  ] = await Promise.all([
    fetchOrderedRaw("hero_slides"),
    fetchOrderedRaw("feature_cards"),
    fetchSingle("about_info", {}),
    fetchOrderedRaw("wilayah_stats"),
    fetchOrderedRaw("services"),
    fetchOrderedRaw("organization_members"),
    fetchOrderedRaw("gallery_items"),
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
    services,
    organization,
    galleryItems,
    dataGroups,
    contactInfo,
    newsPosts,
  }
}
