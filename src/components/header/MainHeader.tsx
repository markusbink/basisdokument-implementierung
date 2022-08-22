import { CaretDown, CaretUp, MagnifyingGlass, Question } from "phosphor-react";
import React from "react";
import { useHeaderContext } from "../../contexts";
import { DocumentButton } from "../header/DocumentButton";
import { ColorSelector } from "./ColorSelector";
import { ToolSelector } from "./ToolSelector";

export const MainHeader = () => {
  const {
    caseId,
    searchbarValue,
    setSearchbarValue,
    setShowDropdownHeader,
    showDropdownHeader,
    getCurrentTool,
    setCurrentTool,
    openOnboarding,
  } = useHeaderContext();

  const onChangeSearchbar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchbarValue(e.target.value);
  };

  return (
    <div className="flex h-14 pl-8 pr-8 justify-between border-b-[0.5px] border-lightGrey">
      {/* actions on the left side */}
      <div className="flex flex-row gap-4 items-center">
        <DocumentButton />
        <div
          className="select-none flex flex-row justify-center items-center gap-1 bg-offWhite hover:bg-lightGrey rounded-full h-8 pl-2 pr-2 cursor-pointer"
          onClick={() => {
            setShowDropdownHeader(!showDropdownHeader);
          }}
        >
          <p className="text-sm font-bold">Ansicht</p>
          {showDropdownHeader ? (
            <CaretUp size={12} className="text-darkGrey" />
          ) : (
            <CaretDown size={12} className="text-darkGrey" />
          )}
        </div>
        <p className="font-extralight">{caseId}</p>
      </div>
      {/* searchbar */}
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="flex flex-row bg-offWhite rounded-md pl-2 pr-2 h-10 items-center">
          <input
            value={searchbarValue}
            onChange={(e) => onChangeSearchbar(e)}
            className="bg-offWhite outline-0 min-w-[300px] max-w-[400px] pl-2"
            type="text"
            placeholder="Im Basisdokument suchen..."
          />
          <MagnifyingGlass
            size={20}
            weight="bold"
            className="text-darkGrey ml-1 mr-1"
          />
        </div>
      </div>
      {/* actions on the right side */}
      <div className="flex flex-row gap-4 justify-end items-center">
        <div
          className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-14 h-10 cursor-pointer"
          onClick={openOnboarding}
        >
          <Question size={20} weight="bold" className="text-darkGrey" />
        </div>
        <ColorSelector />
        <ToolSelector
          getCurrentTool={getCurrentTool}
          setCurrentTool={setCurrentTool}
        />
      </div>
    </div>
  );
};
