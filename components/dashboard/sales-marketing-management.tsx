'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { SalesMarketingFormDialog } from '@/components/forms/sales-marketing-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SalesMarketingManagementProps {
  campaigns: any[]
}

const ITEMS_PER_PAGE = 15

export function SalesMarketingManagement({ campaigns }: SalesMarketingManagementProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate pagination
  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCampaigns = campaigns.slice(startIndex, endIndex)
  
  // Reset to page 1 when campaigns list changes
  useEffect(() => {
    setCurrentPage(1)
  }, [campaigns.length])

  const handleAdd = () => {
    setMode('create')
    setEditData(null)
    setDialogOpen(true)
  }

  const handleEdit = (campaign: any) => {
    setMode('edit')
    setEditData(campaign)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    const toastId = toast.loading('Deleting campaign...')

    try {
      const response = await fetch(`/api/sales-marketing/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast.success('Campaign deleted successfully!', { id: toastId })
      router.refresh()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign. Please try again.', { id: toastId })
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Campaign Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns
          </p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-[#2E8741] hover:bg-[#236933]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Campaign
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Week Of</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Audience</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subject/Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Open Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Click Rate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Visits</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(campaign.weekOf).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-[200px] truncate">
                      {campaign.audience || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                    <div className="max-w-[250px] truncate">
                      {campaign.subjectMessage || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {campaign.openRate !== null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {(campaign.openRate * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {campaign.clickRate !== null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {(campaign.clickRate * 100).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {campaign.micrositeVisits !== null ? campaign.micrositeVisits.toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {campaign.status ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                        {campaign.status}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => handleEdit(campaign)}
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(campaign.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <SalesMarketingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={mode}
        initialData={editData}
      />
    </>
  )
}
