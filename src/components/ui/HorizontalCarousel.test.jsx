import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HorizontalCarousel from './HorizontalCarousel'
import { AudioProvider } from '../../context/AudioContext'
import { LangProvider } from '../../context/LangContext'

function renderCarousel(count) {
  const items = Array.from({ length: count }, (_, i) => (
    <div key={i} data-testid="card">
      {i}
    </div>
  ))
  return render(
    <LangProvider>
      <AudioProvider>
        <HorizontalCarousel>{items}</HorizontalCarousel>
      </AudioProvider>
    </LangProvider>,
  )
}

// Regression coverage for the perf fix in HorizontalCarousel: mounting all
// 64 home-page cards at once was blocking the main thread for ~2s (see
// Lighthouse TBT). It now reveals items in idle-time batches — this locks in
// both halves of that contract: fewer nodes on first paint, everything
// present eventually.
describe('HorizontalCarousel progressive reveal', () => {
  it('does not mount every item synchronously when the list is large', () => {
    renderCarousel(20)
    expect(screen.getAllByTestId('card').length).toBeLessThan(20)
  })

  it('eventually reveals every item', async () => {
    renderCarousel(20)
    await waitFor(
      () => {
        expect(screen.getAllByTestId('card')).toHaveLength(20)
      },
      { timeout: 3000 },
    )
  })

  it('renders everything immediately when the list is smaller than the initial batch', () => {
    renderCarousel(3)
    expect(screen.getAllByTestId('card')).toHaveLength(3)
  })
})
