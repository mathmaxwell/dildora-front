import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
}

export const slideUp = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
}

interface Props {
  children: ReactNode
  delay?: number
}

export function AnimatedSection({ children }: Props) {
  return (
    <motion.div
      variants={slideUp}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      style={{ originY: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
