import React, { useState } from "react";
import * as Select from "@radix-ui/react-select";
import cx from "classnames";
import { HighlighterButton } from "./HighlighterButton";
import { Checkbox } from "./Checkbox";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { SortingSelector } from "./SortingSelector";
import { SortingMenu } from "./SortingMenu";
import { VersionSelector } from "./VersionSelector";

interface IProps {
  showFoldOutMenu: Boolean;
  setShowFoldOutMenu: React.Dispatch<React.SetStateAction<Boolean>>;
  showColumnView: Boolean;
  setShowColumnView: React.Dispatch<React.SetStateAction<Boolean>>;
}

export const DropdownHeader: React.FC<IProps> = ({ showFoldOutMenu, setShowFoldOutMenu, showColumnView, setShowColumnView }) => {
  const [highlighterData, setHighlighterData] = useState({ red: true, orange: true, yellow: true, green: true, blue: true, purple: true });
  const [hideEntries, setHideEntries] = useState(false);
  const [hideElementsWithoutSpecificVersion, setHideElementsWithoutSpecificVersion] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState<string>("Original");

  return (
    <div className="flex flex-row gap-6 p-4 pl-8 pr-8 bg-lowWhite items-center">
      <div>
        <p className="font-extrabold tracking-widest text-xs">DARSTELLUNG</p>
        <div className="flex flex-row gap-2 h-8 mt-2">
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center", {
              "bg-lightGrey": !showColumnView,
              "": showColumnView,
            })}
            onClick={() => {
              setShowColumnView(false);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`} alt="column view icon"></img>
          </div>
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center", {
              "bg-lightGrey": showColumnView,
              "": !showColumnView,
            })}
            onClick={() => {
              setShowColumnView(true);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/row-view-icon.svg`} alt="row view icon"></img>
          </div>
        </div>
      </div>
      <div className="h-14 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <p className="font-extrabold tracking-widest text-xs">MARKIERUNGEN</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-1">
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="red" />
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="orange" />
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="yellow" />
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="green" />
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="blue" />
          <HighlighterButton highlighterData={highlighterData} setHighlighterData={setHighlighterData} highlighterColor="purple" />
          <Checkbox
            label="Beiträge ausblenden"
            value={hideEntries}
            onChange={() => {
              setHideEntries(!hideEntries);
            }}
          />
        </div>
      </div>
      <div className="h-14 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <p className="font-extrabold tracking-widest text-xs">SORTIERUNGEN</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-1">
          <SortingSelector selectedSorting={selectedSorting} setSelectedSorting={setSelectedSorting} />
          {selectedSorting === "Private" ? <SortingMenu /> : null}
        </div>
      </div>
      <div className="h-14 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <p className="font-extrabold tracking-widest text-xs">ÄNDERUNGEN VON</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-2">
          <input
            type="checkbox"
            checked={hideElementsWithoutSpecificVersion}
            onChange={() => {
              setHideElementsWithoutSpecificVersion(!hideElementsWithoutSpecificVersion);
            }}
          />
          <VersionSelector/>
        </div>
      </div>
    </div>
  );
};
