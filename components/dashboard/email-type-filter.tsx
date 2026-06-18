'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface EmailTypeFilterProps {
  currentType?: string
}

const EMAIL_TYPES = [
  { value: 'all', label: 'All Emails' },
  { value: 'Registration Email', label: 'Registration Email' },
  { value: 'Nurture Email', label: 'Nurture Email' },
  { value: 'Call for Content Email', label: 'Call for Content Email' },
  { value: 'Awareness Email', label: 'Awareness Email' },
]

export function EmailTypeFilter({ currentType = 'all' }: EmailTypeFilterProps) {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState(currentType)

  // Sync internal state with prop changes (e.g., when navigating back/forward)
  useEffect(() => {
    setSelectedType(currentType)
  }, [currentType])

  const handleChange = (type: string) => {
    setSelectedType(type)
    if (type === 'all') {
      router.push('/dashboard/email')
    } else {
      router.push(`/dashboard/email?type=${encodeURIComponent(type)}`)
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="emailType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filter by:
      </label>
      <select
        id="emailType"
        value={selectedType}
        onChange={(e) => handleChange(e.target.value)}
        className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
      >
        {EMAIL_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  )
}
