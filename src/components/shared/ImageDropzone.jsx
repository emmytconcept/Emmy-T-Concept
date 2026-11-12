import React, { useRef, useState } from 'react'
import { UploadCloud, Image as ImageIcon, X, Plus } from 'lucide-react'

/**
 * ImageDropzone
 * Reusable Drag-and-Drop + Tap-to-select image uploader.
 * Converts selected files to Data URLs (base64) so they persist in state & local storage.
 *
 * Props:
 * - multiple: boolean (default false)
 * - value: string (if multiple=false) or array of strings (if multiple=true)
 * - onChange: (newVal) => void
 * - label: string
 * - helperText: string
 */
export default function ImageDropzone({
  multiple = false,
  value,
  onChange,
  label = 'Upload Image',
  helperText = 'PNG, JPG, WEBP up to 5MB',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (files) => {
    if (!files || files.length === 0) return

    const fileList = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    )

    if (fileList.length === 0) return

    if (!multiple) {
      // Single file mode
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target.result)
      }
      reader.readAsDataURL(fileList[0])
    } else {
      // Multiple files mode
      const currentList = Array.isArray(value) ? [...value] : []
      let pendingCount = fileList.length

      fileList.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          currentList.push(e.target.result)
          pendingCount -= 1
          if (pendingCount === 0) {
            onChange(currentList)
          }
        }
        reader.readAsDataURL(file)
      })
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

      {/* Single Image Mode */}
      {!multiple && (
        <div>
          {value ? (
            <div className="relative group rounded-xl overflow-hidden border border-[#d9a323]/40 bg-neutral-900 aspect-video max-h-52 flex items-center justify-center">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#d9a323] text-black text-[11px] font-bold uppercase tracking-wider hover:brightness-110"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSingle}
                  className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
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
                  High-resolution photo for printing preview
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Multiple Images Mode */}
      {multiple && (
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
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveMulti(idx, e)}
                      className="p-1 rounded-full bg-red-500 text-white hover:scale-110 transition-transform shadow"
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
                Upload multiple angles, closeups & finished prints
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

