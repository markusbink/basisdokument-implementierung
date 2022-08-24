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
  caseId: string;
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
  sectionList: ISection[];
  resetPrivateSorting: () => void;
  openOnboarding: () => void;
  downloadBasisdokument: MouseEventHandler<HTMLDivElement> | undefined;
  reloadPageAndSave: MouseEventHandler<HTMLButtonElement> | undefined;
  reloadPageAndDoNotSave: MouseEventHandler<HTMLButtonElement> | undefined;
  setSectionList: React.Dispatch<React.SetStateAction<ISection[]>>;
  setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
  setVersionHistory: React.Dispatch<React.SetStateAction<IVersion[]>>;
  selectedSorting: Sorting;
  setColorSelection: React.Dispatch<React.SetStateAction<IHighlighter[]>>;
  setShowColumnView: React.Dispatch<React.SetStateAction<boolean>>;
  setCaseId: React.Dispatch<React.SetStateAction<string>>;
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
  const [caseId, setCaseId] =
    useState<IHeaderContext["caseId"]>("AZ. 8 0 6432/18");
  const [currentColorSelection, setCurrentColorSelection] =
    useState<IHighlighter>({
      id: "red",
      label: "Markierung 1",
    });
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
  const [
    hideElementsWithoutSpecificVersion,
    setHideElementsWithoutSpecificVersion,
  ] = useState<IHeaderContext["hideElementsWithoutSpecificVersion"]>(false);

  const highlighterColorsExample = [
    { id: "red", label: "Markierung A" },
    { id: "orange", label: "Markierung 2" },
    { id: "yellow", label: "Markierung 3" },
    { id: "green", label: "Markierung 4" },
    { id: "blue", label: "Markierung 5" },
    { id: "purple", label: "Markierung 6" },
  ];

  const [colorSelection, setColorSelection] = useState<
    IHeaderContext["colorSelection"]
  >(highlighterColorsExample);
  const [versionHistory, setVersionHistory] = useState<
    IHeaderContext["versionHistory"]
  >([]);
  const [selectedVersion, setSelectedVersion] =
    useState<IHeaderContext["selectedVersion"]>(1);
  const [sectionList, setSectionList] = useState<ISection[]>([]);

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
        caseId,
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
        sectionList,
        resetPrivateSorting,
        openOnboarding,
        downloadBasisdokument,
        reloadPageAndSave,
        reloadPageAndDoNotSave,
        setSectionList,
        setSelectedVersion,
        setVersionHistory,
        selectedSorting,
        setColorSelection,
        setShowColumnView,
        setCaseId,
        setSearchbarValue,
        setShowDropdownHeader,
        setCurrentColorSelection,
        setCurrentTool,
        setHighlighterData,
        setHideEntriesHighlighter,
        setSelectedSorting,
        setHideElementsWithoutSpecificVersion,
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
