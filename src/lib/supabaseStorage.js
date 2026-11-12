import { supabase, isSupabaseConfigured } from './supabase'

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

