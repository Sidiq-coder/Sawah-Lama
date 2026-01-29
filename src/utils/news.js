export function slugify(value = "") {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function buildNewsPath(item) {
  const slug = item?.slug || slugify(item?.title || "")
  const identifier = slug || item?.id || ""
  return identifier ? `/berita/${identifier}` : "/berita"
}
