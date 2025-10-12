'use client'

/**
 * Global Error Boundary
 * Catches and displays errors gracefully
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">
            Terjadi Kesalahan / Something Went Wrong
          </CardTitle>
          <CardDescription>
            Aplikasi mengalami error yang tidak terduga / The application encountered an unexpected error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-red-50 rounded text-sm text-red-800 font-mono">
              {error.message}
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={() => reset()} className="flex-1">
              Coba Lagi / Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              Ke Beranda / Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

