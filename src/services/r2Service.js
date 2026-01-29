const uploadEndpoint = import.meta.env.VITE_R2_UPLOAD_URL
const publicBaseUrl = import.meta.env.VITE_R2_PUBLIC_BASE_URL

function buildUploadUrl(folder) {
  if (!uploadEndpoint) return null
  if (!folder) return uploadEndpoint
  const url = new URL(uploadEndpoint)
  url.searchParams.set("folder", folder)
  return url.toString()
}

async function uploadToR2(file, { folder } = {}) {
  if (!file) return null
  if (!uploadEndpoint) {
    throw new Error("R2 upload endpoint is not configured. Set VITE_R2_UPLOAD_URL in your env file.")
  }

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(buildUploadUrl(folder), {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file to Cloudflare R2")
  }

  const payload = await response.json()
  if (payload?.url) {
    return payload.url
  }

  if (payload?.key && publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, "")}/${payload.key}`
  }

  throw new Error("Cloudflare R2 upload response is missing a usable URL")
}

export async function uploadImageToR2(file, options = {}) {
  return uploadToR2(file, options)
}

export async function uploadFileToR2(file, options = {}) {
  return uploadToR2(file, options)
}
