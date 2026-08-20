import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BronzeFrame from './BronzeFrame'
import { useLang } from '../../context/LangContext'
import { ETYMOLOGY } from '../../modules/etymology/etymologyData'

export default function GodCard({ character }) {
  const { lang, t } = useLang()
  const name = lang === 'tr' ? character.nameTr : character.nameEn
  const epithet = lang === 'tr' ? character.epithetTr : character.epithetEn
  const greek = ETYMOLOGY[character.id]?.polytonic

  return (
    <Link to={`/shrine/${character.id}`} data-cursor="glow" className="block shrink-0 select-none">
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-[190px] sm:w-[220px]"
      >
        <BronzeFrame character={character} layoutId={`portrait-${character.id}`} className="h-[260px] sm:h-[300px]" />
        <div className="mt-4 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-500 dark:text-gold-300/70">
            {t(`common.${character.kind}`)}
          </p>
          <h3 className="mt-1 font-serif text-xl tracking-wide text-abyss-900 dark:text-marble-100">{name}</h3>
          {greek && <p className="font-greek font-greek-hover text-sm text-gold-500/80 dark:text-gold-300/70">{greek}</p>}
          <p className="mt-0.5 truncate font-sans text-xs italic text-current/50">{epithet}</p>
        </div>
      </motion.div>
    </Link>
  )
}
