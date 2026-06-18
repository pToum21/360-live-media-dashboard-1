'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface EmailFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: any
  mode: 'create' | 'edit'
}

export function EmailFormDialog({ open, onOpenChange, data, mode }: EmailFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    deploymentDate: '',
    name: '',
    subjectLine: '',
    audience: '',
    campaignType: '',
    openRate: '',
    clickRate: '',
    deliveryRate: '',
    unsubscribeRate: '',
  })

  // Update form data when data prop changes
  useEffect(() => {
    if (data) {
      setFormData({
        deploymentDate: data.deploymentDate ? new Date(data.deploymentDate).toISOString().split('T')[0] : '',
        name: data.name || '',
        subjectLine: data.subjectLine || '',
        audience: data.audience || '',
        campaignType: data.campaignType || '',
        openRate: data.openRate ? (data.openRate * 100).toString() : '',
        clickRate: data.clickRate ? (data.clickRate * 100).toString() : '',
        deliveryRate: data.deliveryRate ? (data.deliveryRate * 100).toString() : '',
        unsubscribeRate: data.unsubscribeRate ? (data.unsubscribeRate * 100).toString() : '',
      })
    } else {
      // Reset form when creating new
      setFormData({
        deploymentDate: '',
        name: '',
        audience: '',
        campaignType: '',
        openRate: '',
        clickRate: '',
        deliveryRate: '',
        unsubscribeRate: '',
      })
    }
  }, [data, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/email' : `/api/email/${data.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deploymentDate: formData.deploymentDate,
          name: formData.name,
          subjectLine: formData.subjectLine || null,
          audience: formData.audience || null,
          campaignType: formData.campaignType,
          openRate: parseFloat(formData.openRate) / 100 || 0,
          clickRate: parseFloat(formData.clickRate) / 100 || 0,
          deliveryRate: parseFloat(formData.deliveryRate) / 100 || 0,
          unsubscribeRate: parseFloat(formData.unsubscribeRate) / 100 || 0,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(mode === 'create' ? 'Campaign created successfully!' : 'Campaign updated successfully!')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving email campaign:', error)
      toast.error('Failed to save campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add Email Campaign' : 'Edit Email Campaign'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Enter email campaign performance data.' : 'Update email campaign data.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="deploymentDate">Deployment Date</Label>
              <Input
                id="deploymentDate"
                type="date"
                value={formData.deploymentDate}
                onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectLine">Subject Line (optional)</Label>
              <Input
                id="subjectLine"
                type="text"
                placeholder="Enter email subject line..."
                value={formData.subjectLine}
                onChange={(e) => setFormData({ ...formData, subjectLine: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience (optional)</Label>
                <select
                  id="audience"
                  value={formData.audience}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select audience...</option>
                  <option value="Members">Members</option>
                  <option value="Sponsors">Sponsors</option>
                  <option value="Attendees">Attendees</option>
                  <option value="All">All</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignType">Campaign Type <span className="text-gray-500">(updates filters)</span></Label>
                <select
                  id="campaignType"
                  value={formData.campaignType}
                  onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Registration Email">Registration Email</option>
                  <option value="Nurture Email">Nurture Email</option>
                  <option value="Call for Content Email">Call for Content Email</option>
                  <option value="Awareness Email">Awareness Email</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Performance Rates (%)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openRate">Open Rate</Label>
                  <Input
                    id="openRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.openRate}
                    onChange={(e) => setFormData({ ...formData, openRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clickRate">Click Rate</Label>
                  <Input
                    id="clickRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.clickRate}
                    onChange={(e) => setFormData({ ...formData, clickRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryRate">Delivery Rate</Label>
                  <Input
                    id="deliveryRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.deliveryRate}
                    onChange={(e) => setFormData({ ...formData, deliveryRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unsubscribeRate">Unsubscribe Rate</Label>
                  <Input
                    id="unsubscribeRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.unsubscribeRate}
                    onChange={(e) => setFormData({ ...formData, unsubscribeRate: e.target.value })}
                    required
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
