import { motion } from 'framer-motion'
import { useModeStore } from '../store/modeStore'

const orbs = [
  { size: 500, color: 'rgba(124,58,237,0.12)', x: [-100, 200, 0, -100], y: [0, -150, 100, 0], duration: 25, delay: 0 },
  { size: 400, color: 'rgba(219,39,119,0.10)', x: [300, 0, 400, 300], y: [100, 300, 0, 100], duration: 30, delay: 5 },
  { size: 350, color: 'rgba(16,185,129,0.08)', x: [100, 400, 200, 100], y: [400, 100, 300, 400], duration: 35, delay: 10 },
  { size: 300, color: 'rgba(251,146,60,0.07)', x: [500, 100, 300, 500], y: [200, 400, 100, 200], duration: 28, delay: 3 },
]

export function AnimatedBackground() {
  const { mode } = useModeStore()
  const dark = mode === 'dark'

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      pointerEvents: 'none', zIndex: 0,
      background: dark
        ? 'radial-gradient(ellipse at 20% 10%, #1a0535 0%, #0D0720 60%)'
        : 'radial-gradient(ellipse at 20% 10%, #ede9fe 0%, #F5F3FF 60%)',
    }}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ x: orb.x, y: orb.y }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(50px)',
            left: -orb.size / 2,
            top: -orb.size / 2,
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: dark
          ? 'radial-gradient(circle, rgba(167,139,250,0.06) 1px, transparent 1px)'
          : 'radial-gradient(circle, rgba(124,58,237,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
    </div>
  )
}
