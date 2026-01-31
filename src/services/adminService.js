import { supabase, isSupabaseConfigured } from "../lib/supabaseClient"

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi variabel lingkungan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.")
  }
}

async function handleResponse(promise) {
  const { data, error } = await promise
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function createRecord(table, payload) {
  ensureSupabase()
  const data = await handleResponse(supabase.from(table).insert(payload).select().single())
  return data
}

export async function updateRecord(table, id, payload) {
  ensureSupabase()
  const data = await handleResponse(
    supabase.from(table).update(payload).eq("id", id).select().single(),
  )
  return data
}

export async function deleteRecord(table, id) {
  ensureSupabase()
  await handleResponse(supabase.from(table).delete().eq("id", id))
}

export async function saveAboutInfo(payload) {
  ensureSupabase()
  const data = await handleResponse(
    supabase
      .from("about_info")
      .upsert({ id: 1, ...payload, updated_at: new Date().toISOString() })
      .select()
      .single(),
  )
  return data
}

export async function saveWilayahMap(payload) {
  ensureSupabase()
  const data = await handleResponse(
    supabase
      .from("wilayah_map")
      .upsert({ id: 1, ...payload, updated_at: new Date().toISOString() })
      .select()
      .single(),
  )
  return data
}

export async function saveNewsPost(payload) {
  ensureSupabase()
  const base = {
    ...payload,
  }

  if (base.is_published && !base.published_at) {
    base.published_at = new Date().toISOString()
  }

  if (base.id) {
    const { id, ...rest } = base
    return updateRecord("news_posts", id, rest)
  }

  return createRecord("news_posts", base)
}
