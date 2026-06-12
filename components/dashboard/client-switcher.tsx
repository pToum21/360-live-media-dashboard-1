'use client'

import { useClient } from '@/contexts/client-context'
import { Check, ChevronsUpDown, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ClientSwitcher() {
  const { selectedClient, setSelectedClient, clients, isLoading } = useClient()
  const [open, setOpen] = useState(false)

  if (isLoading || !selectedClient) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        <Building2 className="h-4 w-4 animate-pulse" />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between glass-card border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#2E8741]" />
            <span className="font-medium">{selectedClient.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandEmpty>No client found.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.id}
                value={client.name}
                onSelect={() => {
                  setSelectedClient(client)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedClient.id === client.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {client.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
