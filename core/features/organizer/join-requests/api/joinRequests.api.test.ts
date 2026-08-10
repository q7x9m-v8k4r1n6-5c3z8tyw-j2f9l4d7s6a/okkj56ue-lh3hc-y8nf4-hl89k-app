import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: {
    request: requestMock,
  },
}))

import { cancelBoothSession } from './joinRequests.api'

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
