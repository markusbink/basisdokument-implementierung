import React, { useState } from "react";
import cx from "classnames";
import { HighlighterButton } from "./HighlighterButton";
import { Checkbox } from "./Checkbox";
import { SortingSelector } from "./SortingSelector";
import { SortingMenu } from "./SortingMenu";
import { VersionSelector } from "./VersionSelector";

export const DropdownHeader: React.FC<any> = ({ headerContext }) => {
  return (
    <div className="flex flex-row gap-6 p-4 pl-8 pr-8 bg-lowWhite items-center">
      <div>
        <p className="font-extrabold tracking-widest text-xs">DARSTELLUNG</p>
        <div className="flex flex-row gap-2 h-8 mt-2">
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center", {
              "bg-lightGrey": !headerContext.showColumnView,
              "": headerContext.showColumnView,
            })}
            onClick={() => {
              headerContext.setShowColumnView(false);
            }}
          >
            <img className="w-4" src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`} alt="column view icon"></img>
          </div>
          <div
            className={cx("rounded-md h-8 w-8 flex justify-center items-center", {
              "bg-lightGrey": headerContext.showColumnView,
              "": !headerContext.showColumnView,
            })}
            onClick={() => {
              headerContext.setShowColumnView(true);
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
          <SortingSelector selectedSorting={headerContext.selectedSorting} setSelectedSorting={headerContext.setSelectedSorting} />
          {headerContext.selectedSorting === "Privat" ? <SortingMenu headerContext={headerContext}/> : null}
        </div>
      </div>
      <div className="h-14 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <p className="font-extrabold tracking-widest text-xs">MARKIERUNGEN</p>
        <div className="flex flex-row items-center mt-2 h-8 gap-1">
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="red" />
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="orange" />
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="yellow" />
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="green" />
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="blue" />
          <HighlighterButton highlighterData={headerContext.highlighterData} setHighlighterData={headerContext.setHighlighterData} highlighterColor="purple" />
          <Checkbox
            label="Beiträge ausblenden"
            value={headerContext.hideEntriesHighlighter}
            onChange={() => {
              headerContext.setHideEntriesHighlighter(!headerContext.hideEntriesHighlighter);
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
            checked={headerContext.hideElementsWithoutSpecificVersion}
            onChange={() => {
              headerContext.setHideElementsWithoutSpecificVersion(!headerContext.hideElementsWithoutSpecificVersion);
            }}
          />
          <VersionSelector headerContext={headerContext}/>
        </div>
      </div>
    </div>
  );
};
