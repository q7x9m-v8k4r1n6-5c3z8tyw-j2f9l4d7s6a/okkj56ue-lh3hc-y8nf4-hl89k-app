import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: {
    request: requestMock,
  },
}))

import {
  cancelBoothSession,
  rejectEntryToBooth,
} from './joinRequests.api'

describe('rejectEntryToBooth', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('posts the pending request identifiers to reject-entry', async () => {
    const request = {
      boothId: '22d749f7-da08-404f-8113-529a32a88374',
      teamId: '1b6d04ef-6281-4032-b1ae-969816213641',
    }
    requestMock.mockResolvedValue({
      message: 'Đã từ chối yêu cầu vào trạm.',
    })

    await expect(rejectEntryToBooth(request)).resolves.toEqual({
      message: 'Đã từ chối yêu cầu vào trạm.',
    })
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Booth/reject-entry',
      method: 'POST',
      body: request,
    })
  })

  it('blocks invalid identifiers before sending a request', async () => {
    await expect(rejectEntryToBooth({
      boothId: 'invalid',
      teamId: 'invalid',
    })).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })
})

describe('cancelBoothSession', () => {
  beforeEach(() => {
    requestMock.mockReset()
  })

  it('posts to the occupied booth cancel-session endpoint', async () => {
    const boothId = '22d749f7-da08-404f-8113-529a32a88374'
    requestMock.mockResolvedValue({
      message: 'Đã hủy lượt chơi và giải phóng trạm.',
    })

    await expect(cancelBoothSession({ boothId })).resolves.toEqual({
      message: 'Đã hủy lượt chơi và giải phóng trạm.',
    })
    expect(requestMock).toHaveBeenCalledWith({
      path: `/Booth/${boothId}/cancel-session`,
      method: 'POST',
    })
  })

  it('rejects an invalid booth id before sending a request', async () => {
    await expect(cancelBoothSession({ boothId: 'invalid' })).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid backend response', async () => {
    requestMock.mockResolvedValue({})

    await expect(cancelBoothSession({
      boothId: '22d749f7-da08-404f-8113-529a32a88374',
    })).rejects.toThrow()
  })
})
