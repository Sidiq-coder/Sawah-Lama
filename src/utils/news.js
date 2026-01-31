export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function buildNewsPath(item) {
  if (item?.slug) {
    return `/berita/${item.slug}`
  }
  if (item?.id) {
    return `/berita/${item.id}`
  }
  const fallbackSlug = slugify(item?.title || "")
  return fallbackSlug ? `/berita/${fallbackSlug}` : "/berita"
}

export function matchesNewsIdentifier(item, identifier = "") {
  if (!item) return false
  const normalizedIdentifier = identifier?.toString?.() || ""
  if (!normalizedIdentifier) return false

  if (item.slug && item.slug === normalizedIdentifier) {
    return true
  }

  if (item.id && item.id.toString() === normalizedIdentifier) {
    return true
  }

  const derivedSlug = slugify(item.title || "")
  return derivedSlug ? derivedSlug === normalizedIdentifier : false
}
