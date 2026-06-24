import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export interface ExportColumn {
  header: string
  key: string
  formatter?: (value: any) => string
}

export interface ExportOptions {
  filename: string
  title: string
  columns: ExportColumn[]
  data: any[]
}

/**
 * Export data to Excel (.xlsx) format
 */
export function exportToExcel({ filename, title, columns, data }: ExportOptions) {
  try {
    // Transform data based on column configuration
    const transformedData = data.map(row => {
      const transformedRow: any = {}
      columns.forEach(col => {
        const value = row[col.key]
        transformedRow[col.header] = col.formatter 
          ? col.formatter(value) 
          : value ?? '-'
      })
      return transformedRow
    })

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(transformedData)

    // Set column widths
    const columnWidths = columns.map(col => ({
      wch: Math.max(col.header.length + 2, 15)
    }))
    ws['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, title)

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    saveAs(blob, `${filename}.xlsx`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export to Excel')
  }
}

/**
 * Export data to PDF format with table
 */
export function exportToPDF({ filename, title, columns, data }: ExportOptions) {
  try {
    const doc = new jsPDF({
      orientation: columns.length > 6 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Add title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 14, 15)

    // Add timestamp
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22)

    // Transform data for PDF table
    const tableData = data.map(row => {
      return columns.map(col => {
        const value = row[col.key]
        return col.formatter 
          ? col.formatter(value) 
          : (value ?? '-').toString()
      })
    })

    // Generate table
    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: 28,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [46, 135, 65], // #2E8741 - brand green
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 28, left: 14, right: 14 },
    })

    // Save PDF
    doc.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Failed to export to PDF')
  }
}

/**
 * Format date for export
 */
export function formatDateForExport(date: Date | string | null | undefined): string {
  if (!date) return '-'
  try {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch {
    return '-'
  }
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format percentage for export
 */
export function formatPercentageForExport(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Format number for export
 */
export function formatNumberForExport(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('en-US')
}
