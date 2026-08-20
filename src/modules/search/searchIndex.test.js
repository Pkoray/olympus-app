import { describe, expect, it } from 'vitest'
import { searchEntities, SEARCH_INDEX } from './searchIndex'

describe('searchEntities', () => {
  it('returns nothing for an empty query', () => {
    expect(searchEntities('', 'en')).toEqual([])
    expect(searchEntities('   ', 'en')).toEqual([])
  })

  it('finds a known character by English name, case-insensitively', () => {
    const results = searchEntities('zeus', 'en')
    expect(results.some((r) => r.id === 'zeus')).toBe(true)
  })

  it('finds a known character by Turkish name', () => {
    const zeus = SEARCH_INDEX.find((i) => i.id === 'zeus')
    const results = searchEntities(zeus.nameTr, 'tr')
    expect(results.some((r) => r.id === 'zeus')).toBe(true)
  })

  it('ranks names that start with the query above names that merely contain it', () => {
    const results = searchEntities('at', 'en')
    const firstMatchIndex = results.findIndex((r) => r.nameEn.toLowerCase().startsWith('at'))
    const laterOnlyContainsIndex = results.findIndex((r) => !r.nameEn.toLowerCase().startsWith('at'))
    if (firstMatchIndex !== -1 && laterOnlyContainsIndex !== -1) {
      expect(firstMatchIndex).toBeLessThan(laterOnlyContainsIndex)
    }
  })

  it('returns an empty array for a query that matches nothing', () => {
    expect(searchEntities('xyznonexistent', 'en')).toEqual([])
  })

  it('caps results at 40', () => {
    // A single common letter matches broadly across the index.
    const results = searchEntities('a', 'en')
    expect(results.length).toBeLessThanOrEqual(40)
  })
})
