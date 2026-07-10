const TEMP_USER = {
  id: 'temp-admin',
  name: 'Nguyễn Văn A',
  email: 'admin@university.edu',
  role: 'Ban Tổ chức',
} as const

export const getCurrentUser = async () => TEMP_USER
