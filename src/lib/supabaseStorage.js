import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Extracts the storage path from a Supabase public URL.
 * e.g. https://<project>.supabase.co/storage/v1/object/public/portfolio-images/folder/file.png
 *      → { bucket: 'portfolio-images', path: 'folder/file.png' }
 * Returns null if the URL is not a Supabase storage URL.
 */
function parseSupabaseStorageUrl(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const marker = '/storage/v1/object/public/'
    const idx = url.indexOf(marker)
    if (idx === -1) return null
    const after = url.slice(idx + marker.length)
    const slashIdx = after.indexOf('/')
    if (slashIdx === -1) return null
    const bucket = after.slice(0, slashIdx)
    const path = decodeURIComponent(after.slice(slashIdx + 1))
    return { bucket, path }
  } catch {
    return null
  }
}

/**
 * Deletes a single file from Supabase Storage by its public URL.
 * Silently skips external URLs (e.g. Unsplash) that aren't storage URLs.
 */
export async function deleteFromSupabaseStorage(url) {
  if (!isSupabaseConfigured() || !url) return
  const parsed = parseSupabaseStorageUrl(url)
  if (!parsed) return
  try {
    const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path])
    if (error) console.warn(`Storage delete failed (${parsed.bucket}/${parsed.path}):`, error.message)
  } catch (err) {
    console.warn('Storage delete exception:', err.message)
  }
}

/**
 * Deletes multiple files from Supabase Storage given an array of public URLs.
 * Groups by bucket for efficient batch removal. Skips non-storage URLs silently.
 */
export async function deleteFilesFromStorage(urls = []) {
  if (!isSupabaseConfigured() || !urls.length) return
  const byBucket = {}
  for (const url of urls) {
    const parsed = parseSupabaseStorageUrl(url)
    if (!parsed) continue
    if (!byBucket[parsed.bucket]) byBucket[parsed.bucket] = []
    byBucket[parsed.bucket].push(parsed.path)
  }
  for (const [bucket, paths] of Object.entries(byBucket)) {
    try {
      const { error } = await supabase.storage.from(bucket).remove(paths)
      if (error) console.warn(`Batch storage delete failed (${bucket}):`, error.message)
    } catch (err) {
      console.warn('Batch storage delete exception:', err.message)
    }
  }
}

/**
 * Uploads a file to a Supabase storage bucket and returns its public URL.
 * Automatically falls back gracefully if storage is unreachable.
 */
export async function uploadToSupabaseStorage(bucket, file, pathPrefix = '') {
  if (!isSupabaseConfigured() || !file) return null

  try {
    const fileExt = file.name ? file.name.split('.').pop() : 'png'
    const sanitizedName = (file.name || 'file')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    const filePath = `${pathPrefix ? `${pathPrefix}/` : ''}${Date.now()}-${sanitizedName}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.warn(`Supabase Storage upload to ${bucket} error:`, error.message)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (err) {
    console.warn(`Supabase Storage exception (${bucket}):`, err.message)
    return null
  }
}

