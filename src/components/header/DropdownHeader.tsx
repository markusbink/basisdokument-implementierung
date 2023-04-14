import cx from "classnames";
import { SelectionForeground } from "phosphor-react";
import React from "react";
import { useHeaderContext, useUser } from "../../contexts";
import { useView } from "../../contexts/ViewContext";
import { Tool, UserRole, ViewMode } from "../../types";
import { Tooltip } from "../Tooltip";
import { ColorSelector } from "./ColorSelector";
import { HighlighterButton } from "./HighlighterButton";
import { VersionSelector } from "./VersionSelector";
import { ToolSelector } from "./ToolSelector";

export enum Sorting {
  Privat,
  Original,
}

export const DropdownHeader: React.FC<any> = () => {
  const {
    selectedSorting,
    setHideEntriesHighlighter,
    colorSelection,
    hideEntriesHighlighter,
    setHighlightElementsWithSpecificVersion,
    highlightElementsWithSpecificVersion,
    setCurrentTool,
    getCurrentTool,
    showEntrySorting,
    setShowEntrySorting,
  } = useHeaderContext();
  const { user } = useUser();
  const { view, setView } = useView();

  return (
    <div className="flex flex-row gap-4 p-2 pl-8 pr-8 bg-white items-center">
      <div>
        <span className="font-extrabold tracking-widest text-xs">
          DARSTELLUNG
        </span>
        <div className={cx("flex flex-row")}>
          <div className={cx("flex flex-row gap-2 h-8")}>
            <Tooltip
              text="Side-by-Side"
              position="bottom"
              className={cx({
                "pointer-events-none": showEntrySorting,
                "cursor-not-allowed": showEntrySorting,
              })}>
              <div
                className={cx(
                  "rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite",
                  {
                    "bg-lightGrey": view === ViewMode.SideBySide,
                  }
                )}
                onClick={() => {
                  setView(ViewMode.SideBySide);
                }}>
                <img
                  className={showEntrySorting ? "w-4 opacity-25" : "w-4"}
                  src={`${process.env.PUBLIC_URL}/icons/side-by-side-icon.svg`}
                  alt="row view icon"></img>
              </div>
            </Tooltip>
            <Tooltip
              text="Spalten"
              position="bottom"
              className={cx({
                "pointer-events-none": showEntrySorting,
                "cursor-not-allowed": showEntrySorting,
              })}>
              <div
                className={cx(
                  "rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite",
                  {
                    "bg-lightGrey": view === ViewMode.Columns,
                  }
                )}
                onClick={() => {
                  setView(ViewMode.Columns);
                }}>
                <img
                  className={showEntrySorting ? "w-4 opacity-25" : "w-4"}
                  src={`${process.env.PUBLIC_URL}/icons/column-view-icon.svg`}
                  alt="column view icon"></img>
              </div>
            </Tooltip>
            <Tooltip
              text="Zeilen"
              position="bottom"
              className={cx({
                "pointer-events-none": showEntrySorting,
                "cursor-not-allowed": showEntrySorting,
              })}>
              <div
                className={cx(
                  "rounded-md h-8 w-8 flex justify-center items-center cursor-pointer hover:bg-offWhite",
                  {
                    "bg-lightGrey": view === ViewMode.Rows,
                  }
                )}
                onClick={() => {
                  setView(ViewMode.Rows);
                }}>
                <img
                  className={showEntrySorting ? "w-4 opacity-25" : "w-4"}
                  src={`${process.env.PUBLIC_URL}/icons/row-view-icon.svg`}
                  alt="row view icon"></img>
              </div>
            </Tooltip>
          </div>
          {user?.role === UserRole.Judge &&
          selectedSorting === Sorting.Privat ? (
            <div className="flex flex-row items-center gap-2">
              <Tooltip
                asChild
                text="Erlaubt Ihnen die Verschiebung von Beiträgen innerhalb einzelner Gliederungspunkte. Die Sortierung der Beiträge ist nur für Sie sichtbar.">
                <div
                  className="flex flex-row items-center justify-center gap-2 bg-offWhite hover:bg-lightGrey h-8 px-2 cursor-pointer rounded-md"
                  onClick={() => {
                    setCurrentTool({
                      id: Tool.Cursor,
                      iconNode: "Cursor",
                      germanTitle: "Maus",
                    });
                    setView(ViewMode.Columns);
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
      {user?.role !== UserRole.Client && (
        <div className="h-12 w-0.5 bg-lightGrey rounded-full"></div>
      )}
      {user?.role !== UserRole.Client && (
        <div>
          <span className="font-extrabold tracking-widest text-xs">
            MARKIERUNGEN
          </span>
          <div className="flex flex-row gap-2">
            <ToolSelector
              getCurrentTool={getCurrentTool}
              setCurrentTool={setCurrentTool}
            />
            <ColorSelector />
            <div className="h-8 w-[1px] bg-lightGrey rounded-full"></div>
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
            <div
              className={cx(
                `flex flex-col lg:flex-row items-center h-12 lg:h-8 gap-2 lg:gap-4 text-sm font-medium`,
                {
                  "opacity-30": getCurrentTool.id !== Tool.Cursor,
                }
              )}
              onClick={() => {
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
            </div>
          </div>
        </div>
      )}
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
