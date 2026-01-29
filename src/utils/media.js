const publicBaseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL

export function resolvePublicUrl(value) {
  if (!value) return ""
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }
  if (!publicBaseUrl) return value
  return `${publicBaseUrl.replace(/\/$/, "")}/${value.replace(/^\//, "")}`
}
