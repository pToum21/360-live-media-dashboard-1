'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: any
  mode: 'create' | 'edit'
}

export function ClientFormDialog({ open, onOpenChange, data, mode }: ClientFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: data?.name || '',
    eventName: data?.eventName || '',
    utmTracking: data?.utmTracking || false,
    conversionTracking: data?.conversionTracking || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/clients' : `/api/clients/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to save')

      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Client Project' : 'Edit Client Project'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new client project to track.' : 'Update client project information.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name (optional)</Label>
            <Input
              id="eventName"
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                id="utmTracking"
                type="checkbox"
                checked={formData.utmTracking}
                onChange={(e) => setFormData({ ...formData, utmTracking: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="utmTracking" className="cursor-pointer">UTM Tracking Enabled</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="conversionTracking"
                type="checkbox"
                checked={formData.conversionTracking}
                onChange={(e) => setFormData({ ...formData, conversionTracking: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <Label htmlFor="conversionTracking" className="cursor-pointer">Conversion Tracking Enabled</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#2E8741] hover:bg-[#236933]">
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
