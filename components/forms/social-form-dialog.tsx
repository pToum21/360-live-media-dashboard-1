'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SocialFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: any
  mode: 'create' | 'edit'
}

export function SocialFormDialog({ open, onOpenChange, data, mode }: SocialFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekStarting: '',
    liFollowers: '',
    liImpressions: '',
    liEngagementRate: '',
    igFollowers: '',
    igImpressions: '',
    igEngagementRate: '',
  })

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        weekStarting: data.weekStarting ? new Date(data.weekStarting).toISOString().split('T')[0] : '',
        liFollowers: data.liFollowers || '',
        liImpressions: data.liImpressions || '',
        liEngagementRate: data.liEngagementRate ? (data.liEngagementRate * 100).toString() : '',
        igFollowers: data.igFollowers || '',
        igImpressions: data.igImpressions || '',
        igEngagementRate: data.igEngagementRate ? (data.igEngagementRate * 100).toString() : '',
      })
    } else {
      setFormData({
        weekStarting: '',
        liFollowers: '',
        liImpressions: '',
        liEngagementRate: '',
        igFollowers: '',
        igImpressions: '',
        igEngagementRate: '',
      })
    }
  }, [data, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/social' : `/api/social/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStarting: formData.weekStarting,
          liFollowers: parseInt(formData.liFollowers) || 0,
          liImpressions: parseInt(formData.liImpressions) || 0,
          liEngagementRate: formData.liEngagementRate ? parseFloat(formData.liEngagementRate) / 100 : null,
          igFollowers: parseInt(formData.igFollowers) || 0,
          igImpressions: parseInt(formData.igImpressions) || 0,
          igEngagementRate: formData.igEngagementRate ? parseFloat(formData.igEngagementRate) / 100 : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(mode === 'create' ? 'Metric created successfully!' : 'Metric updated successfully!')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving social metric:', error)
      toast.error('Failed to save metric. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Social Media Metrics' : 'Edit Social Media Metrics'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Enter social media data for a new week.' : 'Update social media data.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekStarting">Week Starting</Label>
              <Input
                id="weekStarting"
                type="date"
                value={formData.weekStarting}
                onChange={(e) => setFormData({ ...formData, weekStarting: e.target.value })}
                required
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-blue-600">LinkedIn Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="liFollowers">Followers</Label>
                  <Input
                    id="liFollowers"
                    type="number"
                    value={formData.liFollowers}
                    onChange={(e) => setFormData({ ...formData, liFollowers: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="liImpressions">Impressions</Label>
                  <Input
                    id="liImpressions"
                    type="number"
                    value={formData.liImpressions}
                    onChange={(e) => setFormData({ ...formData, liImpressions: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="liEngagementRate">Engagement Rate (%)</Label>
                  <Input
                    id="liEngagementRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.liEngagementRate}
                    onChange={(e) => setFormData({ ...formData, liEngagementRate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-pink-600">Instagram Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="igFollowers">Followers</Label>
                  <Input
                    id="igFollowers"
                    type="number"
                    value={formData.igFollowers}
                    onChange={(e) => setFormData({ ...formData, igFollowers: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="igImpressions">Impressions</Label>
                  <Input
                    id="igImpressions"
                    type="number"
                    value={formData.igImpressions}
                    onChange={(e) => setFormData({ ...formData, igImpressions: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="igEngagementRate">Engagement Rate (%)</Label>
                  <Input
                    id="igEngagementRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.igEngagementRate}
                    onChange={(e) => setFormData({ ...formData, igEngagementRate: e.target.value })}
                  />
                </div>
              </div>
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
