'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  decimals?: number
  suffix?: string
  prefix?: string
  delay?: number
}

export function AnimatedCounter({
  value,
  duration = 1500,
  className = '',
  decimals = 0,
  suffix = '',
  prefix = '',
  delay = 0,
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
          
          setTimeout(() => {
            const startTime = Date.now()
            const startValue = 0

            const animate = () => {
              const now = Date.now()
              const progress = Math.min((now - startTime) / duration, 1)
              
              // Enhanced easing function for bouncy effect
              const easeOutElastic = (t: number) => {
                const c4 = (2 * Math.PI) / 3
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
              }
              
              const currentValue = startValue + (value - startValue) * easeOutElastic(progress)

              setCount(currentValue)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setCount(value) // Ensure final value is exact
              }
            }

            requestAnimationFrame(animate)
          }, delay)
          
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [value, duration, hasAnimated, delay])

  const formattedValue = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={countRef} className={`inline-block transition-all duration-300 ${className}`}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
