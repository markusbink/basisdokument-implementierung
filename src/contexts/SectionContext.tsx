import { createContext, useContext, useState } from "react";
import { ISection} from "../types";

// Define Interfaces
interface SectionProviderProps {
  children: React.ReactNode;
}

export default interface ISectionContext {
  sectionList: ISection[];
  setSectionList: React.Dispatch<React.SetStateAction<ISection[]>>;
  individualSorting: string[];
  setIndividualSorting: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SectionContext = createContext<ISectionContext | null>(null);

export const SectionProvider: React.FC<SectionProviderProps> = ({ children }) => {
  const [sectionList, setSectionList] = useState<ISection[]>([]);
  const [individualSorting, setIndividualSorting] = useState<string[]>([]);

  return (
    <SectionContext.Provider
      value={{
        sectionList,
        setSectionList,
        individualSorting,
        setIndividualSorting
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};

export const useSection = () => {
  const context = useContext(SectionContext);
  if (context === null) {
    throw new Error("useEntries must be used within an EntryProvider");
  }
  return context;
};
