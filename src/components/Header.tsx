import { useState, createContext } from "react";
import { MainHeader } from "./header/MainHeader";
import { DropdownHeader } from "./header/DropdownHeader";
import IPropsHeader from "../types";

export const Context = createContext({});

export const Header = () => {
  const [showDropdownHeader, setShowDropdownHeader] = useState<Boolean>(false);
  const [searchbarValue, setSearchbarValue] = useState<string>("");
  const [showColumnView, setShowColumnView] = useState<Boolean>(false);
  const [caseId, setCaseId] = useState<string>("AZ. 8 0 6432/18");
  const [currentColorSelection, setCurrentColorSelection] = useState<IPropsHeader["color"]>({
    id: "red",
    colorCode: "bg-marker-red",
    label: "Markierung 1",
  });
  const [getCurrentTool, setCurrentTool] = useState<IPropsHeader["tool"]>({ id: "cursor", title: "Cursor" });
  const [highlighterData, setHighlighterData] = useState({ red: true, orange: true, yellow: true, green: true, blue: true, purple: true });
  const [hideEntriesHighlighter, setHideEntriesHighlighter] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState<string>("Original");
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
  const versionHistoryExample = [
    {
      author: "Max Mustermann",
      role: "Kläger",
      timestamp: "06/05/2022 14:09:24",
    },
    {
      author: "Marta Braun",
      role: "Richter",
      timestamp: "07/05/2022 19:45:39",
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

  const [colorSelection, setColorSelection] = useState<IPropsHeader["headerContext"]["colorSelection"]>(highlighterColorsExample);
  const [versionHistory, setVersionHistory] = useState<IPropsHeader["headerContext"]["versionHistory"]>(versionHistoryExample);
  const [selectedVersion, setSelectedVersion] = useState<IPropsHeader["headerContext"]["selectedVersion"]>(1);
  const [sectionList, setSectionList] = useState<IPropsHeader["headerContext"]["sectionList"]>(sectionsExample);

  const resetPrivateSorting = () => {
    console.log("reset");
  };

  const openOnboarding = () => {
    console.log("open onboarding");
  };

  var headerContext = {
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
  };

  return (
    <Context.Provider value={headerContext}>
      <header className="text-darkGrey">
        {/* main part of the header */}
        <MainHeader headerContext={headerContext} />
        {/* fold-out part of the header */}
        {showDropdownHeader ? <DropdownHeader headerContext={headerContext} /> : null}
      </header>
    </Context.Provider>
  );
};
