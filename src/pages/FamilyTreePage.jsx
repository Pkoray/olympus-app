import { useMemo } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap, ReactFlowProvider, BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import PageTransition from '../components/layout/PageTransition'
import CharacterNode from '../components/tree/CharacterNode'
import BackgroundScene from '../components/ui/BackgroundScene'
import { CHARACTERS } from '../data/characters'
import { useLang } from '../context/LangContext'
import { useTheme } from '../context/ThemeContext'

const nodeTypes = { god: CharacterNode }

// Six generational rows, top to bottom: Primordials → Night's Brood → Titans
// → Olympians (+ chthonic royalty) → Heroes, Seers & Sorceresses → Monsters.
const ROWS = [
  { ids: ['chaos', 'gaia', 'nyx', 'erebus', 'tartarus'], y: -420, spacing: 220 },
  { ids: ['thanatos', 'hypnos', 'morpheus', 'charon', 'moirai', 'nemesis'], y: -260, spacing: 190 },
  { ids: ['cronus', 'rhea', 'oceanus', 'atlas', 'prometheus', 'epimetheus'], y: -60, spacing: 215 },
  {
    ids: [
      'hades', 'poseidon', 'hera', 'zeus', 'demeter', 'hestia', 'athena', 'apollo', 'artemis',
      'ares', 'hermes', 'dionysus', 'hephaestus', 'aphrodite', 'persephone', 'hecate', 'pan', 'eros',
    ],
    y: 320,
    spacing: 165,
  },
  {
    ids: [
      'heracles', 'perseus', 'theseus', 'achilles', 'odysseus', 'daedalus', 'icarus', 'jason',
      'bellerophon', 'atalanta', 'oedipus', 'orpheus', 'sisyphus', 'tantalus', 'ariadne',
      'pandora', 'cassandra', 'circe', 'medea', 'psyche', 'asclepius',
    ],
    y: 700,
    spacing: 165,
  },
  { ids: ['minotaur', 'medusa', 'cerberus', 'chimera', 'typhon', 'hydra', 'sirens', 'sphinx'], y: 1040, spacing: 200 },
]

// Narrative connections that aren't literal parent/child lineage — kept as
// dashed "kinship" edges (same generation, guardianship, or "slew/built for").
const KIN_EDGES = [
  ['gaia', 'oceanus'],
  ['gaia', 'atlas'],
  ['gaia', 'prometheus'],
  ['gaia', 'epimetheus'],
  ['hades', 'cerberus'],
  ['heracles', 'cerberus'],
  ['heracles', 'hydra'],
  ['theseus', 'minotaur'],
  ['daedalus', 'minotaur'],
  ['perseus', 'medusa'],
  ['ariadne', 'theseus'],
  ['ariadne', 'minotaur'],
  ['ariadne', 'dionysus'],
  ['jason', 'medea'],
  ['bellerophon', 'chimera'],
  ['oedipus', 'sphinx'],
  ['odysseus', 'circe'],
  ['odysseus', 'sirens'],
  ['orpheus', 'cerberus'],
  ['orpheus', 'hades'],
  ['sisyphus', 'thanatos'],
  ['tantalus', 'demeter'],
  ['hecate', 'demeter'],
  ['pandora', 'epimetheus'],
]

function buildGraph() {
  const nodes = []
  ROWS.forEach(({ ids, y, spacing }) => {
    const offset = -((ids.length - 1) * spacing) / 2
    ids.forEach((id, i) => {
      const character = CHARACTERS.find((c) => c.id === id)
      if (!character) return
      nodes.push({
        id, type: 'god', data: { character },
        position: { x: offset + i * spacing, y }, draggable: true,
      })
    })
  })

  const edges = []
  CHARACTERS.forEach((c) => {
    ;(c.parents || []).forEach((p) => {
      edges.push({
        id: `${p}-${c.id}`,
        source: p,
        target: c.id,
        type: 'smoothstep',
        style: { stroke: '#d4af37', strokeWidth: 1.4, opacity: 0.55 },
      })
    })
  })
  KIN_EDGES.forEach(([a, b]) => {
    edges.push({
      id: `${a}-${b}-kin`,
      source: a,
      target: b,
      type: 'straight',
      style: { stroke: '#d4af37', strokeWidth: 1, strokeDasharray: '4 5', opacity: 0.3 },
    })
  })

  return { nodes, edges }
}

export default function FamilyTreePage() {
  const { t } = useLang()
  const { isDark } = useTheme()
  const { nodes, edges } = useMemo(buildGraph, [])

  return (
    <PageTransition className="relative min-h-dvh">
      <BackgroundScene theme={{ bg: 'cosmic', primary: '#0b0f1f', secondary: '#1c2747', glow: '#d4af37' }} />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-28 sm:px-8">
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-gold-300/70">{t('home.section.tree.kicker')}</p>
        <h1 className="mt-3 font-serif text-4xl text-marble-100 sm:text-5xl">{t('tree.title')}</h1>
        <p className="mt-3 max-w-xl font-sans text-current/60">{t('tree.subtitle')}</p>
        <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-gold-300/50">{t('tree.hint')}</p>
      </div>

      <div className="mx-5 h-[75vh] overflow-hidden rounded-3xl border border-gold-300/15 sm:mx-8 sm:h-[82vh]">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color={isDark ? '#3a3550' : '#c8b98a'} />
            <Controls showInteractive={false} className="!bg-abyss-900/80 !border-gold-300/20 [&_button]:!border-gold-300/20 [&_button]:!bg-transparent [&_button]:!text-gold-200" />
            <MiniMap
              pannable zoomable
              maskColor="rgba(5,6,10,0.75)"
              nodeColor={() => '#d4af37'}
              className="!bg-abyss-900/80 !border !border-gold-300/20"
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </PageTransition>
  )
}
