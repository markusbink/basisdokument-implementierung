import React, { useState, createContext } from "react";
import { MainHeader } from "./header/MainHeader";
import { DropdownHeader } from "./header/DropdownHeader";

export const Context = createContext({});

interface IProps {
  showDropdownHeader: Boolean;
  setShowDropdownHeader: React.Dispatch<React.SetStateAction<Boolean>>;
}

export interface IState {
  color: { id: string; colorCode: string };
  tool: { id: string; title: string };
}

export const Header = () => {
  const [showDropdownHeader, setShowDropdownHeader] = useState<Boolean>(false);
  const [searchbarValue, setSearchbarValue] = useState<string>("");
  const [showColumnView, setShowColumnView] = useState<Boolean>(false);
  const [caseId, setCaseId] = useState<string>("AZ. 8 0 6432/18");
  const [currentColorSelection, setCurrentColorSelection] = useState<IState["color"]>({
    id: "red",
    colorCode: "bg-marker-red",
  });
  const [getCurrentTool, setCurrentTool] = useState<IState["tool"]>({ id: "cursor", title: "Cursor" });
  const [highlighterData, setHighlighterData] = useState({ red: true, orange: true, yellow: true, green: true, blue: true, purple: true });
  const [hideEntriesHighlighter, setHideEntriesHighlighter] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState<string>("Original");
  const [hideElementsWithoutSpecificVersion, setHideElementsWithoutSpecificVersion] = useState(false);

  const headerContext = {
    caseId,
    showDropdownHeader,
    showColumnView,
    getCurrentTool,
    currentColorSelection,
    searchbarValue,
    highlighterData,
    hideEntriesHighlighter,
    hideElementsWithoutSpecificVersion,
    selectedSorting, 
    setShowColumnView,
    setCaseId,
    setSearchbarValue,
    setShowDropdownHeader,
    setCurrentColorSelection,
    setCurrentTool,
    setHighlighterData,
    setHideEntriesHighlighter,
    setSelectedSorting,
    setHideElementsWithoutSpecificVersion
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
