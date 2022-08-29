import cx from "classnames";
import Highlight from "highlight-react/dist/highlight";
import { useEffect } from "react";
import { useCase, useHeaderContext } from "../../contexts";
import { doHighlight, optionsImpl } from "@funktechno/texthighlighter/lib/index";
import { IHighlightedEntry } from "../../types";

interface EntryBodyProps {
  isPlaintiff: boolean;
  entryId: string;
  children: React.ReactNode;
  setLowerOpcacityForSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EntryBody: React.FC<EntryBodyProps> = ({ isPlaintiff, entryId, setLowerOpcacityForSearch, children }) => {
  const { searchbarValue, currentColorSelection, getCurrentTool } = useHeaderContext();
  const { setHighlightedEntries, highlightedEntries } = useCase();

  useEffect(() => {
    let highlightedTextElement: Element | null = document.querySelector(`.search-text-${entryId}`);
    if (highlightedTextElement !== null) {
      let numberOfMarksInEntry: number = highlightedTextElement?.querySelectorAll("mark").length;
      if (numberOfMarksInEntry > 0) {
        setLowerOpcacityForSearch(true);
      } else {
        setLowerOpcacityForSearch(false);
      }
    }
  }, [searchbarValue, entryId, setLowerOpcacityForSearch]);

  const getCurrentHighlighterColorAsHTMLString = () => {
    if (getCurrentTool.id === "eraser") {
      return "#ffffff";
    }
    switch (currentColorSelection.color) {
      case "red":
        return "#FCA5A5";
      case "orange":
        return "#FDBA74";
      case "yellow":
        return "#FDE047";
      case "green":
        return "#86EFAC";
      case "blue":
        return "#93C5FD";
      case "purple":
        return "#D8B4FE";
      default:
        break;
    }
  };

  function markedEntryExists(entryId: string) {
    return highlightedEntries.some(function (el) {
      return el.entryId === entryId;
    });
  }

  const saveNewHighlighting = () => {
    let highlightedText: string | undefined = document.querySelector(`.marker-text-${entryId}`)?.outerHTML;

    if (typeof highlightedText === "string") {
      if (markedEntryExists(entryId)) {
        const newHighlightedEntries: any = highlightedEntries.map((entry) => {
          if (entry.entryId === entryId) {
            return { entryId: entryId, highlightedText: highlightedText };
          }
          return entry;
        });
        setHighlightedEntries(newHighlightedEntries);
      } else {
        setHighlightedEntries([...highlightedEntries, { entryId: entryId, highlightedText: highlightedText }]);
      }
    }
  };

  const createHighlighting = () => {
    const domEle: any = document.querySelector(`.marker-text-${entryId}`);
    const options: optionsImpl = { color: getCurrentHighlighterColorAsHTMLString() };

    if (domEle && (getCurrentTool.id === "highlighter" || getCurrentTool.id === "eraser")) {
      const highlightMade = doHighlight(domEle, true, options);
      if (highlightMade) {
        saveNewHighlighting();
      }
    }
  };

  const getEntryContent = () => {
    let highlightedEntry: IHighlightedEntry | undefined = highlightedEntries.find((entry) => entry.entryId === entryId);
    if (highlightedEntry) {
      return highlightedEntry.highlightedText;
    }
    return children;
  };

  const getToolIconPath = () => {
    switch (getCurrentTool.id) {
      case "highlighter":
        return `url(cursors/highlighter-${currentColorSelection.color}.svg), auto`;
      case "eraser":
        return `url(cursors/eraser.svg), auto`;
      default:
        return "";
    }
  };

  return (
    <div
      className={cx(`p-6 bg-white rounded-b-lg border border-t-0 search-text-${entryId}`, {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
      })}
    >
      {/* eslint-disable-next-line */}
      {searchbarValue === "" ? (
        <p style={{ cursor: getToolIconPath() }} className={cx(`marker-text-${entryId}`)} onMouseUp={createHighlighting} dangerouslySetInnerHTML={{ __html: getEntryContent() as string }}></p>
      ) : (
        <Highlight search={`(?<=(\>[^<>]*))${searchbarValue}(?=([^<>]*\<.*\>))`}>{children}</Highlight> // eslint-disable-line
      )}
    </div>
  );
};
