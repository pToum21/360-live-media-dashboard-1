'use client'

import { useState } from 'react'
import { Check, ChevronDown, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export interface FilterOption {
  id: string
  label: string
  value: string
  color?: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  multiSelect?: boolean
}

interface ChartFiltersProps {
  filterGroups: FilterGroup[]
  selectedFilters: Record<string, string[]>
  onFilterChange: (groupId: string, selectedValues: string[]) => void
  onClearAll?: () => void
}

export function ChartFilters({
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: ChartFiltersProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  const getTotalSelectedCount = () => {
    return Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0)
  }

  const handleToggleOption = (groupId: string, optionValue: string, multiSelect: boolean) => {
    const currentSelected = selectedFilters[groupId] || []
    
    if (multiSelect) {
      // Multi-select: toggle the option
      const newSelected = currentSelected.includes(optionValue)
        ? currentSelected.filter(v => v !== optionValue)
        : [...currentSelected, optionValue]
      onFilterChange(groupId, newSelected)
    } else {
      // Single-select: replace with new value or clear if clicking the same
      const newSelected = currentSelected[0] === optionValue ? [] : [optionValue]
      onFilterChange(groupId, newSelected)
      setOpenPopover(null)
    }
  }

  const getGroupSelectedCount = (groupId: string) => {
    return (selectedFilters[groupId] || []).length
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Filter className="w-4 h-4" />
        <span>Filters:</span>
      </div>

      {filterGroups.map((group) => {
        const selectedCount = getGroupSelectedCount(group.id)
        const isOpen = openPopover === group.id

        return (
          <Popover
            key={group.id}
            open={isOpen}
            onOpenChange={(open) => setOpenPopover(open ? group.id : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`
                  relative glass-card border-gray-200 dark:border-gray-700
                  hover:border-[#2E8741] dark:hover:border-[#84BE41]
                  transition-all duration-200
                  ${selectedCount > 0 ? 'border-[#2E8741] dark:border-[#84BE41] bg-green-50/50 dark:bg-green-900/20' : ''}
                `}
              >
                <span className="mr-2">{group.label}</span>
                {selectedCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#2E8741] text-white text-xs"
                  >
                    {selectedCount}
                  </Badge>
                )}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 glass-card border-gray-200 dark:border-gray-700" align="start">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{group.label}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {group.multiSelect ? 'Select multiple options' : 'Select one option'}
                </p>
              </div>
              <div className="p-2 max-h-64 overflow-y-auto">
                {group.options.map((option) => {
                  const isSelected = (selectedFilters[group.id] || []).includes(option.value)
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleToggleOption(group.id, option.value, group.multiSelect || false)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-sm text-left transition-colors
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        ${isSelected ? 'bg-green-50 dark:bg-green-900/20' : ''}
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-5 h-5 rounded border-2
                        transition-all duration-200
                        ${isSelected 
                          ? 'bg-[#2E8741] border-[#2E8741] dark:bg-[#84BE41] dark:border-[#84BE41]' 
                          : 'border-gray-300 dark:border-gray-600'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                      {option.color && (
                        <div
                          className="w-3 h-3 rounded-full shadow"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className={`flex-1 ${isSelected ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        )
      })}

      {getTotalSelectedCount() > 0 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        >
          <X className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      )}
    </div>
  )
}
