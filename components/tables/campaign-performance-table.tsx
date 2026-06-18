'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  deploymentDate: Date
  openRate: number
  clickRate: number
  deliveryRate: number
  unsubscribeRate: number
}

interface CampaignPerformanceTableProps {
  campaigns: Campaign[]
}

const ITEMS_PER_PAGE = 20

export function CampaignPerformanceTable({ campaigns }: CampaignPerformanceTableProps) {
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

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No campaigns found</p>
        <p className="text-xs mt-2">Try adjusting your filters or add a new campaign</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Campaign Name</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Deployment Date</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Open Rate</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Click Rate</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Delivery Rate</th>
              <th className="text-right py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">Unsub. Rate</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{campaign.name}</td>
                <td className="text-right py-3 px-4 text-gray-900 dark:text-gray-100">
                  {new Date(campaign.deploymentDate).toLocaleDateString()}
                </td>
                <td className="text-right py-3 px-4">
                  <span className={campaign.openRate >= 0.15 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}>
                    {(campaign.openRate * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <span className={campaign.clickRate >= 0.025 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}>
                    {(campaign.clickRate * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <span className={campaign.deliveryRate >= 0.99 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                    {(campaign.deliveryRate * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="text-right py-3 px-4">
                  <span className={campaign.unsubscribeRate <= 0.005 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600 dark:text-red-400'}>
                    {(campaign.unsubscribeRate * 100).toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 relative z-10">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns | Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="dark:hover:bg-gray-700 cursor-pointer"
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
                    type="button"
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-[#2E8741] hover:bg-[#236933] cursor-pointer" : "dark:hover:bg-gray-700 cursor-pointer"}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="dark:hover:bg-gray-700 cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
