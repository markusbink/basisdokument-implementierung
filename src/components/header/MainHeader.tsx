import {
  CaretDown,
  CaretUp,
  Check,
  MagnifyingGlass,
  PencilSimple,
  Question,
  XCircle,
} from "phosphor-react";
import React, { KeyboardEvent, useState } from "react";
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
  const { caseId, setCaseId } = useCase();
  const { setIsOnboardingVisible } = useOnboarding();
  const [caseIdInEditMode, setCaseIdInEditMode] = useState<boolean>();

  const onChangeSearchbar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchbarValue(e.target.value);
  };

  const onHandleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchbarValue("");
    }
  };

  const onCaseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCaseId(value);
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
          <span className="text-xs font-bold">Tools</span>
          {showDropdownHeader ? (
            <CaretUp size={12} className="text-darkGrey" weight="bold" />
          ) : (
            <CaretDown size={12} className="text-darkGrey" weight="bold" />
          )}
        </div>
        {/* <span className="font-extralight text-sm"></span> */}
        <div className="flex flex-row justify-between items-center gap-3 bg-offWhite rounded-full h-7 pl-2 pr-2">
          <span className="text-xs">AZ. </span>
          {caseIdInEditMode ? (
            <>
              <input
                autoFocus={true}
                type="text"
                name="title"
                placeholder="Aktenzeichen..."
                maxLength={15}
                className="focus:outline focus:outline-offWhite focus:bg-offWhite p-0 m-0 text-xs w-24"
                value={caseId}
                onBlur={() => setCaseIdInEditMode(false)}
                onChange={onCaseIdChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setCaseIdInEditMode(false);
                  }
                }}
              />
              <Check
                size={24}
                className="hover:bg-lightGrey cursor-pointer rounded-full p-1"
                onClick={() => {
                  setCaseIdInEditMode(false);
                }}
              />
            </>
          ) : (
            <>
              <span className="text-xs">{caseId}</span>
              <PencilSimple
                size={24}
                className="hover:bg-lightGrey cursor-pointer rounded-full p-1"
                onClick={() => {
                  setCaseIdInEditMode(true);
                }}
              />
            </>
          )}
        </div>
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
        <ColorSelector />
        <ToolSelector
          getCurrentTool={getCurrentTool}
          setCurrentTool={setCurrentTool}
        />
      </div>
    </div>
  );
};
