import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestMock } = vi.hoisted(() => ({
  requestMock: vi.fn(),
}))

vi.mock('@/core/shared/api', () => ({
  client: { request: requestMock },
}))

import { submitScanQr } from './scanQr.api'

const boothId = 'ee0fd25b-e9b5-42ba-9e25-187fe5c471ea'

describe('submitScanQr', () => {
  beforeEach(() => requestMock.mockReset())

  it('sends only the booth id because the backend resolves the team from JWT', async () => {
    requestMock.mockResolvedValue({ message: 'Đã gửi yêu cầu vào trạm.' })

    await expect(submitScanQr({ boothId })).resolves.toEqual({
      message: 'Đã gửi yêu cầu vào trạm.',
    })
    expect(requestMock).toHaveBeenCalledWith({
      path: '/Booth/entry',
      method: 'POST',
      body: { boothId },
    })
  })

  it('blocks an invalid booth id before sending the request', async () => {
    await expect(submitScanQr({ boothId: 'invalid' })).rejects.toThrow()
    expect(requestMock).not.toHaveBeenCalled()
  })
})
