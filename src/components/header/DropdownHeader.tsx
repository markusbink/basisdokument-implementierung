import React from "react";
import cx from "classnames";
import { HighlighterButton } from "./HighlighterButton";
import { Checkbox } from "./Checkbox";
import { SortingSelector } from "./SortingSelector";
import { SortingMenu } from "./SortingMenu";
import { VersionSelector } from "./VersionSelector";
import { useHeaderContext } from "../../contexts";

export enum Sorting {
  Privat,
  Original,
}

export const DropdownHeader: React.FC<any> = () => {
  const {
    showColumnView,
    setShowColumnView,
    selectedSorting,
    setHideEntriesHighlighter,
    colorSelection,
    setSelectedSorting,
    hideEntriesHighlighter,
    setHideElementsWithoutSpecificVersion,
    hideElementsWithoutSpecificVersion,
  } = useHeaderContext();

  return (
    <div className="flex flex-row gap-6 p-4 pl-8 pr-8 bg-white items-center">
      <div>
        <p className="font-extrabold tracking-widest text-xs">DARSTELLUNG</p>
        <div className="flex flex-row gap-2 h-8 mt-2">
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite", {
              "bg-lightGrey": !showColumnView,
            })}
            onClick={() => {
              setShowColumnView(false);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`} alt="column view icon"></img>
          </div>
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite", {
              "bg-lightGrey": showColumnView,
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
        <p className="font-extrabold tracking-widest text-xs">SORTIERUNGEN</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-1">
          <SortingSelector selectedSorting={selectedSorting} setSelectedSorting={setSelectedSorting} />
          {selectedSorting === Sorting.Privat ? <SortingMenu /> : null}
        </div>
      </div>
      <div className="h-14 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <p className="font-extrabold tracking-widest text-xs">MARKIERUNGEN</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-2">
          {colorSelection.map((item: any, id: number) => (
            <HighlighterButton key={id} id={id} />
          ))}
          <Checkbox
            label="Beiträge ausblenden"
            isChecked={hideEntriesHighlighter}
            onChange={() => {
              setHideEntriesHighlighter(!hideEntriesHighlighter);
            }}
          />
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
          <VersionSelector />
        </div>
      </div>
    </div>
  );
};
