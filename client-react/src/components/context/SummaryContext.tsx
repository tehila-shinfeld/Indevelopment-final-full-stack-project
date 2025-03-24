import { createContext, useContext, useState, ReactNode } from "react";

type SummaryContextType = {
  summary: string | null;
  setSummary: (summary: string | null) => void;
};

const SummaryContext = createContext<SummaryContextType | undefined>(undefined);

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummary] = useState<string | null>(null);
  return (
    <SummaryContext.Provider value={{ summary, setSummary }}>
      {children}
    </SummaryContext.Provider>
  );
};

export const useSummary = () => {
  const context = useContext(SummaryContext);
  if (!context) throw new Error("useSummary must be used within a SummaryProvider");
  return context;
};
