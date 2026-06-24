'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { EmailFormDialog } from '@/components/forms/email-form-dialog'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useReadOnly } from '@/contexts/readonly-context'
import { ExportButtons } from '@/components/ui/export-buttons'
import { formatDateForExport, formatPercentageForExport, formatNumberForExport } from '@/lib/export-utils'

interface EmailManagementProps {
  campaigns: any[]
}

const ITEMS_PER_PAGE = 15

export function EmailManagement({ campaigns }: EmailManagementProps) {
  const router = useRouter()
  const { isReadOnly } = useReadOnly()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate pagination
  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCampaigns = campaigns.slice(startIndex, endIndex)
  
  // Reset to page 1 when campaigns list changes (e.g., after filtering)
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
      const response = await fetch(`/api/email/${id}`, {
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Campaign Management</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing {startIndex + 1}-{Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns
          </p>
        </div>
        {!isReadOnly && (
          <div className="flex gap-2">
            <ExportButtons
              exportOptions={{
                filename: 'email-campaigns',
                title: 'Email Campaigns',
                columns: [
                  { header: 'Campaign Name', key: 'name' },
                  { header: 'Type', key: 'campaignType' },
                  { header: 'Deployment Date', key: 'deploymentDate', formatter: formatDateForExport },
                  { header: 'Total Sent', key: 'totalSent', formatter: formatNumberForExport },
                  { header: 'Open Rate', key: 'openRate', formatter: formatPercentageForExport },
                  { header: 'Click Rate', key: 'clickRate', formatter: formatPercentageForExport },
                  { header: 'Delivery Rate', key: 'deliveryRate', formatter: formatPercentageForExport },
                  { header: 'Unsubscribe Rate', key: 'unsubscribeRate', formatter: formatPercentageForExport },
                  { header: 'Subject Line', key: 'subjectLine' },
                ]
              }}
              getData={() => campaigns}
            />
            <Button 
              onClick={handleAdd}
              className="bg-[#2E8741] hover:bg-[#236933]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Campaign
            </Button>
          </div>
        )}
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No campaigns found</p>
          {!isReadOnly && (
            <Button 
              onClick={handleAdd}
              className="bg-[#2E8741] hover:bg-[#236933]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Campaign
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover-glass-shine transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{campaign.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(campaign.deploymentDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              {!isReadOnly && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                    className="dark:hover:bg-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Open Rate</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{((campaign.openRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Click Rate</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{((campaign.clickRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Delivery Rate</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{((campaign.deliveryRate || 0) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Unsubscribe Rate</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{((campaign.unsubscribeRate || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Pagination Controls */}
      {campaigns.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show first page, last page, current page, and pages around current
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-[#2E8741] hover:bg-[#236933]" : "dark:hover:bg-gray-700"}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="dark:hover:bg-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <EmailFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        data={editData}
        mode={mode}
      />
    </>
  )
}
