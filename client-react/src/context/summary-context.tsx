"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

interface SummaryContextType {
  summary: string | null
  setSummary: (summary: string | null) => void
}

const SummaryContext = createContext<SummaryContextType | undefined>(undefined)

export const SummaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<string | null>(null)

  return <SummaryContext.Provider value={{ summary, setSummary }}>{children}</SummaryContext.Provider>
}

export const useSummary = () => {
  const context = useContext(SummaryContext)
  if (context === undefined) {
    throw new Error("useSummary must be used within a SummaryProvider")
  }
  return context
}
