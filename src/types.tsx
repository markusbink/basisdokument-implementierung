export enum UserRole {
  Plaintiff = "Kläger",
  Defendant = "Beklagter",
  Judge = "Richter",
}

export interface IEntry {
  id: string;
  version: number;
  text: string;
  author: string;
  role: "Kläger" | "Beklagter";
  section_id: string;
  associated_entry?: string;
}

export default interface IPropsHeader {
  color: { id: string; colorCode: string; label: string };
  tool: { id: string; title: string };
  headerContext: {
    caseId: string;
    showDropdownHeader: Boolean;
    showColumnView: Boolean;
    getCurrentTool: { id: string; title: string };
    currentColorSelection: { id: string; colorCode: string; label: string };
    searchbarValue: string;
    highlighterData: { red: boolean; orange: boolean; yellow: boolean; green: boolean; blue: boolean; purple: boolean };
    hideEntriesHighlighter: boolean;
    hideElementsWithoutSpecificVersion: boolean;
    selectedSorting: string;
    selectedVersion: number;
    colorSelection: { id: string; colorCode: string; label: string }[];
    versionHistory: { author: string; role: string; timestamp: string }[];
    sectionList: { id: string; title_plaintiff: string }[];
    setSectionList: React.Dispatch<React.SetStateAction<{ id: string; title_plaintiff: string }[]>>;
    setSelectedVersion: React.Dispatch<React.SetStateAction<number>>;
    setVersionHistory: React.Dispatch<React.SetStateAction<{ author: string; role: string; timestamp: string }[]>>;
    setColorSelection: React.Dispatch<React.SetStateAction<{ id: string; colorCode: string; label: string }[]>>;
    setShowColumnView: React.Dispatch<React.SetStateAction<Boolean>>;
    setCaseId: React.Dispatch<React.SetStateAction<string>>;
    setHighlighterData: React.Dispatch<React.SetStateAction<{ red: boolean; orange: boolean; yellow: boolean; green: boolean; blue: boolean; purple: boolean }>>;
    setHideEntriesHighlighter: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedSorting: React.Dispatch<React.SetStateAction<string>>;
    setHideElementsWithoutSpecificVersion: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchbarValue: React.Dispatch<React.SetStateAction<string>>;
    setShowDropdownHeader: React.Dispatch<React.SetStateAction<Boolean>>;
    setCurrentColorSelection: React.Dispatch<React.SetStateAction<{ id: string; colorCode: string }>>;
    setCurrentTool: React.Dispatch<React.SetStateAction<{ id: string; title: string }>>;
  };
}
