import { createContext, useContext, useState, type ReactNode } from "react";

export interface SelectedInsurer {
  name: string;
  brand: string;
}

interface ComparisonContextType {
  insurers: SelectedInsurer[];
  addInsurer: (insurer: SelectedInsurer) => void;
  removeInsurer: (name: string) => void;
  toggleInsurer: (insurer: SelectedInsurer) => void;
  isSelected: (name: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | null>(null);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [insurers, setInsurers] = useState<SelectedInsurer[]>([]);

  const addInsurer = (insurer: SelectedInsurer) => {
    setInsurers((prev) => {
      if (prev.some((i) => i.name === insurer.name)) {
        return prev;
      }
      return [...prev, insurer];
    });
  };

  const removeInsurer = (name: string) => {
    setInsurers((prev) => prev.filter((i) => i.name !== name));
  };

  const toggleInsurer = (insurer: SelectedInsurer) => {
    if (isSelected(insurer.name)) {
      removeInsurer(insurer.name);
    } else {
      addInsurer(insurer);
    }
  };

  const isSelected = (name: string) => {
    return insurers.some((i) => i.name === name);
  };

  return (
    <ComparisonContext.Provider value={{ insurers, addInsurer, removeInsurer, toggleInsurer, isSelected }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
