import { describe, expect, it } from 'vitest'
import {
  ALLOWED_MAP_IMAGE_TYPES,
  MAX_MAP_FILE_SIZE_BYTES,
  isValidMapImageFile,
  validateDroppedFiles,
} from './buildMap.validation'

describe('buildMap.validation', () => {
  describe('isValidMapImageFile', () => {
    it('returns error when file is null or undefined', () => {
      expect(isValidMapImageFile(null)).toEqual({
        valid: false,
        error: 'Vui lòng chọn tệp tin hình ảnh có dung lượng lớn hơn 0.',
      })
      expect(isValidMapImageFile(undefined)).toEqual({
        valid: false,
        error: 'Vui lòng chọn tệp tin hình ảnh có dung lượng lớn hơn 0.',
      })
    })

    it('returns error when file has 0 bytes', () => {
      const zeroFile = new File([], 'empty.png', { type: 'image/png' })
      expect(isValidMapImageFile(zeroFile)).toEqual({
        valid: false,
        error: 'Vui lòng chọn tệp tin hình ảnh có dung lượng lớn hơn 0.',
      })
    })

    it('returns error when file is not an allowed image format', () => {
      const pdfFile = new File(['%PDF-1.4'], 'document.pdf', {
        type: 'application/pdf',
      })
      expect(isValidMapImageFile(pdfFile)).toEqual({
        valid: false,
        error: 'Chỉ chấp nhận định dạng hình ảnh JPG, PNG hoặc WEBP.',
      })

      const tiffFile = new File(['TIFF'], 'image.tiff', {
        type: 'image/tiff',
      })
      expect(isValidMapImageFile(tiffFile)).toEqual({
        valid: false,
        error: 'Chỉ chấp nhận định dạng hình ảnh JPG, PNG hoặc WEBP.',
      })
    })

    it('returns error when file exceeds 5MB limit', () => {
      // 5MB + 1 byte
      const largeContent = new Uint8Array(MAX_MAP_FILE_SIZE_BYTES + 1)
      const largeFile = new File([largeContent], 'huge-map.png', {
        type: 'image/png',
      })
      expect(isValidMapImageFile(largeFile)).toEqual({
        valid: false,
        error: 'Kích thước ảnh sơ đồ không được vượt quá 5MB.',
      })
    })

    it('accepts valid PNG, JPG, and WEBP files under 5MB', () => {
      const pngFile = new File(['png-data'], 'map.png', { type: 'image/png' })
      expect(isValidMapImageFile(pngFile)).toEqual({ valid: true })

      const jpgFile = new File(['jpg-data'], 'map.jpg', { type: 'image/jpeg' })
      expect(isValidMapImageFile(jpgFile)).toEqual({ valid: true })

      const webpFile = new File(['webp-data'], 'map.webp', { type: 'image/webp' })
      expect(isValidMapImageFile(webpFile)).toEqual({ valid: true })
    })

    it('accepts image with recognized extension even if MIME type is empty', () => {
      const fileWithoutMime = new File(['data'], 'photo.png', { type: '' })
      expect(isValidMapImageFile(fileWithoutMime)).toEqual({ valid: true })
    })
  })

  describe('validateDroppedFiles', () => {
    it('returns error when files array is empty or null', () => {
      expect(validateDroppedFiles([])).toEqual({
        valid: false,
        error: 'Không tìm thấy tệp tin hợp lệ. Vui lòng kéo thả tệp tin hình ảnh.',
      })
      expect(validateDroppedFiles(null)).toEqual({
        valid: false,
        error: 'Không tìm thấy tệp tin hợp lệ. Vui lòng kéo thả tệp tin hình ảnh.',
      })
    })

    it('returns error when multiple files are dropped', () => {
      const file1 = new File(['1'], 'map1.png', { type: 'image/png' })
      const file2 = new File(['2'], 'map2.png', { type: 'image/png' })
      expect(validateDroppedFiles([file1, file2])).toEqual({
        valid: false,
        error: 'Chỉ được chọn 1 tệp ảnh sơ đồ trận đấu.',
      })
    })

    it('returns valid single file when exactly 1 file is passed', () => {
      const file = new File(['map'], 'map.png', { type: 'image/png' })
      expect(validateDroppedFiles([file])).toEqual({
        valid: true,
        file,
      })
    })
  })

  describe('constants', () => {
    it('has 5MB max file size and allowed image types', () => {
      expect(MAX_MAP_FILE_SIZE_BYTES).toBe(5242880)
      expect(ALLOWED_MAP_IMAGE_TYPES.has('image/png')).toBe(true)
      expect(ALLOWED_MAP_IMAGE_TYPES.has('image/jpeg')).toBe(true)
      expect(ALLOWED_MAP_IMAGE_TYPES.has('image/webp')).toBe(true)
    })
  })
})
