'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Edit, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useReadOnly } from '@/contexts/readonly-context'

interface GA4Registration {
  id: string
  weekStarting: Date
  totalRegistrations: number | null
  organicSearch?: number | null
  email?: number | null
  direct?: number | null
  paidSocial?: number | null
  referral?: number | null
}

interface GA4RegistrationManagementProps {
  registrations: GA4Registration[]
  clientId: string
}

export function GA4RegistrationManagement({ registrations, clientId }: GA4RegistrationManagementProps) {
  const router = useRouter()
  const { isReadOnly } = useReadOnly()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [weekStarting, setWeekStarting] = useState('')
  const [totalRegistrations, setTotalRegistrations] = useState('')
  const [organicSearch, setOrganicSearch] = useState('')
  const [email, setEmail] = useState('')
  const [direct, setDirect] = useState('')
  const [paidSocial, setPaidSocial] = useState('')
  const [referral, setReferral] = useState('')

  const resetForm = () => {
    setWeekStarting('')
    setTotalRegistrations('')
    setOrganicSearch('')
    setEmail('')
    setDirect('')
    setPaidSocial('')
    setReferral('')
    setEditingId(null)
  }

  const handleEdit = (registration: GA4Registration) => {
    setEditingId(registration.id)
    setWeekStarting(new Date(registration.weekStarting).toISOString().split('T')[0])
    setTotalRegistrations(registration.totalRegistrations?.toString() || '')
    setOrganicSearch(registration.organicSearch?.toString() || '')
    setEmail(registration.email?.toString() || '')
    setDirect(registration.direct?.toString() || '')
    setPaidSocial(registration.paidSocial?.toString() || '')
    setReferral(registration.referral?.toString() || '')
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      clientId,
      weekStarting: new Date(weekStarting).toISOString(),
      totalRegistrations: parseInt(totalRegistrations) || 0,
      organicSearch: organicSearch ? parseInt(organicSearch) : null,
      email: email ? parseInt(email) : null,
      direct: direct ? parseInt(direct) : null,
      paidSocial: paidSocial ? parseInt(paidSocial) : null,
      referral: referral ? parseInt(referral) : null,
    }

    try {
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/ga4-registrations/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) throw new Error('Failed to update')
      } else {
        // Create new
        const response = await fetch('/api/ga4-registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) throw new Error('Failed to create')
      }

      setIsOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving GA4 registration:', error)
      alert('Failed to save registration data. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration data?')) return

    try {
      const response = await fetch(`/api/ga4-registrations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      router.refresh()
    } catch (error) {
      console.error('Error deleting GA4 registration:', error)
      alert('Failed to delete registration data. Please try again.')
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}>
        {!isReadOnly && (
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add GA4 Registration Data
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit' : 'Add'} GA4 Registration Data</DialogTitle>
            <DialogDescription>
              Enter weekly registration data broken down by traffic source
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="weekStarting">Week Starting Date *</Label>
                <Input
                  id="weekStarting"
                  type="date"
                  value={weekStarting}
                  onChange={(e) => setWeekStarting(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="totalRegistrations">Total Registrations *</Label>
                <Input
                  id="totalRegistrations"
                  type="number"
                  min="0"
                  value={totalRegistrations}
                  onChange={(e) => setTotalRegistrations(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organicSearch">Organic Search Registrations</Label>
                <Input
                  id="organicSearch"
                  type="number"
                  min="0"
                  value={organicSearch}
                  onChange={(e) => setOrganicSearch(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Registrations</Label>
                <Input
                  id="email"
                  type="number"
                  min="0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="direct">Direct Registrations</Label>
                <Input
                  id="direct"
                  type="number"
                  min="0"
                  value={direct}
                  onChange={(e) => setDirect(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paidSocial">Paid Social Registrations</Label>
                <Input
                  id="paidSocial"
                  type="number"
                  min="0"
                  value={paidSocial}
                  onChange={(e) => setPaidSocial(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="referral">Referral Registrations</Label>
                <Input
                  id="referral"
                  type="number"
                  min="0"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  resetForm()
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Week Starting</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Organic Search</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Direct</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Paid Social</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Referral</th>
                {!isReadOnly && <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No GA4 registration data yet. Click &quot;Add GA4 Registration Data&quot; to get started.
                  </td>
                </tr>
              ) : (
                registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(registration.weekStarting).toLocaleDateString()}
                    </td>
                    <td className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {registration.totalRegistrations?.toLocaleString() || '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.organicSearch?.toLocaleString() || '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.email?.toLocaleString() || '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.direct?.toLocaleString() || '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.paidSocial?.toLocaleString() || '-'}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                      {registration.referral?.toLocaleString() || '-'}
                    </td>
                    {!isReadOnly && (
                      <td className="text-right py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(registration)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
