'use client'

import { Button } from '@/components/ui/button'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { useState } from 'react'
import { exportToExcel, exportToPDF, ExportOptions } from '@/lib/export-utils'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ExportButtonsProps {
  exportOptions: Omit<ExportOptions, 'data'>
  getData: () => any[]
  variant?: 'dropdown' | 'inline'
}

export function ExportButtons({ exportOptions, getData, variant = 'dropdown' }: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true)
    try {
      const data = getData()
      
      if (data.length === 0) {
        toast.error('No data to export')
        return
      }

      const fullOptions: ExportOptions = {
        ...exportOptions,
        data
      }

      if (format === 'excel') {
        exportToExcel(fullOptions)
        toast.success('Excel file downloaded successfully')
      } else {
        exportToPDF(fullOptions)
        toast.success('PDF file downloaded successfully')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error(`Failed to export ${format.toUpperCase()}`)
    } finally {
      setIsExporting(false)
    }
  }

  if (variant === 'inline') {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Export Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport('pdf')}
          disabled={isExporting}
          className="gap-2"
        >
          <FileText className="h-4 w-4 text-red-600" />
          Export PDF
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          className="gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('pdf')}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4 text-red-600" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
