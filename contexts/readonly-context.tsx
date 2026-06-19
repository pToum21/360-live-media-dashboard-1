'use client'

import { createContext, useContext, ReactNode } from 'react'

interface ReadOnlyContextType {
  isReadOnly: boolean
}

const ReadOnlyContext = createContext<ReadOnlyContextType | undefined>(undefined)

export function ReadOnlyProvider({ children, isReadOnly }: { children: ReactNode; isReadOnly: boolean }) {
  return (
    <ReadOnlyContext.Provider value={{ isReadOnly }}>
      {children}
    </ReadOnlyContext.Provider>
  )
}

export function useReadOnly() {
  const context = useContext(ReadOnlyContext)
  if (context === undefined) {
    throw new Error('useReadOnly must be used within a ReadOnlyProvider')
  }
  return context
}
