import React, { useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, X, Plus, Loader2 } from 'lucide-react'
import { compressImage } from '../../lib/imageCompressor'
import { uploadToSupabaseStorage } from '../../lib/supabaseStorage'

/**
 * ImageDropzone
 * Reusable Drag-and-Drop + Tap-to-select image uploader.
 * Automatically compresses large images client-side before uploading directly to Supabase Storage.
 *
 * Props:
 * - multiple: boolean (default false)
 * - value: string (if multiple=false) or array of strings (if multiple=true)
 * - onChange: (newVal) => void
 * - label: string
 * - helperText: string
 * - bucket: string (default 'portfolio-images')
 */
export default function ImageDropzone({
  multiple = false,
  value,
  onChange,
  label = 'Upload Image',
  helperText = 'Auto-compressed & stored on Supabase',
  bucket = 'portfolio-images',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return

    const fileList = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (fileList.length === 0) return
    setIsUploading(true)

    try {
      if (!multiple) {
        // 1. Compress image to max 1920px & ~82% quality
        const compressed = await compressImage(fileList[0], {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.82,
        })

        // 2. Upload to Supabase Storage
        const publicUrl = await uploadToSupabaseStorage(bucket, compressed, 'uploads')

        if (publicUrl) {
          onChange(publicUrl)
        } else {
          // Fallback to data URL if offline
          const reader = new FileReader()
          reader.onload = (e) => onChange(e.target.result)
          reader.readAsDataURL(compressed)
        }
      } else {
        // Multiple files mode
        const currentList = Array.isArray(value) ? [...value] : []

        for (const file of fileList) {
          const compressed = await compressImage(file, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.82,
          })

          const publicUrl = await uploadToSupabaseStorage(bucket, compressed, 'uploads')
          if (publicUrl) {
            currentList.push(publicUrl)
          } else {
            const dataUrl = await new Promise((res) => {
              const reader = new FileReader()
              reader.onload = (e) => res(e.target.result)
              reader.readAsDataURL(compressed)
            })
            currentList.push(dataUrl)
          }
        }

        onChange(currentList)
      }
    } catch (err) {
      console.warn('ImageDropzone upload error:', err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveSingle = (e) => {
    e.stopPropagation()
    onChange('')
  }

  const handleRemoveMulti = (index, e) => {
    e.stopPropagation()
    if (Array.isArray(value)) {
      const updated = value.filter((_, i) => i !== index)
      onChange(updated)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <label className="text-[#8e9196] font-medium">{label}</label>
          {helperText && <span className="text-[10px] text-[#d9a323]">{helperText}</span>}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Uploading state banner */}
      {isUploading && (
        <div className="p-3 rounded-xl bg-[#d9a323]/10 border border-[#d9a323]/30 flex items-center justify-center gap-2 text-xs text-[#d9a323] font-medium">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Compressing & uploading to Supabase Storage...</span>
        </div>
      )}

      {/* Single Image Mode */}
      {!multiple && !isUploading && (
        <div>
          {value ? (
            <div className="relative group rounded-xl overflow-hidden border border-[#d9a323]/40 bg-neutral-900 aspect-video max-h-52 flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />

              {/* Always-visible quick delete button for touch/mobile devices */}
              <button
                type="button"
                onClick={handleRemoveSingle}
                className="sm:hidden absolute top-2 right-2 z-10 p-2 rounded-full bg-red-600/90 text-white shadow-lg active:scale-90"
                aria-label="Remove image"
                title="Remove Image"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Desktop hover overlay (also active on focus) */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#d9a323] text-black text-[11px] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSingle}
                  className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors active:scale-95"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#d9a323] bg-[#d9a323]/10 scale-[1.01]'
                  : 'border-white/15 hover:border-[#d9a323]/50 bg-[#111111]/60 hover:bg-[#111111]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d9a323]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Tap to browse or drag & drop photo here
                </p>
                <p className="text-[11px] text-[#8e9196] mt-0.5">
                  Auto-compressed before storing on Supabase
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multiple Images Mode */}
      {multiple && !isUploading && (
        <div className="space-y-3">
          {/* Thumbnails grid */}
          {Array.isArray(value) && value.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {value.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-white/20 bg-neutral-900"
                >
                  <img
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Always-visible delete button on mobile/touch screens */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveMulti(idx, e)}
                    className="sm:hidden absolute top-1 right-1 z-10 p-1.5 rounded-full bg-red-600/95 text-white shadow-md active:scale-90"
                    aria-label={`Remove image ${idx + 1}`}
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  {/* Desktop hover overlay */}
                  <div className="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveMulti(idx, e)}
                      className="p-1.5 rounded-full bg-red-500 text-white hover:scale-110 active:scale-95 transition-transform shadow"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-[#d9a323]">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Dropzone trigger */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1.5 ${
              isDragging
                ? 'border-[#d9a323] bg-[#d9a323]/10 scale-[1.01]'
                : 'border-white/15 hover:border-[#d9a323]/50 bg-[#111111]/60 hover:bg-[#111111]'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#d9a323]">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Tap to select or drag & drop project images
              </p>
              <p className="text-[11px] text-[#8e9196]">
                Upload multiple angles; compressed & saved to Supabase
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
