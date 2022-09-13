import { createContext, useContext, useState } from "react";
import {
  IHighlighter,
  ISection,
  IVersion,
  Sorting,
  ITool,
  Tool,
} from "../types";

// Define Interfaces
interface HeaderProviderProps {
  children: React.ReactNode;
}

export default interface IHeaderContext {
  selectedTheme: string;
  showDropdownHeader: boolean;
  showColumnView: boolean;
  getCurrentTool: ITool;
  currentColorSelection: IHighlighter;
  searchbarValue: string;
  highlighterData: any;
  hideEntriesHighlighter: boolean;
  highlightElementsWithSpecificVersion: boolean;
  colorSelection: IHighlighter[];
  versionHistory: IVersion[];
  selectedVersion: number;
  sectionListHeader: ISection[];
  setSelectedTheme: React.Dispatch<React.SetStateAction<string>>;
  setSectionListHeader: React.Dispatch<React.SetStateAction<ISection[]>>;
  setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
  setVersionHistory: React.Dispatch<React.SetStateAction<IVersion[]>>;
  selectedSorting: Sorting;
  setColorSelection: React.Dispatch<React.SetStateAction<IHighlighter[]>>;
  setShowColumnView: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchbarValue: React.Dispatch<React.SetStateAction<string>>;
  setShowDropdownHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlighterData: React.Dispatch<
    React.SetStateAction<{
      yellow: boolean;
      orange: boolean;
      red: boolean;
      purple: boolean;
      blue: boolean;
      green: boolean;
    }>
  >;
  setHideEntriesHighlighter: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  setHighlightElementsWithSpecificVersion: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCurrentColorSelection: React.Dispatch<React.SetStateAction<IHighlighter>>;
  setCurrentTool: React.Dispatch<React.SetStateAction<ITool>>;
}

export const HeaderContext = createContext<IHeaderContext | null>(null);

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  // Define States
  const [showDropdownHeader, setShowDropdownHeader] =
    useState<IHeaderContext["showDropdownHeader"]>(false);

  const [searchbarValue, setSearchbarValue] =
    useState<IHeaderContext["searchbarValue"]>("");

  const [selectedTheme, setSelectedTheme] =
    useState<IHeaderContext["selectedTheme"]>("lavender");

  const [showColumnView, setShowColumnView] =
    useState<IHeaderContext["showColumnView"]>(true);
  const [colorSelection, setColorSelection] = useState<
    IHeaderContext["colorSelection"]
  >([]);
  const [currentColorSelection, setCurrentColorSelection] =
    useState<IHighlighter>(colorSelection[0]);
  const [getCurrentTool, setCurrentTool] = useState<ITool>({
    id: Tool.Cursor,
    iconNode: "Cursor",
    germanTitle: "Maus",
  });
  const [highlighterData, setHighlighterData] = useState({
    yellow: true,
    orange: true,
    red: true,
    purple: true,
    blue: true,
    green: true,
  });
  const [hideEntriesHighlighter, setHideEntriesHighlighter] =
    useState<IHeaderContext["hideEntriesHighlighter"]>(false);
  const [selectedSorting, setSelectedSorting] = useState<Sorting>(
    Sorting.Original
  );

  const [
    highlightElementsWithSpecificVersion,
    setHighlightElementsWithSpecificVersion,
  ] = useState<IHeaderContext["highlightElementsWithSpecificVersion"]>(false);

  const [versionHistory, setVersionHistory] = useState<
    IHeaderContext["versionHistory"]
  >([]);
  const [selectedVersion, setSelectedVersion] =
    useState<IHeaderContext["selectedVersion"]>(0);
  const [sectionListHeader, setSectionListHeader] = useState<ISection[]>([]);

  return (
    <HeaderContext.Provider
      value={{
        selectedTheme,
        showDropdownHeader,
        showColumnView,
        getCurrentTool,
        currentColorSelection,
        searchbarValue,
        highlighterData,
        hideEntriesHighlighter,
        highlightElementsWithSpecificVersion,
        colorSelection,
        versionHistory,
        selectedVersion,
        sectionListHeader,
        setSelectedTheme,
        setSectionListHeader,
        setSelectedVersion,
        setVersionHistory,
        selectedSorting,
        setColorSelection,
        setShowColumnView,
        setSearchbarValue,
        setShowDropdownHeader,
        setCurrentColorSelection,
        setCurrentTool,
        setHighlighterData,
        setHideEntriesHighlighter,
        setSelectedSorting,
        setHighlightElementsWithSpecificVersion,
      }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (context === null) {
    throw new Error("useEntries must be used within an EntryProvider");
  }
  return context;
};
