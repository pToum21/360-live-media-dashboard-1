'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gray-200/30 dark:bg-gray-800/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-300/25 dark:bg-gray-700/25 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-100/40 dark:bg-red-950/40 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Glass Card */}
          <div className="glass-card border-0 p-12 text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/Logos/Info=Basic, Color=Green.png"
                alt="360 Live Media"
                width={120}
                height={120}
                className="opacity-90"
              />
            </div>

            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Message */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Something went wrong
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                We encountered an unexpected error. Please try refreshing the page or return to the dashboard.
              </p>
              {error.digest && (
                <p className="text-sm text-gray-500 dark:text-gray-500 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                onClick={reset}
                className="glass-button bg-[#2E8741] hover:bg-[#236933] text-white group"
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Try Again
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="glass-button border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to 360° Command
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
