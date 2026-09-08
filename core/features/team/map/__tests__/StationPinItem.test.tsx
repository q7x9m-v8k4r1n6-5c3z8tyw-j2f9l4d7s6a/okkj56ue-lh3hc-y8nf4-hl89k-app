import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { StationPinItem } from '../ui/components/StationPinItem'
import type { StationPin } from '../model/teamMap.types'

describe('StationPinItem', () => {
  const freePin: StationPin = {
    id: 'station-free-1',
    name: 'Trạm Rảnh 1',
    place: 'Khu A',
    description: 'Thử thách rảnh',
    x: 25,
    y: 40,
    status: 'free',
  }

  const occupiedPin: StationPin = {
    id: 'station-occupied-1',
    name: 'Trạm Bận 1',
    place: 'Khu B',
    description: 'Thử thách bận',
    x: 65,
    y: 80,
    status: 'occupied',
  }

  it('renders green text-[#168944] when status is free', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('text-[#168944]')
    expect(html).not.toContain('text-[#de3336]')
    expect(html).not.toContain('text-[#166534]')
    expect(html).not.toContain('text-[#9ca3af]')
  })

  it('renders red text-[#de3336] when status is occupied', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={occupiedPin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('text-[#de3336]')
    expect(html).not.toContain('text-[#168944]')
    expect(html).not.toContain('text-[#166534]')
    expect(html).not.toContain('text-[#9ca3af]')
  })

  it('renders station name in pill badge below pin tip, horizontally centered', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('Trạm Rảnh 1')
    expect(html).toContain('absolute top-full left-1/2 -translate-x-1/2')
    expect(html).toContain('rounded-full bg-black/80')
  })

  it('renders positioning styles corresponding to x and y coordinates', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('left:25%')
    expect(html).toContain('top:40%')
  })

  it('renders selected styling when isSelected is true', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={true} onClick={() => {}} />,
    )

    expect(html).toContain('scale-125')
  })

  it('triggers onClick callback with pin id', () => {
    const onClick = vi.fn()
    const element = StationPinItem({
      pin: freePin,
      isSelected: false,
      onClick,
    })

    const mockEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent

    element.props.onClick(mockEvent)

    expect(mockEvent.stopPropagation).toHaveBeenCalled()
    expect(onClick).toHaveBeenCalledWith('station-free-1')
  })

  it('omits station name pill badge when pin.name is empty or whitespace', () => {
    const emptyNamePin: StationPin = {
      ...freePin,
      name: '   ',
    }
    const html = renderToStaticMarkup(
      <StationPinItem pin={emptyNamePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).not.toContain('rounded-full bg-black/80')
    expect(html).toContain('aria-label="Trạm thử thách"')
  })

  it('applies max-w-[200px] and truncate classes to pill badge', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('max-w-[200px]')
    expect(html).toContain('truncate')
  })

  it('keeps pill badge interactive and accessible with aria-hidden and no pointer-events-none', () => {
    const html = renderToStaticMarkup(
      <StationPinItem pin={freePin} isSelected={false} onClick={() => {}} />,
    )

    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('cursor-pointer')
    expect(html).not.toContain('pointer-events-none')
  })
})
