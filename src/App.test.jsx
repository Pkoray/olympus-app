import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

function renderAppAt(path) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('App routing', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('renders the home page at /', async () => {
    renderAppAt('/')
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the pantheon page at /pantheon', async () => {
    renderAppAt('/pantheon')
    expect(await screen.findByRole('heading', { name: 'Pantheon', level: 1 })).toBeInTheDocument()
  })

  it('renders NotFound for an unknown route', async () => {
    renderAppAt('/this-route-does-not-exist')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })

  it('navigates client-side when a nav link is clicked, without a full reload', async () => {
    const user = userEvent.setup()
    renderAppAt('/')
    const pantheonLinks = await screen.findAllByRole('link', { name: 'Pantheon' })
    await user.click(pantheonLinks[0])
    expect(await screen.findByRole('heading', { name: 'Pantheon', level: 1 })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/pantheon')
  })
})
