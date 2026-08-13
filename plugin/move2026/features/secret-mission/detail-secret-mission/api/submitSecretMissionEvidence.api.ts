import { client } from '@/core/shared/api'

export const submitSecretMissionEvidence = async (
  missionId: string,
  file: File,
  signal?: AbortSignal
): Promise<void> => {
  const formData = new FormData()
  
  // Xác định định dạng để ném vào đúng Property của SubmitMissionEvidenceRequest
  const isVideo = file.type.startsWith('video/')
  formData.append(isVideo ? 'Videos' : 'Images', file)

  await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/evidence`,
    method: 'POST',
    body: formData, // Gửi FormData đi, trình duyệt sẽ tự động thiết lập Content-Type là multipart/form-data
    signal,
  })
}