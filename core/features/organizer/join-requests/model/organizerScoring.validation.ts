/**
 * Kiểm tra tính hợp lệ của điểm số 
 */
export const validateScore = (score: number | string | null): string | null => {
  // 1. Kiểm tra xem người dùng đã chọn nút điểm nào chưa
  if (score === null || score === '' || (typeof score === 'string' && !score.trim())) {
    return 'Vui lòng chọn hoặc nhập mức điểm cho đội'
  }

  const numericScore = Number(score)

  // 2. Kiểm tra dữ liệu chuyển đổi có phải là số hợp lệ không
  if (Number.isNaN(numericScore)) {
    return 'Điểm số phải là chữ số'
  }

  // 3. Kiểm tra thang điểm nằm trong khoảng cho phép (0 - 100)
  if (numericScore < 0 || numericScore > 100) {
    return 'Điểm số phải nằm trong khoảng 0 - 100'
  }

  return null // Hợp lệ 
}