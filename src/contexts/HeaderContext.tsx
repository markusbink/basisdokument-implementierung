import { createContext, MouseEventHandler, useContext, useState } from "react";
import { toast } from "react-toastify";
import { IHighlighter, ISection, IVersion, Tool } from "../types";

// Define Interfaces
interface HeaderProviderProps {
  children: React.ReactNode;
}

enum Sorting {
  Privat,
  Original,
}

export default interface IHeaderContext {
  showDropdownHeader: boolean;
  showColumnView: boolean;
  getCurrentTool: Tool;
  currentColorSelection: IHighlighter;
  searchbarValue: string;
  highlighterData: any;
  hideEntriesHighlighter: boolean;
  hideElementsWithoutSpecificVersion: boolean;
  colorSelection: IHighlighter[];
  versionHistory: IVersion[];
  selectedVersion: number;
  sectionListHeader: ISection[];
  resetPrivateSorting: () => void;
  openOnboarding: () => void;
  downloadBasisdokument: MouseEventHandler<HTMLDivElement> | undefined;
  reloadPageAndSave: MouseEventHandler<HTMLButtonElement> | undefined;
  reloadPageAndDoNotSave: MouseEventHandler<HTMLButtonElement> | undefined;
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
      red: boolean;
      orange: boolean;
      yellow: boolean;
      green: boolean;
      blue: boolean;
      purple: boolean;
    }>
  >;
  setHideEntriesHighlighter: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  setHideElementsWithoutSpecificVersion: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCurrentColorSelection: React.Dispatch<React.SetStateAction<IHighlighter>>;
  setCurrentTool: React.Dispatch<React.SetStateAction<Tool>>;
  individualSortingHeader: string[];
  setIndividualSortingHeader: React.Dispatch<React.SetStateAction<string[]>>;
}

export const HeaderContext = createContext<IHeaderContext | null>(null);

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  // Define States
  const [showDropdownHeader, setShowDropdownHeader] =
    useState<IHeaderContext["showDropdownHeader"]>(false);

  const [searchbarValue, setSearchbarValue] =
    useState<IHeaderContext["searchbarValue"]>("");

  const [showColumnView, setShowColumnView] =
    useState<IHeaderContext["showColumnView"]>(true);
  const [colorSelection, setColorSelection] = useState<
    IHeaderContext["colorSelection"]
  >([]);
  const [currentColorSelection, setCurrentColorSelection] =
    useState<IHighlighter>(colorSelection[0]);
  const [getCurrentTool, setCurrentTool] = useState<Tool>({
    id: "cursor",
    iconNode: "Cursor",
    germanTitle: "Maus",
  });
  const [highlighterData, setHighlighterData] = useState({
    red: true,
    orange: true,
    yellow: true,
    green: true,
    blue: true,
    purple: true,
  });
  const [hideEntriesHighlighter, setHideEntriesHighlighter] =
    useState<IHeaderContext["hideEntriesHighlighter"]>(false);
  const [selectedSorting, setSelectedSorting] = useState<Sorting>(
    Sorting.Original
  );

  const [individualSortingHeader, setIndividualSortingHeader] = useState<string[]>([]);

  const [
    hideElementsWithoutSpecificVersion,
    setHideElementsWithoutSpecificVersion,
  ] = useState<IHeaderContext["hideElementsWithoutSpecificVersion"]>(false);

  const [versionHistory, setVersionHistory] = useState<
    IHeaderContext["versionHistory"]
  >([]);
  const [selectedVersion, setSelectedVersion] =
    useState<IHeaderContext["selectedVersion"]>(0);
  const [sectionListHeader, setSectionListHeader] = useState<ISection[]>([]);

  const resetPrivateSorting = () => {
    console.log("reset");
  };

  const openOnboarding = () => {
    console.log("open onboarding");
  };

  const downloadBasisdokument = () => {
    toast("Basisokument wurde heruntergeladen!");
  };

  // If a new base document is to be opened and the user is taken to the home page, the page can also simply be reloaded.
  // Then the state of the components of the entire application is reset and there are no complications.
  const reloadPageAndSave = () => {
    console.log("reload page and save!");
  };

  const reloadPageAndDoNotSave = () => {
    console.log("reload page and do not save!");
    window.location.reload();
  };

  return (
    <HeaderContext.Provider
      value={{
        showDropdownHeader,
        showColumnView,
        getCurrentTool,
        currentColorSelection,
        searchbarValue,
        highlighterData,
        hideEntriesHighlighter,
        hideElementsWithoutSpecificVersion,
        colorSelection,
        versionHistory,
        selectedVersion,
        sectionListHeader,
        resetPrivateSorting,
        openOnboarding,
        downloadBasisdokument,
        reloadPageAndSave,
        reloadPageAndDoNotSave,
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
        setHideElementsWithoutSpecificVersion,
        individualSortingHeader,
        setIndividualSortingHeader,
      }}
    >
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
