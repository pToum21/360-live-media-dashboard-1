import { BetaAnalyticsDataClient } from '@google-analytics/data'

interface GoogleAnalyticsConfig {
  propertyId: string
  credentials: any
}

export class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient
  private propertyId: string

  constructor(config: GoogleAnalyticsConfig) {
    this.client = new BetaAnalyticsDataClient({
      credentials: config.credentials,
    })
    this.propertyId = config.propertyId
  }

  async getWebsiteMetrics(startDate: string, endDate: string) {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          {
            name: 'date',
          },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      })

      // Get traffic sources
      const [trafficResponse] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          {
            name: 'sessionDefaultChannelGroup',
          },
        ],
        metrics: [
          { name: 'sessions' },
        ],
      })

      return {
        metrics: response.rows,
        traffic: trafficResponse.rows,
      }
    } catch (error) {
      console.error('Google Analytics API Error:', error)
      throw error
    }
  }

  formatMetricsForDatabase(data: any) {
    // Transform GA4 data to our database format
    const metrics: any[] = []
    
    if (data.metrics) {
      data.metrics.forEach((row: any) => {
        const date = row.dimensionValues?.[0]?.value
        const values = row.metricValues

        metrics.push({
          weekStarting: new Date(date),
          totalUsers: parseInt(values[0]?.value || '0'),
          newUsers: parseInt(values[1]?.value || '0'),
          avgEngagementTimeSec: parseInt(values[4]?.value || '0'),
          // Map other fields
        })
      })
    }

    // Map traffic sources
    const traffic: any = {}
    if (data.traffic) {
      data.traffic.forEach((row: any) => {
        const channel = row.dimensionValues?.[0]?.value?.toLowerCase()
        const sessions = parseInt(row.metricValues[0]?.value || '0')
        
        switch (channel) {
          case 'direct':
            traffic.direct = sessions
            break
          case 'organic search':
            traffic.organicSearch = sessions
            break
          case 'referral':
            traffic.referral = sessions
            break
          case 'organic social':
            traffic.organicSocial = sessions
            break
          case 'email':
            traffic.email = sessions
            break
        }
      })
    }

    return metrics.map(m => ({ ...m, ...traffic }))
  }
}
