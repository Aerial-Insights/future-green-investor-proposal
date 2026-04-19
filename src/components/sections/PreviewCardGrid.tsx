import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'

interface PreviewCard {
  title: string
  description: string
  to: string
  accent?: string
}

interface PreviewCardGridProps {
  cards: PreviewCard[]
}

export default function PreviewCardGrid({ cards }: PreviewCardGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map((card) => (
        <motion.div key={card.title} variants={staggerItem}>
          <Link
            to={card.to}
            className="block luxury-card group h-full hover:shadow-glow"
          >
            <div
              className="w-10 h-1 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
              style={{ backgroundColor: card.accent ?? '#c9a84c' }}
            />
            <h3 className="font-display font-semibold text-text-primary text-lg mb-2 group-hover:text-accent-gold transition-colors">
              {card.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{card.description}</p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
