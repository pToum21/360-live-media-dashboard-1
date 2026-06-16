'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'

interface PaidMedia {
  id: string
  weekStarting: Date
  liImpressions: number | null
  liClicks: number | null
  liSpend: number | null
  liCPC: number | null
  liCTR: number | null
  liConversions: number | null
  liCVR: number | null
  liCPA: number | null
  metaImpressions: number | null
  metaClicks: number | null
  metaSpend: number | null
  metaCPC: number | null
  metaCTR: number | null
  metaConversions: number | null
  metaCVR: number | null
  metaCPA: number | null
  googleSearchImpressions: number | null
  googleSearchClicks: number | null
  googleSearchSpend: number | null
  googleSearchCPC: number | null
  googleSearchCTR: number | null
  googleSearchConversions: number | null
  googleSearchCVR: number | null
  googleSearchCPA: number | null
  googleDisplayImpressions: number | null
  googleDisplayClicks: number | null
  googleDisplaySpend: number | null
  googleDisplayCPC: number | null
  googleDisplayCTR: number | null
  googleDisplayConversions: number | null
  googleDisplayCVR: number | null
  googleDisplayCPA: number | null
}

interface PaidMediaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paidMedia?: PaidMedia | null
  clientId: string
}

export function PaidMediaFormDialog({
  open,
  onOpenChange,
  paidMedia,
  clientId,
}: PaidMediaFormDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    weekStarting: format(new Date(), 'yyyy-MM-dd'),
    liImpressions: 0,
    liClicks: 0,
    liSpend: 0,
    liConversions: 0,
    metaImpressions: 0,
    metaClicks: 0,
    metaSpend: 0,
    metaConversions: 0,
    googleSearchImpressions: 0,
    googleSearchClicks: 0,
    googleSearchSpend: 0,
    googleSearchConversions: 0,
    googleDisplayImpressions: 0,
    googleDisplayClicks: 0,
    googleDisplaySpend: 0,
    googleDisplayConversions: 0,
  })

  useEffect(() => {
    if (paidMedia) {
      setFormData({
        weekStarting: format(new Date(paidMedia.weekStarting), 'yyyy-MM-dd'),
        liImpressions: paidMedia.liImpressions || 0,
        liClicks: paidMedia.liClicks || 0,
        liSpend: paidMedia.liSpend || 0,
        liConversions: paidMedia.liConversions || 0,
        metaImpressions: paidMedia.metaImpressions || 0,
        metaClicks: paidMedia.metaClicks || 0,
        metaSpend: paidMedia.metaSpend || 0,
        metaConversions: paidMedia.metaConversions || 0,
        googleSearchImpressions: paidMedia.googleSearchImpressions || 0,
        googleSearchClicks: paidMedia.googleSearchClicks || 0,
        googleSearchSpend: paidMedia.googleSearchSpend || 0,
        googleSearchConversions: paidMedia.googleSearchConversions || 0,
        googleDisplayImpressions: paidMedia.googleDisplayImpressions || 0,
        googleDisplayClicks: paidMedia.googleDisplayClicks || 0,
        googleDisplaySpend: paidMedia.googleDisplaySpend || 0,
        googleDisplayConversions: paidMedia.googleDisplayConversions || 0,
      })
    }
  }, [paidMedia, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Calculate derived metrics
    const liCTR = formData.liImpressions > 0 ? formData.liClicks / formData.liImpressions : 0
    const liCPC = formData.liClicks > 0 ? formData.liSpend / formData.liClicks : 0
    const liCVR = formData.liClicks > 0 ? formData.liConversions / formData.liClicks : 0
    const liCPA = formData.liConversions > 0 ? formData.liSpend / formData.liConversions : 0

    const metaCTR = formData.metaImpressions > 0 ? formData.metaClicks / formData.metaImpressions : 0
    const metaCPC = formData.metaClicks > 0 ? formData.metaSpend / formData.metaClicks : 0
    const metaCVR = formData.metaClicks > 0 ? formData.metaConversions / formData.metaClicks : 0
    const metaCPA = formData.metaConversions > 0 ? formData.metaSpend / formData.metaConversions : 0

    const googleSearchCTR = formData.googleSearchImpressions > 0 ? formData.googleSearchClicks / formData.googleSearchImpressions : 0
    const googleSearchCPC = formData.googleSearchClicks > 0 ? formData.googleSearchSpend / formData.googleSearchClicks : 0
    const googleSearchCVR = formData.googleSearchClicks > 0 ? formData.googleSearchConversions / formData.googleSearchClicks : 0
    const googleSearchCPA = formData.googleSearchConversions > 0 ? formData.googleSearchSpend / formData.googleSearchConversions : 0

    const googleDisplayCTR = formData.googleDisplayImpressions > 0 ? formData.googleDisplayClicks / formData.googleDisplayImpressions : 0
    const googleDisplayCPC = formData.googleDisplayClicks > 0 ? formData.googleDisplaySpend / formData.googleDisplayClicks : 0
    const googleDisplayCVR = formData.googleDisplayClicks > 0 ? formData.googleDisplayConversions / formData.googleDisplayClicks : 0
    const googleDisplayCPA = formData.googleDisplayConversions > 0 ? formData.googleDisplaySpend / formData.googleDisplayConversions : 0

    const payload = {
      weekStarting: new Date(formData.weekStarting),
      liImpressions: formData.liImpressions || null,
      liClicks: formData.liClicks || null,
      liSpend: formData.liSpend || null,
      liCPC: liCPC || null,
      liCTR: liCTR || null,
      liConversions: formData.liConversions || null,
      liCVR: liCVR || null,
      liCPA: liCPA || null,
      metaImpressions: formData.metaImpressions || null,
      metaClicks: formData.metaClicks || null,
      metaSpend: formData.metaSpend || null,
      metaCPC: metaCPC || null,
      metaCTR: metaCTR || null,
      metaConversions: formData.metaConversions || null,
      metaCVR: metaCVR || null,
      metaCPA: metaCPA || null,
      googleSearchImpressions: formData.googleSearchImpressions || null,
      googleSearchClicks: formData.googleSearchClicks || null,
      googleSearchSpend: formData.googleSearchSpend || null,
      googleSearchCPC: googleSearchCPC || null,
      googleSearchCTR: googleSearchCTR || null,
      googleSearchConversions: formData.googleSearchConversions || null,
      googleSearchCVR: googleSearchCVR || null,
      googleSearchCPA: googleSearchCPA || null,
      googleDisplayImpressions: formData.googleDisplayImpressions || null,
      googleDisplayClicks: formData.googleDisplayClicks || null,
      googleDisplaySpend: formData.googleDisplaySpend || null,
      googleDisplayCPC: googleDisplayCPC || null,
      googleDisplayCTR: googleDisplayCTR || null,
      googleDisplayConversions: formData.googleDisplayConversions || null,
      googleDisplayCVR: googleDisplayCVR || null,
      googleDisplayCPA: googleDisplayCPA || null,
      clientId,
    }

    const url = paidMedia ? `/api/paid-media/${paidMedia.id}` : '/api/paid-media'
    const method = paidMedia ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (res.ok) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{paidMedia ? 'Edit Paid Media' : 'Add Paid Media'}</DialogTitle>
          <DialogDescription>
            Enter paid advertising data. Metrics like CPC, CTR, CVR, and CPA are calculated automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="weekStarting">Week Starting</Label>
              <Input
                id="weekStarting"
                type="date"
                value={formData.weekStarting}
                onChange={(e) =>
                  setFormData({ ...formData, weekStarting: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">LinkedIn Ads</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label>Impressions</Label>
                  <Input type="number" value={formData.liImpressions} onChange={(e) => setFormData({ ...formData, liImpressions: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Clicks</Label>
                  <Input type="number" value={formData.liClicks} onChange={(e) => setFormData({ ...formData, liClicks: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Spend ($)</Label>
                  <Input type="number" step="0.01" value={formData.liSpend} onChange={(e) => setFormData({ ...formData, liSpend: parseFloat(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Conversions</Label>
                  <Input type="number" value={formData.liConversions} onChange={(e) => setFormData({ ...formData, liConversions: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Meta Ads</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label>Impressions</Label>
                  <Input type="number" value={formData.metaImpressions} onChange={(e) => setFormData({ ...formData, metaImpressions: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Clicks</Label>
                  <Input type="number" value={formData.metaClicks} onChange={(e) => setFormData({ ...formData, metaClicks: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Spend ($)</Label>
                  <Input type="number" step="0.01" value={formData.metaSpend} onChange={(e) => setFormData({ ...formData, metaSpend: parseFloat(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Conversions</Label>
                  <Input type="number" value={formData.metaConversions} onChange={(e) => setFormData({ ...formData, metaConversions: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Google Search Ads</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label>Impressions</Label>
                  <Input type="number" value={formData.googleSearchImpressions} onChange={(e) => setFormData({ ...formData, googleSearchImpressions: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Clicks</Label>
                  <Input type="number" value={formData.googleSearchClicks} onChange={(e) => setFormData({ ...formData, googleSearchClicks: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Spend ($)</Label>
                  <Input type="number" step="0.01" value={formData.googleSearchSpend} onChange={(e) => setFormData({ ...formData, googleSearchSpend: parseFloat(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Conversions</Label>
                  <Input type="number" value={formData.googleSearchConversions} onChange={(e) => setFormData({ ...formData, googleSearchConversions: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Google Display Ads</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="grid gap-2">
                  <Label>Impressions</Label>
                  <Input type="number" value={formData.googleDisplayImpressions} onChange={(e) => setFormData({ ...formData, googleDisplayImpressions: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Clicks</Label>
                  <Input type="number" value={formData.googleDisplayClicks} onChange={(e) => setFormData({ ...formData, googleDisplayClicks: parseInt(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Spend ($)</Label>
                  <Input type="number" step="0.01" value={formData.googleDisplaySpend} onChange={(e) => setFormData({ ...formData, googleDisplaySpend: parseFloat(e.target.value) })} />
                </div>
                <div className="grid gap-2">
                  <Label>Conversions</Label>
                  <Input type="number" value={formData.googleDisplayConversions} onChange={(e) => setFormData({ ...formData, googleDisplayConversions: parseInt(e.target.value) })} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Saving...' : paidMedia ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
