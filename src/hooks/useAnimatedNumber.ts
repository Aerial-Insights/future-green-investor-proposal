import { useSpring, useMotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useAnimatedNumber(value: number, duration = 0.6): number {
  const [display, setDisplay] = useState(value)
  const motionValue = useMotionValue(value)
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplay(latest)
    })
    return unsubscribe
  }, [springValue])

  return display
}
