'use client'

import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function Sparkles({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkle = (): Sparkle => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    })

    const initialSparkles = Array.from({ length: 3 }, generateSparkle)
    setSparkles(initialSparkles)

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkle = generateSparkle()
        return [...prev.slice(-2), newSparkle]
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animation: `sparkle-animation ${sparkle.duration}s ease-in-out infinite`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full blur-[1px] opacity-70" />
        </div>
      ))}
      {children}
      <style jsx>{`
        @keyframes sparkle-animation {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
