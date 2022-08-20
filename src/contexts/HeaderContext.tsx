import { createContext, MouseEventHandler, useContext, useState } from "react";
import { toast } from "react-toastify";

// Define Interfaces
interface HeaderProviderProps {
  children: React.ReactNode;
}

enum Sorting {
  Privat,
  Original,
}

interface IHeaderContext {
  caseId: string;
  username: string;
  userParty: string;
  showDropdownHeader: boolean;
  showColumnView: boolean;
  getCurrentTool: { id: string; title: string };
  currentColorSelection: { id: string; colorCode: string; label: string };
  searchbarValue: string;
  highlighterData: { red: boolean; orange: boolean; yellow: boolean; green: boolean; blue: boolean; purple: boolean };
  hideEntriesHighlighter: boolean;
  hideElementsWithoutSpecificVersion: boolean;
  colorSelection: { id: string; colorCode: string; label: string }[];
  versionHistory: { author: string; role: string; timestamp: string }[];
  selectedVersion: number;
  sectionList: { id: string; title_plaintiff: string }[];
  resetPrivateSorting: () => void;
  openOnboarding: () => void;
  downloadBasisdokument: MouseEventHandler<HTMLDivElement> | undefined;
  reloadPageAndSave: MouseEventHandler<HTMLButtonElement> | undefined;
  reloadPageAndDoNotSave: MouseEventHandler<HTMLButtonElement> | undefined;
  setUserParty: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setSectionList: React.Dispatch<React.SetStateAction<{ id: string; title_plaintiff: string }[]>>;
  setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
  setVersionHistory: React.Dispatch<React.SetStateAction<{ author: string; role: string; timestamp: string }[]>>;
  selectedSorting: Sorting;
  setColorSelection: React.Dispatch<React.SetStateAction<{ id: string; colorCode: string; label: string }[]>>;
  setShowColumnView: React.Dispatch<React.SetStateAction<boolean>>;
  setCaseId: React.Dispatch<React.SetStateAction<string>>;
  setSearchbarValue: React.Dispatch<React.SetStateAction<string>>;
  setShowDropdownHeader: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlighterData: React.Dispatch<React.SetStateAction<{ red: boolean; orange: boolean; yellow: boolean; green: boolean; blue: boolean; purple: boolean }>>;
  setHideEntriesHighlighter: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  setHideElementsWithoutSpecificVersion: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentColorSelection: React.Dispatch<React.SetStateAction<{ id: string; colorCode: string; label: string }>>;
  setCurrentTool: React.Dispatch<React.SetStateAction<{ id: string; title: string }>>;
}

// Define States
const [showDropdownHeader, setShowDropdownHeader] = useState<boolean>(false);
const [username, setUsername] = useState<string>("Max Mustermann");
const [userParty, setUserParty] = useState<string>("Beklagtenpartei");
const [searchbarValue, setSearchbarValue] = useState<string>("");
const [showColumnView, setShowColumnView] = useState<boolean>(false);
const [caseId, setCaseId] = useState<string>("AZ. 8 0 6432/18");
const [currentColorSelection, setCurrentColorSelection] = useState<{ id: string; colorCode: string; label: string }>({
  id: "red",
  colorCode: "bg-marker-red",
  label: "Markierung 1",
});
const [getCurrentTool, setCurrentTool] = useState<{ id: string; title: string }>({ id: "cursor", title: "Cursor" });
const [highlighterData, setHighlighterData] = useState({ red: true, orange: true, yellow: true, green: true, blue: true, purple: true });
const [hideEntriesHighlighter, setHideEntriesHighlighter] = useState(false);
const [selectedSorting, setSelectedSorting] = useState<Sorting>(Sorting.Original);
const [hideElementsWithoutSpecificVersion, setHideElementsWithoutSpecificVersion] = useState(false);
// This data needs to be extracted from the json later
const highlighterColorsExample = [
  { id: "red", colorCode: "bg-marker-red", label: "Markierung A" },
  { id: "orange", colorCode: "bg-marker-orange", label: "Markierung 2" },
  { id: "yellow", colorCode: "bg-marker-yellow", label: "Markierung 3" },
  { id: "green", colorCode: "bg-marker-green", label: "Markierung 4" },
  { id: "blue", colorCode: "bg-marker-blue", label: "Markierung 5" },
  { id: "purple", colorCode: "bg-marker-purple", label: "Markierung 6" },
];
const versionHistoryExample: IHeaderContext["versionHistory"] = [
  {
    author: "Max Mustermann",
    role: "Kläger",
    timestamp: "06/05/2022 14:09:24",
  },
  {
    author: "Michael Bauer",
    role: "Beklagter",
    timestamp: "07/05/2022 14:09:24",
  },
];
const sectionsExample = [
  { id: "2b835162-1d32-11ed-861d-0242ac120001", title_plaintiff: "Verstoß gegen §113" },
  { id: "2b835162-1d32-11ed-861d-0242ac120002", title_plaintiff: "Verstoß gegen §323" },
  { id: "2b835162-1d32-11ed-861d-0242ac120003", title_plaintiff: "Verstoß gegen §14" },
  { id: "2b835162-1d32-11ed-861d-0242ac120004", title_plaintiff: "Verstoß gegen §44" },
  { id: "2b835162-1d32-11ed-861d-0242ac120005", title_plaintiff: "Verstoß gegen §86" },
  { id: "2b835162-1d32-11ed-861d-0242ac120006", title_plaintiff: "Verstoß gegen §32" },
  { id: "2b835162-1d32-11ed-861d-0242ac120007", title_plaintiff: "Verstoß gegen §13" },
];

const [colorSelection, setColorSelection] = useState<IHeaderContext["colorSelection"]>(highlighterColorsExample);
const [versionHistory, setVersionHistory] = useState<IHeaderContext["versionHistory"]>(versionHistoryExample);
const [selectedVersion, setSelectedVersion] = useState<IHeaderContext["selectedVersion"]>(1);
const [sectionList, setSectionList] = useState<IHeaderContext["sectionList"]>(sectionsExample);

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

export const HeaderContext = createContext<IHeaderContext | null>(null);

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  return (
    <HeaderContext.Provider
      value={{
        caseId,
        username,
        userParty,
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
        setUserParty,
        setUsername,
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
