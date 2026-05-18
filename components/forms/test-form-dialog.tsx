'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: any
  mode: 'create' | 'edit'
}

export function TestFormDialog({ open, onOpenChange, data, mode }: TestFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    month: data?.month ? new Date(data.month).toISOString().split('T')[0].slice(0, 7) : '',
    channel: data?.channel || '',
    testDescription: data?.testDescription || '',
    results: data?.results || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/optimizations' : `/api/optimizations/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: formData.month + '-01',
          channel: formData.channel || null,
          testDescription: formData.testDescription || null,
          results: formData.results || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(mode === 'create' ? 'Test created successfully!' : 'Test updated successfully!')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving A/B test:', error)
      toast.error('Failed to save test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add A/B Test' : 'Edit A/B Test'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Document a new A/B test or optimization.' : 'Update A/B test information.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Input
              id="channel"
              type="text"
              placeholder="e.g., Email, Website, Social Media"
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="testDescription">Test Description</Label>
            <textarea
              id="testDescription"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe what you tested..."
              value={formData.testDescription}
              onChange={(e) => setFormData({ ...formData, testDescription: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results</Label>
            <textarea
              id="results"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What were the results and key learnings?"
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
            />
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
