import { CHARACTERS, REGIONS } from '../../data/characters'
import { RELICS } from '../vault/relicsData'
import { ETYMOLOGY } from '../etymology/etymologyData'

// Flat, unified index across every searchable entity in the app — built once
// at module load (all three source datasets are static), and filtered
// client-side by <CommandPalette>. Each item carries everything the palette
// needs to render a row and navigate to it without a page reload.
export const SEARCH_INDEX = [
  ...CHARACTERS.map((c) => ({
    id: c.id,
    type: 'character',
    kind: c.kind,
    route: `/shrine/${c.id}`,
    navState: undefined,
    nameEn: c.nameEn,
    nameTr: c.nameTr,
    epithetEn: c.epithetEn,
    epithetTr: c.epithetTr,
    greek: ETYMOLOGY[c.id]?.polytonic ?? null,
    glow: c.theme?.glow ?? '#d4af37',
  })),
  ...RELICS.map((r) => ({
    id: r.id,
    type: 'relic',
    kind: 'relic',
    route: '/vault',
    navState: { relicId: r.id },
    nameEn: r.nameEn,
    nameTr: r.nameTr,
    epithetEn: r.wielderEn,
    epithetTr: r.wielderTr,
    greek: null,
    glow: r.theme?.glow ?? '#d4af37',
  })),
  ...Object.values(REGIONS).map((region) => ({
    id: region.id,
    type: 'location',
    kind: 'location',
    route: '/map',
    navState: { regionId: region.id },
    nameEn: region.nameEn,
    nameTr: region.nameTr,
    epithetEn: '',
    epithetTr: '',
    greek: null,
    glow: '#3ad6e0',
  })),
]

export function searchEntities(query, lang) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return SEARCH_INDEX.filter((item) => {
    const haystacks = [item.nameEn, item.nameTr, item.epithetEn, item.epithetTr, item.greek]
    return haystacks.some((h) => h?.toLowerCase().includes(q))
  })
    .sort((a, b) => {
      const aName = (lang === 'tr' ? a.nameTr : a.nameEn).toLowerCase()
      const bName = (lang === 'tr' ? b.nameTr : b.nameEn).toLowerCase()
      const aStarts = aName.startsWith(q) ? 0 : 1
      const bStarts = bName.startsWith(q) ? 0 : 1
      return aStarts - bStarts
    })
    .slice(0, 40)
}
