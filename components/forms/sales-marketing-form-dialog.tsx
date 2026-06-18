'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SalesMarketingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
  mode: 'create' | 'edit'
}

export function SalesMarketingFormDialog({ open, onOpenChange, initialData, mode }: SalesMarketingFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekOf: '',
    targetSendDate: '',
    audience: '',
    subjectMessage: '',
    opportunities: '',
    notes: '',
    status: '',
    finalLink: '',
    sent: '',
    reportSent: '',
    micrositeVisits: '',
    openRate: '',
    clickRate: '',
    bounces: '',
    unsubs: '',
  })

  // Update form data when initialData prop changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        weekOf: initialData.weekOf ? new Date(initialData.weekOf).toISOString().split('T')[0] : '',
        targetSendDate: initialData.targetSendDate ? new Date(initialData.targetSendDate).toISOString().split('T')[0] : '',
        audience: initialData.audience || '',
        subjectMessage: initialData.subjectMessage || '',
        opportunities: initialData.opportunities || '',
        notes: initialData.notes || '',
        status: initialData.status || '',
        finalLink: initialData.finalLink || '',
        sent: initialData.sent || '',
        reportSent: initialData.reportSent || '',
        micrositeVisits: initialData.micrositeVisits?.toString() || '',
        openRate: initialData.openRate ? (initialData.openRate * 100).toString() : '',
        clickRate: initialData.clickRate ? (initialData.clickRate * 100).toString() : '',
        bounces: initialData.bounces?.toString() || '',
        unsubs: initialData.unsubs?.toString() || '',
      })
    } else {
      // Reset form when creating new
      setFormData({
        weekOf: '',
        targetSendDate: '',
        audience: '',
        subjectMessage: '',
        opportunities: '',
        notes: '',
        status: '',
        finalLink: '',
        sent: '',
        reportSent: '',
        micrositeVisits: '',
        openRate: '',
        clickRate: '',
        bounces: '',
        unsubs: '',
      })
    }
  }, [initialData, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = mode === 'create' ? '/api/sales-marketing' : `/api/sales-marketing/${initialData.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekOf: formData.weekOf,
          targetSendDate: formData.targetSendDate || null,
          audience: formData.audience || null,
          subjectMessage: formData.subjectMessage || null,
          opportunities: formData.opportunities || null,
          notes: formData.notes || null,
          status: formData.status || null,
          finalLink: formData.finalLink || null,
          sent: formData.sent || null,
          reportSent: formData.reportSent || null,
          micrositeVisits: formData.micrositeVisits ? parseInt(formData.micrositeVisits) : null,
          openRate: formData.openRate ? parseFloat(formData.openRate) / 100 : null,
          clickRate: formData.clickRate ? parseFloat(formData.clickRate) / 100 : null,
          bounces: formData.bounces ? parseInt(formData.bounces) : null,
          unsubs: formData.unsubs ? parseInt(formData.unsubs) : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success(mode === 'create' ? 'Campaign created successfully!' : 'Campaign updated successfully!')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving sales marketing campaign:', error)
      toast.error('Failed to save campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create New Campaign' : 'Edit Campaign'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new sales marketing campaign.' : 'Update the campaign details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Week Of */}
            <div className="space-y-2">
              <Label htmlFor="weekOf">Week Of *</Label>
              <Input
                id="weekOf"
                type="date"
                value={formData.weekOf}
                onChange={(e) => setFormData({ ...formData, weekOf: e.target.value })}
                required
              />
            </div>

            {/* Target Send Date */}
            <div className="space-y-2">
              <Label htmlFor="targetSendDate">Target Send Date</Label>
              <Input
                id="targetSendDate"
                type="date"
                value={formData.targetSendDate}
                onChange={(e) => setFormData({ ...formData, targetSendDate: e.target.value })}
              />
            </div>
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience">Audience</Label>
            <Input
              id="audience"
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              placeholder="e.g., Prospects, Renewals, Entire Database"
            />
          </div>

          {/* Subject/Message */}
          <div className="space-y-2">
            <Label htmlFor="subjectMessage">Subject/Message</Label>
            <Textarea
              id="subjectMessage"
              value={formData.subjectMessage}
              onChange={(e) => setFormData({ ...formData, subjectMessage: e.target.value })}
              placeholder="Campaign subject or message"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Opportunities */}
            <div className="space-y-2">
              <Label htmlFor="opportunities">Opportunities</Label>
              <Input
                id="opportunities"
                value={formData.opportunities}
                onChange={(e) => setFormData({ ...formData, opportunities: e.target.value })}
                placeholder="e.g., Booth Pricing"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                placeholder="e.g., Sent, Scheduled, Draft"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or instructions"
              rows={2}
            />
          </div>

          {/* Final Link */}
          <div className="space-y-2">
            <Label htmlFor="finalLink">Final Link</Label>
            <Input
              id="finalLink"
              type="url"
              value={formData.finalLink}
              onChange={(e) => setFormData({ ...formData, finalLink: e.target.value })}
              placeholder="https://"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sent */}
            <div className="space-y-2">
              <Label htmlFor="sent">Sent</Label>
              <Input
                id="sent"
                value={formData.sent}
                onChange={(e) => setFormData({ ...formData, sent: e.target.value })}
                placeholder="e.g., Sent 8.29.23"
              />
            </div>

            {/* Report Sent */}
            <div className="space-y-2">
              <Label htmlFor="reportSent">Report Sent</Label>
              <Input
                id="reportSent"
                value={formData.reportSent}
                onChange={(e) => setFormData({ ...formData, reportSent: e.target.value })}
                placeholder="e.g., 8.30.23"
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Microsite Visits */}
              <div className="space-y-2">
                <Label htmlFor="micrositeVisits">Microsite Visits</Label>
                <Input
                  id="micrositeVisits"
                  type="number"
                  value={formData.micrositeVisits}
                  onChange={(e) => setFormData({ ...formData, micrositeVisits: e.target.value })}
                  placeholder="0"
                />
              </div>

              {/* Bounces */}
              <div className="space-y-2">
                <Label htmlFor="bounces">Bounces</Label>
                <Input
                  id="bounces"
                  type="number"
                  value={formData.bounces}
                  onChange={(e) => setFormData({ ...formData, bounces: e.target.value })}
                  placeholder="0"
                />
              </div>

              {/* Open Rate */}
              <div className="space-y-2">
                <Label htmlFor="openRate">Open Rate (%)</Label>
                <Input
                  id="openRate"
                  type="number"
                  step="0.01"
                  value={formData.openRate}
                  onChange={(e) => setFormData({ ...formData, openRate: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              {/* Click Rate */}
              <div className="space-y-2">
                <Label htmlFor="clickRate">Click Rate (%)</Label>
                <Input
                  id="clickRate"
                  type="number"
                  step="0.01"
                  value={formData.clickRate}
                  onChange={(e) => setFormData({ ...formData, clickRate: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              {/* Unsubs */}
              <div className="space-y-2">
                <Label htmlFor="unsubs">Unsubscribes</Label>
                <Input
                  id="unsubs"
                  type="number"
                  value={formData.unsubs}
                  onChange={(e) => setFormData({ ...formData, unsubs: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'create' ? 'Create Campaign' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
