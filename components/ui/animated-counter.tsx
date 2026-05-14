'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
  suffix?: string
  prefix?: string
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className = '',
  decimals = 0,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true)
          const startTime = Date.now()
          const startValue = 0

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = startValue + (value - startValue) * easeOutQuart

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  const formattedValue = count.toFixed(decimals)

  return (
    <span ref={countRef} className={`counter-animate ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
