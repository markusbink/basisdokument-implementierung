import {
  CaretDown,
  CaretUp,
  MagnifyingGlass,
  Question,
  XCircle,
} from "phosphor-react";
import React, { KeyboardEvent } from "react";
import { useCase, useHeaderContext } from "../../contexts";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { DocumentButton } from "../header/DocumentButton";
import { ColorSelector } from "./ColorSelector";
import { ToolSelector } from "./ToolSelector";
import cx from "classnames";
import { Tooltip } from "../Tooltip";

export const MainHeader = () => {
  const {
    searchbarValue,
    setSearchbarValue,
    setShowDropdownHeader,
    showDropdownHeader,
    getCurrentTool,
    setCurrentTool,
  } = useHeaderContext();
  const { caseId } = useCase();
  const { setIsOnboardingVisible } = useOnboarding();

  const onChangeSearchbar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchbarValue(e.target.value);
  };

  const onHandleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchbarValue("");
    }
  };

  return (
    <div className="flex h-14 pl-8 pr-8 gap-2 justify-between border-b-[0.5px] border-lightGrey">
      {/* actions on the left side */}
      <div className="flex flex-row gap-4 items-center">
        <DocumentButton />
        <div
          className="select-none flex flex-row justify-center items-center gap-1 bg-offWhite hover:bg-lightGrey rounded-full h-7 pl-2 pr-2 cursor-pointer"
          onClick={() => {
            setShowDropdownHeader(!showDropdownHeader);
          }}>
          <span className="text-xs font-bold">Ansicht</span>
          {showDropdownHeader ? (
            <CaretUp size={12} className="text-darkGrey" weight="bold" />
          ) : (
            <CaretDown size={12} className="text-darkGrey" weight="bold" />
          )}
        </div>
        <span className="font-extralight text-sm">AZ. {caseId}</span>
      </div>
      {/* searchbar */}
      <div className="flex flex-row gap-2 justify-center items-center w-full max-w-[300px]">
        <div
          className={cx(
            "flex flex-row bg-offWhite rounded-md pl-2 pr-2 h-8 items-center w-full max-w-[300px]",
            {
              "outline outline-1,5 outline-offset-0 outline-darkGrey":
                searchbarValue !== "",
            }
          )}>
          <div>
            <MagnifyingGlass
              size={16}
              weight="bold"
              className="hover:text-mediumGrey text-darkGrey ml-1 mr-1 cursor-pointer"
            />
          </div>
          <input
            value={searchbarValue}
            onChange={(e) => onChangeSearchbar(e)}
            className="bg-offWhite outline-0 w-full max-w-[300px] pl-2 text-sm"
            type="text"
            placeholder="Im Basisdokument suchen..."
            onKeyDown={onHandleKeyDown}
          />
          {searchbarValue !== "" ? (
            <XCircle
              size={20}
              weight="fill"
              className="hover:text-mediumGrey text-darkGrey ml-1 mr-0.5 cursor-pointer"
              onClick={() => {
                setSearchbarValue("");
              }}
            />
          ) : null}
        </div>
      </div>
      {/* actions on the right side */}
      <div className="flex flex-row gap-4 justify-end items-center">
        <Tooltip text="Hilfe">
          <div
            className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-12 h-8 cursor-pointer"
            onClick={() => {
              setIsOnboardingVisible(true);
            }}>
            <Question size={16} className="text-darkGrey" />
          </div>
        </Tooltip>
        <Tooltip text="Markierungsfarbe auswählen">
          <ColorSelector />
        </Tooltip>
        <Tooltip text="Werkzeug auswählen">
          <ToolSelector
            getCurrentTool={getCurrentTool}
            setCurrentTool={setCurrentTool}
          />
        </Tooltip>
      </div>
    </div>
  );
};
