import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-20 -right-20 w-96 h-96 bg-gray-200/30 dark:bg-gray-800/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-300/25 dark:bg-gray-700/25 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-100/40 dark:bg-green-950/40 rounded-full blur-3xl"></div>

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

            {/* 404 */}
            <div>
              <h1 className="text-8xl font-bold bg-gradient-to-r from-gray-600 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent mb-4">
                404
              </h1>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Page Not Found
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button className="glass-button bg-[#2E8741] hover:bg-[#236933] text-white group">
                  <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Go to 360° Command
                </Button>
              </Link>
              <Button
                variant="outline"
                className="glass-button border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 group"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
