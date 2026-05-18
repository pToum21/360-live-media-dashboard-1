'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { exportToExcel, exportToCSV, formatDataForExport } from '@/lib/export'
import { toast } from 'sonner'

interface ExportButtonProps {
  data: any[]
  filename: string
  type: 'website' | 'email' | 'social' | 'client' | 'test'
}

export function ExportButton({ data, filename, type }: ExportButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: 'excel' | 'csv') => {
    if (data.length === 0) {
      toast.error('No data to export')
      return
    }

    setLoading(true)
    const toastId = toast.loading(`Exporting to ${format.toUpperCase()}...`)

    try {
      const formattedData = formatDataForExport(data, type)
      
      if (format === 'excel') {
        exportToExcel(formattedData, filename)
      } else {
        exportToCSV(formattedData, filename)
      }

      toast.success(`Data exported successfully!`, { id: toastId })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading} className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2">
          <FileText className="h-4 w-4 text-blue-600" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
