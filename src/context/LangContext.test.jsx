import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LangProvider, useLang } from './LangContext'

function Probe() {
  const { lang, toggleLang, t } = useLang()
  return (
    <div>
      <p data-testid="brand">{t('brand.title')}</p>
      <p data-testid="lang">{lang}</p>
      <button onClick={toggleLang}>toggle</button>
    </div>
  )
}

describe('LangContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to English when nothing is stored', () => {
    render(
      <LangProvider>
        <Probe />
      </LangProvider>,
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('restores a previously persisted language', () => {
    localStorage.setItem('olympus-lang', 'tr')
    render(
      <LangProvider>
        <Probe />
      </LangProvider>,
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('tr')
  })

  it('toggles the language and re-renders translated text', async () => {
    const user = userEvent.setup()
    render(
      <LangProvider>
        <Probe />
      </LangProvider>,
    )
    expect(screen.getByTestId('brand')).toHaveTextContent('OLYMPUS')
    await user.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('lang')).toHaveTextContent('tr')
    expect(localStorage.getItem('olympus-lang')).toBe('tr')
    expect(screen.getByTestId('brand')).toHaveTextContent('OLYMPOS')
  })

  it('falls back to the key itself for an unknown translation', () => {
    function MissingKeyProbe() {
      const { t } = useLang()
      return <p>{t('this.key.does.not.exist')}</p>
    }
    render(
      <LangProvider>
        <MissingKeyProbe />
      </LangProvider>,
    )
    expect(screen.getByText('this.key.does.not.exist')).toBeInTheDocument()
  })
})
