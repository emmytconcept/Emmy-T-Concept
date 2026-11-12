/**
 * Client-Side Image Compression Utility
 * Compresses images before uploading to Supabase Storage.
 * Reduces 5MB-15MB camera photos down to ~150KB-350KB while preserving crisp details.
 */

export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    outputType = 'image/jpeg',
  } = options

  // If it's not an image file (e.g. PDF documents in quotes), pass through untouched
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file
  }

  // If image is already tiny (< 120KB), keep as is
  if (file.size && file.size < 120 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Fill white background for transparent PNGs converted to JPEG
        if (outputType === 'image/jpeg') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }

            const cleanName = (file.name || 'image.jpg').replace(/\.[^/.]+$/, '.jpg')
            const compressedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            })

            resolve(compressedFile)
          },
          outputType,
          quality
        )
      }

      img.onerror = () => resolve(file)
      img.src = e.target.result
    }

    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

