import { Handle, Position } from '@xyflow/react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../context/LangContext'
import { useAmbientAudio } from '../../context/AudioContext'
import useHaptics from '../../hooks/useHaptics'

export default function CharacterNode({ data }) {
  const { character } = data
  const { lang, t } = useLang()
  const navigate = useNavigate()
  const { playSfx } = useAmbientAudio()
  const haptics = useHaptics()
  const name = lang === 'tr' ? character.nameTr : character.nameEn
  const glow = character.theme?.glow ?? '#d4af37'

  const handleClick = () => {
    playSfx('nodeClick')
    haptics.confirm()
    navigate(`/shrine/${character.id}`)
  }

  return (
    <button
      onClick={handleClick}
      data-cursor="glow"
      className="group relative flex w-[150px] flex-col items-center gap-1 rounded-2xl border bg-abyss-900/90 px-3 py-3 text-center shadow-lg backdrop-blur transition-transform hover:-translate-y-1"
      style={{ borderColor: `${glow}55` }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gold-300 !border-none !h-1.5 !w-1.5" />
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full font-serif text-sm text-abyss-950"
        style={{ background: `linear-gradient(135deg, ${glow}, #7a5230)` }}
      >
        {name.slice(0, 1)}
      </div>
      <p className="font-serif text-sm text-marble-100">{name}</p>
      <p className="font-sans text-[9px] uppercase tracking-[0.2em] text-marble-100/40">
        {t(`common.${character.kind}`)}
      </p>
      <Handle type="source" position={Position.Bottom} className="!bg-gold-300 !border-none !h-1.5 !w-1.5" />
    </button>
  )
}
