import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

export function exportToCSV(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const csv = XLSX.utils.sheet_to_csv(worksheet)
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
}

// Format data for export
export function formatDataForExport(data: any[], type: 'website' | 'email' | 'social' | 'client' | 'test') {
  switch (type) {
    case 'website':
      return data.map(item => ({
        'Week Starting': new Date(item.weekStarting).toLocaleDateString(),
        'Total Users': item.totalUsers || 0,
        'New Users': item.newUsers || 0,
        'Avg Engagement (sec)': item.avgEngagementTimeSec || 0,
        'Health Score': item.healthScore || 0,
        'Direct': item.direct || 0,
        'Organic Search': item.organicSearch || 0,
        'Referral': item.referral || 0,
        'Organic Social': item.organicSocial || 0,
        'Email': item.email || 0,
      }))
    
    case 'email':
      return data.map(item => ({
        'Deployment Date': new Date(item.deploymentDate).toLocaleDateString(),
        'Campaign Name': item.name,
        'Open Rate': `${(item.openRate * 100).toFixed(2)}%`,
        'Click Rate': `${(item.clickRate * 100).toFixed(2)}%`,
        'Delivery Rate': `${(item.deliveryRate * 100).toFixed(2)}%`,
        'Unsubscribe Rate': `${(item.unsubscribeRate * 100).toFixed(2)}%`,
      }))
    
    case 'social':
      return data.map(item => ({
        'Week Starting': new Date(item.weekStarting).toLocaleDateString(),
        'LI Followers': item.liFollowers || 0,
        'LI Impressions': item.liImpressions || 0,
        'LI Engagement Rate': item.liEngagementRate ? `${(item.liEngagementRate * 100).toFixed(2)}%` : '0%',
        'IG Followers': item.igFollowers || 0,
        'IG Impressions': item.igImpressions || 0,
        'IG Engagement Rate': item.igEngagementRate ? `${(item.igEngagementRate * 100).toFixed(2)}%` : '0%',
      }))
    
    case 'client':
      return data.map(item => ({
        'Client Name': item.name,
        'Event Name': item.eventName || '',
        'UTM Tracking': item.utmTracking ? 'Yes' : 'No',
        'Conversion Tracking': item.conversionTracking ? 'Yes' : 'No',
      }))
    
    case 'test':
      return data.map(item => ({
        'Month': new Date(item.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        'Channel': item.channel || '',
        'Test Description': item.testDescription || '',
        'Results': item.results || '',
      }))
    
    default:
      return data
  }
}
