'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black relative overflow-hidden flex items-center justify-center px-4">
          {/* Background Orbs */}
          <div className="absolute top-20 -right-20 w-96 h-96 bg-gray-200/30 dark:bg-gray-800/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gray-300/25 dark:bg-gray-700/25 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-100/40 dark:bg-red-950/40 rounded-full blur-3xl"></div>

          {/* Content */}
          <div className="max-w-2xl w-full">
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '48px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
            }}>
              {/* Error Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle style={{ width: '40px', height: '40px', color: '#dc2626' }} />
                </div>
              </div>

              {/* Error Message */}
              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '16px'
              }}>
                Critical Error
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                marginBottom: '16px',
                maxWidth: '28rem',
                margin: '0 auto'
              }}>
                A critical error occurred. Please refresh the page to continue.
              </p>
              {error.digest && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#9ca3af',
                  fontFamily: 'monospace',
                  marginTop: '16px'
                }}>
                  Error ID: {error.digest}
                </p>
              )}

              {/* Action */}
              <button
                onClick={reset}
                style={{
                  marginTop: '32px',
                  background: '#2E8741',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#236933'}
                onMouseOut={(e) => e.currentTarget.style.background = '#2E8741'}
              >
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
