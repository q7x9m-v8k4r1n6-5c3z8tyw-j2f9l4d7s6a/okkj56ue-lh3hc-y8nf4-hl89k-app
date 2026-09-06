/**
 * Validation rules and limits for race map files.
 * Aligns with backend ImageFileValidator (5MB limit and JPEG/PNG/WEBP whitelist).
 */

export const MAX_MAP_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export const ALLOWED_MAP_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

export type ValidationResult = {
  valid: boolean
  error?: string
}

/**
 * Validates whether a file meets race map image upload criteria.
 */
export const isValidMapImageFile = (file?: File | null): ValidationResult => {
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: 'Vui lòng chọn tệp tin hình ảnh có dung lượng lớn hơn 0.',
    }
  }

  const isAllowedMime = ALLOWED_MAP_IMAGE_TYPES.has(file.type)
  const isAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name)

  if (!isAllowedMime && !isAllowedExt) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận định dạng hình ảnh JPG, PNG hoặc WEBP.',
    }
  }

  if (file.size > MAX_MAP_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Kích thước ảnh sơ đồ không được vượt quá 5MB.',
    }
  }

  return { valid: true }
}

export type DroppedFilesResult = {
  valid: boolean
  file?: File
  error?: string
}

/**
 * Validates dropped or selected file collections from drag-and-drop or file pickers.
 */
export const validateDroppedFiles = (
  files?: FileList | File[] | null,
): DroppedFilesResult => {
  if (!files || files.length === 0) {
    return {
      valid: false,
      error: 'Không tìm thấy tệp tin hợp lệ. Vui lòng kéo thả tệp tin hình ảnh.',
    }
  }

  if (files.length > 1) {
    return {
      valid: false,
      error: 'Chỉ được chọn 1 tệp ảnh sơ đồ trận đấu.',
    }
  }

  const file = files[0]
  return { valid: true, file }
}
