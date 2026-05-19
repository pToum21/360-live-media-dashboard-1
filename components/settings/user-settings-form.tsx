'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface UserSettingsFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
  }
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user.name || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully!')
      router.refresh()
    } catch (error) {
      toast.error('Failed to update profile. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/30 dark:border-gray-700 focus:border-green-500 focus:ring-green-500 dark:text-gray-100"
          required
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          This is the name that will be displayed throughout the dashboard
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={user.email || ''}
          disabled
          className="backdrop-blur-sm bg-gray-100/60 dark:bg-gray-800/40 border-white/30 dark:border-gray-700 cursor-not-allowed dark:text-gray-400"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Email cannot be changed. Contact an administrator if you need to update it.
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-gradient-to-r from-[#2E8741] to-[#3a9c54] hover:from-[#246833] hover:to-[#2E8741] text-white shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}
