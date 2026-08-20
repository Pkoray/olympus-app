import { motion } from 'framer-motion'

// No `filter` here on purpose: framer-motion writes an at-rest `blur(0px)`
// rather than collapsing it to the keyword `none`, and any non-`none`
// filter (even a zero blur) establishes a CSS containing block — silently
// breaking `position: fixed` for every descendant on every page (modals,
// bottom sheets, scroll-progress overlays included). Opacity + y alone give
// the same soft page-transition feel without that trap.
const variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.main
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.main>
  )
}
