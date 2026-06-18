import { Container } from '@mui/material'
import { motion } from 'framer-motion'
import { FormWizard } from '../components/FormWizard'

export function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <FormWizard />
      </motion.div>
    </Container>
  )
}
