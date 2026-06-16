'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Client {
  id: string
  name: string
  slug: string
}

interface ClientContextType {
  selectedClient: Client | null
  setSelectedClient: (client: Client) => void
  clients: Client[]
  isLoading: boolean
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClient, setSelectedClientState] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch available clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients/list')
        const data = await response.json()
        setClients(data)

        // Check localStorage for saved client preference
        const savedClientId = localStorage.getItem('selectedClientId')
        const savedClient = data.find((c: Client) => c.id === savedClientId)

        // Use saved client or default to first client
        const clientToUse = savedClient || data[0] || null
        setSelectedClientState(clientToUse)
        
        // Set cookies for server-side access
        if (clientToUse) {
          document.cookie = `selectedClientId=${clientToUse.id}; path=/; max-age=31536000`
          document.cookie = `selectedClient=${clientToUse.slug}; path=/; max-age=31536000`
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const setSelectedClient = (client: Client) => {
    setSelectedClientState(client)
    localStorage.setItem('selectedClientId', client.id)
    // Set cookies for server-side access - use SLUG for selectedClient!
    document.cookie = `selectedClientId=${client.id}; path=/; max-age=31536000`
    document.cookie = `selectedClient=${client.slug}; path=/; max-age=31536000`
    // Trigger a page reload to fetch new data for the selected client
    window.location.reload()
  }

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        clients,
        isLoading,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}
