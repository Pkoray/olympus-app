import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import PageTransition from '../components/layout/PageTransition'
import KatabasisStage from '../modules/katabasis/KatabasisStage'
import useKatabasisAudio from '../modules/katabasis/useKatabasisAudio'
import { STAGES } from '../modules/katabasis/katabasisData'
import { useLang } from '../context/LangContext'

export default function KatabasisPage() {
  const { t } = useLang()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  useKatabasisAudio(scrollYProgress)

  return (
    <PageTransition className="relative bg-black">
      <div ref={containerRef} className="relative">
        {STAGES.map((stage, i) => (
          <KatabasisStage key={stage.id} stage={stage} index={i} total={STAGES.length} progress={scrollYProgress} />
        ))}
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-24 z-10 flex flex-col items-center gap-2 text-marble-100/50">
        <p className="font-sans text-[11px] uppercase tracking-[0.3em]">{t('katabasis.scrollHint')}</p>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={16} />
        </motion.div>
      </div>

      <div className="pointer-events-none fixed right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-2 sm:right-8">
        <div className="relative h-40 w-px overflow-hidden rounded-full bg-marble-100/15">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-gold-200 to-gold-500"
            style={{ height: '100%', scaleY: scrollYProgress }}
          />
        </div>
      </div>
    </PageTransition>
  )
}
