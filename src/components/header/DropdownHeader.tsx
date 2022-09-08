import cx from "classnames";
import { SelectionForeground } from "phosphor-react";
import React from "react";
import { useHeaderContext, useUser } from "../../contexts";
import { Tool, UserRole } from "../../types";
import { Tooltip } from "../Tooltip";
import { HighlighterButton } from "./HighlighterButton";
import { SortingMenu } from "./SortingMenu";
import { SortingSelector } from "./SortingSelector";
import { VersionSelector } from "./VersionSelector";

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
    setHighlightElementsWithSpecificVersion,
    highlightElementsWithSpecificVersion,
    setCurrentTool,
    showEntrySorting,
    setShowEntrySorting,
  } = useHeaderContext();
  const { user } = useUser();

  const { getCurrentTool } = useHeaderContext();

  return (
    <div className="flex flex-row gap-4 p-2 pl-8 pr-8 bg-white items-center">
      <div>
        <span className="font-extrabold tracking-widest text-xs">
          DARSTELLUNG
        </span>
        <div className="flex flex-row gap-2 h-8">
          <div
            className={cx(
              "rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite",
              {
                "bg-lightGrey": showColumnView,
              }
            )}
            onClick={() => {
              setShowColumnView(true);
            }}>
            <img
              className="w-4"
              src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`}
              alt="column view icon"></img>
          </div>
          <div
            className={cx(
              "rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite",
              {
                "bg-lightGrey": !showColumnView,
              }
            )}
            onClick={() => {
              setShowColumnView(false);
            }}>
            <img
              className="w-4"
              src={`${process.env.PUBLIC_URL}/icons/row-view-icon.svg`}
              alt="row view icon"></img>
          </div>
        </div>
      </div>
      <div className="h-12 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <span className="font-extrabold tracking-widest text-xs">
          SORTIERUNGEN
        </span>
        <div className="flex flex-row items-center h-8 gap-2">
          <SortingSelector
            selectedSorting={selectedSorting}
            setSelectedSorting={setSelectedSorting}
          />
          {selectedSorting === Sorting.Privat ? <SortingMenu /> : null}
          {user?.role === UserRole.Judge ? (
            <div className="flex flex-row items-center gap-2">
              <Tooltip
                asChild
                text="Erlaubt Ihnen die Verschiebung von Beiträgen innerhalb einzelner Gliederungspunkte. Die Sortierung der Beiträge ist nur für Sie sichtbar.">
                <div
                  className="flex flex-row items-center justify-center gap-2 bg-offWhite hover:bg-lightGrey h-8 px-2 cursor-pointer rounded-md"
                  onClick={() => {
                    setShowEntrySorting(!showEntrySorting);
                  }}>
                  <input
                    className="small-checkbox accent-darkGrey cursor-pointer"
                    type="checkbox"
                    checked={showEntrySorting}
                    onChange={() => setShowEntrySorting(!showEntrySorting)}
                  />
                  <div>
                    <img
                      className="w-6 h-6"
                      src={`${process.env.PUBLIC_URL}/icons/entry-sorting-icon.svg`}
                      alt="sorting entry icon"></img>
                  </div>
                </div>
              </Tooltip>
            </div>
          ) : null}
        </div>
      </div>
      <div className="h-12 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <span className="font-extrabold tracking-widest text-xs">
          MARKIERUNGEN
        </span>
        <div
          className={cx(
            `flex flex-col lg:flex-row items-center h-12 lg:h-8 gap-2 lg:gap-4 text-sm font-medium`,
            {
              "opacity-30": getCurrentTool.id !== Tool.Cursor,
            }
          )}
          onClick={() => {
            console.log(getCurrentTool.id);

            if (getCurrentTool.id !== Tool.Cursor) {
              setCurrentTool({
                id: Tool.Cursor,
                iconNode: "Cursor",
                germanTitle: "Maus",
              });
            }
          }}>
          <div className="flex flex-row gap-2">
            {colorSelection.map((item: any, id: number) => (
              <HighlighterButton key={id} id={id} />
            ))}
          </div>
          <div className="flex flex-row items-center gap-2">
            <Tooltip
              asChild
              text="Beiträge ohne eine der ausgewählten Farben werden ausgeblendet">
              <div
                className="flex flex-row items-center justify-center gap-2 bg-offWhite hover:bg-lightGrey h-8 px-2 cursor-pointer rounded-md"
                onClick={() => {
                  setHideEntriesHighlighter(!hideEntriesHighlighter);
                }}>
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={hideEntriesHighlighter}
                  onChange={() =>
                    setHideEntriesHighlighter(!hideEntriesHighlighter)
                  }
                />
                <div>
                  <SelectionForeground size={16} />
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="h-12 w-0.5 bg-lightGrey rounded-full"></div>
      <div>
        <span className="font-extrabold tracking-widest text-xs">
          ÄNDERUNGEN VON
        </span>
        <div className="flex flex-row items-center h-8 gap-2">
          <input
            className="small-checkbox accent-darkGrey cursor-pointer"
            type="checkbox"
            defaultChecked={highlightElementsWithSpecificVersion}
            onChange={() =>
              setHighlightElementsWithSpecificVersion(
                !highlightElementsWithSpecificVersion
              )
            }
          />
          <VersionSelector />
        </div>
      </div>
    </div>
  );
};
