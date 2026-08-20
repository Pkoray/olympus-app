export const STAGES = [
  {
    id: 'styx',
    visual: 'styx',
    t: 'katabasis.stage.styx',
    colors: { top: '#0a1420', bottom: '#020306', mist: '#3a5a6e', ember: '#6fa8b8' },
    audioProfile: { engine: 'styx', base: 52, filter: 900, lfoRate: 0.22, lfoDepth: 60 },
  },
  {
    id: 'asphodel',
    visual: 'asphodel',
    t: 'katabasis.stage.asphodel',
    colors: { top: '#3a3a42', bottom: '#17161c', mist: '#8a889a', ember: '#b9b6c8' },
    audioProfile: { engine: 'void', base: 34, filter: 200, lfoRate: 0.02, lfoDepth: 25 },
  },
  {
    id: 'elysian',
    visual: 'elysian',
    t: 'katabasis.stage.elysian',
    colors: { top: '#4a3110', bottom: '#1a1204', mist: '#f3d16b', ember: '#ffe6a3' },
    audioProfile: { engine: 'elysian', base: 220, filter: 1400, lfoRate: 0.08, lfoDepth: 60 },
  },
  {
    id: 'tartarus',
    visual: 'tartarus',
    t: 'katabasis.stage.tartarus',
    colors: { top: '#0e0508', bottom: '#000000', mist: '#3a1010', ember: '#ff6a3d' },
    audioProfile: { engine: 'rumble', base: 34, filter: 180, lfoRate: 0.02, lfoDepth: 55 },
  },
]
