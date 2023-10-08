import cx from "classnames";
import Highlight from "highlight-react/dist/highlight";
import { useCallback, useEffect, useState } from "react";
import { useCase, useHeaderContext } from "../../contexts";
import {
  doHighlight,
  optionsImpl,
} from "@funktechno/texthighlighter/lib/index";
import { IEvidence, IHighlightedEntry, Tool } from "../../types";
import { getColorHexForColor } from "../../util/get-hex-code-for-marker";
import { getTheme } from "../../themes/getTheme";
import { ImageSquare } from "phosphor-react";
import { ImageViewerPopup } from "./ImageViewerPopup";

interface EntryBodyProps {
  isPlaintiff: boolean;
  entryId: string;
  children: React.ReactNode;
  setLowerOpcacityForSearch: React.Dispatch<React.SetStateAction<boolean>>;
  lowerOpcacityForHighlighters: boolean;
  setLowerOpcacityForHighlighters: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showInPopup?: boolean;
  evidences: IEvidence[];
}

export const EntryBody: React.FC<EntryBodyProps> = ({
  isPlaintiff,
  entryId,
  setLowerOpcacityForSearch,
  lowerOpcacityForHighlighters,
  setLowerOpcacityForHighlighters,
  children,
  showInPopup,
  evidences,
}) => {
  const {
    searchbarValue,
    currentColorSelection,
    getCurrentTool,
    highlighterData,
    selectedTheme,
  } = useHeaderContext();
  const { setHighlightedEntries, highlightedEntries } = useCase();
  const [imagePopupFilename, setImagePopupFilename] = useState<string>("");
  const [imagePopupData, setImagePopupData] = useState<string>("");
  const [imagePopupAttachment, setImagePopupAttachment] = useState<string>("");
  const [imagePopupTitle, setImagePopupTitle] = useState<string>("");
  const [imagePopupVisible, setImagePopupVisible] = useState<boolean>(false);

  useEffect(() => {
    let highlightedTextElement: Element | null = document.querySelector(
      `.search-text-${entryId}`
    );
    if (highlightedTextElement !== null) {
      let numberOfMarksInEntry: number =
        highlightedTextElement?.querySelectorAll("mark").length;
      if (numberOfMarksInEntry > 0) {
        setLowerOpcacityForSearch(true);
      } else {
        setLowerOpcacityForSearch(false);
      }
    }
  }, [searchbarValue, entryId, setLowerOpcacityForSearch]);

  const getEntryContent = useCallback(() => {
    let highlightedEntry: IHighlightedEntry | undefined =
      highlightedEntries.find((entry) => entry.entryId === entryId);
    if (highlightedEntry) {
      return highlightedEntry.highlightedText;
    }
    return children;
  }, [children, entryId, highlightedEntries]);

  useEffect(() => {
    let htmlElementOfEntryText: HTMLDivElement = createElementFromHTML(
      getEntryContent() as string
    );
    let oneColorIsUsed: boolean = false;
    let hideAllEntries: boolean = true;

    Object.keys(highlighterData).forEach(function eachKey(key) {
      let colorId: string = key;
      let isSelectedColor: boolean = highlighterData[key];

      if (isSelectedColor) {
        hideAllEntries = false;
        let allHighlightings: any = htmlElementOfEntryText.querySelectorAll(
          `span[data-backgroundcolor="${getColorHexForColor(colorId)}"]`
        );
        if (allHighlightings.length > 0) {
          oneColorIsUsed = true;
        }
      }
    });
    if (hideAllEntries) {
      setLowerOpcacityForHighlighters(true);
    } else {
      setLowerOpcacityForHighlighters(!oneColorIsUsed);
    }
  }, [
    highlighterData,
    setLowerOpcacityForHighlighters,
    getCurrentTool,
    getEntryContent,
  ]);

  const getCurrentHighlighterColorAsHTMLString = () => {
    if (getCurrentTool.id === Tool.Eraser) {
      return "#ffffff";
    }
    return getColorHexForColor(currentColorSelection.color);
  };

  const markedEntryExists = (entryId: string) => {
    return highlightedEntries.some(function (el) {
      return el.entryId === entryId;
    });
  };

  const saveNewHighlighting = () => {
    let highlightedText: string | undefined = document.querySelector(
      `.marker-text-${entryId}`
    )?.innerHTML;

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
        setHighlightedEntries([
          ...highlightedEntries,
          { entryId: entryId, highlightedText: highlightedText },
        ]);
      }
    }
  };

  const createHighlighting = () => {
    const domEle: any = document.querySelector(`.marker-text-${entryId}`);
    const options: optionsImpl = {
      color: getCurrentHighlighterColorAsHTMLString(),
    };

    if (
      domEle &&
      (getCurrentTool.id === Tool.Highlighter ||
        getCurrentTool.id === Tool.Eraser)
    ) {
      const highlightMade = doHighlight(domEle, true, options);
      if (highlightMade) {
        saveNewHighlighting();
      }
    }
  };

  // Change cursor if highlighter cursor is selected
  const getToolIconPath = () => {
    switch (getCurrentTool.id) {
      case Tool.Highlighter:
        return `url(cursors/highlighter-${currentColorSelection.color}.svg) 0 10, auto`;
      case Tool.Eraser:
        return `url(cursors/eraser.svg), auto`;
      default:
        return "";
    }
  };

  // Source: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
  const createElementFromHTML = (htmlString: string) => {
    let div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div;
  };

  const applyHighlighterFiltersToEntry = (entryText: string) => {
    let htmlElementOfEntryText: any = createElementFromHTML(entryText);

    // hide specific colors
    Object.keys(highlighterData).forEach(function eachKey(key) {
      let colorId: string = key;
      let isSelectedColor: boolean = highlighterData[key];
      let allHighlightings: any = htmlElementOfEntryText.querySelectorAll(
        `span[data-backgroundcolor="${getColorHexForColor(colorId)}"]`
      );

      for (let index = 0; index < allHighlightings.length; index++) {
        const highlighting = allHighlightings[index];
        if (isSelectedColor) {
          highlighting.style.backgroundColor = getColorHexForColor(colorId);
        } else {
          highlighting.style.backgroundColor = "";
        }
      }
    });

    return htmlElementOfEntryText.innerHTML;
  };

  const showImage = (
    filedata: string,
    filename: string,
    attId: string,
    title: string
  ) => {
    setImagePopupVisible(!imagePopupVisible);
    setImagePopupData(filedata);
    setImagePopupAttachment(attId);
    setImagePopupFilename(filename);
    setImagePopupTitle(title);
  };

  return (
    <>
      <div
        className={cx(
          `p-6 bg-white rounded-b-lg border border-t-0 search-text-${entryId}`,
          {
            [`border-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
              isPlaintiff,
            [`border-${getTheme(selectedTheme)?.secondaryDefendant}`]:
              !isPlaintiff,
            "max-h-[70vh] overflow-y-auto": showInPopup,
          }
        )}>
        {searchbarValue === "" &&
        (getCurrentTool.id === Tool.Highlighter ||
          getCurrentTool.id === Tool.Eraser) ? (
          <p
            style={{ cursor: getToolIconPath() }}
            className={cx(`marker-text-${entryId}`)}
            onMouseUp={createHighlighting}
            dangerouslySetInnerHTML={{
              __html: getEntryContent() as string,
            }}></p>
        ) : null}
        {searchbarValue === "" && getCurrentTool.id === Tool.Cursor ? (
          <p
            dangerouslySetInnerHTML={{
              __html: applyHighlighterFiltersToEntry(
                getEntryContent() as string
              ),
            }}></p>
        ) : null}
        {searchbarValue !== "" ? (
          <Highlight // eslint-disable-next-line
            search={`(?<=(\>[^<>]*))${searchbarValue}(?=([^<>]*\<.*\>))`}>
            {children}
          </Highlight> // eslint-disable-line
        ) : null}
        {evidences && evidences.length > 0 && (
          <div className="flex flex-col gap-1 border-t border-lightGrey pt-2">
            <span className="font-bold">
              {evidences.length === 1 ? "Beweis:" : "Beweise:"}
            </span>
            <div className="flex flex-col flex-wrap gap-1">
              {evidences.map((evidence, index) => (
                <div className="flex flex-row items-center" key={index}>
                  <div className="flex flex-row gap-2">
                    {evidences.length !== 1 && (
                      <span className="w-4">{index + 1 + "."}</span>
                    )}
                    {evidence.hasAttachment ? (
                      <span className="break-words font-medium">
                        {evidence.name}
                        <b> als Anlage {evidence.attachmentId}</b>
                      </span>
                    ) : (
                      <span className="break-words font-medium">
                        {evidence.name}
                      </span>
                    )}
                    {evidence.hasImageFile && (
                      <ImageSquare
                        size={20}
                        className="text-mediumGrey hover:text-black"
                        onClick={() => {
                          showImage(
                            evidence.imageFile!,
                            evidence.imageFilename!,
                            evidence.attachmentId!,
                            evidence.name
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ImageViewerPopup
        isVisible={imagePopupVisible}
        filedata={imagePopupData}
        filename={imagePopupFilename}
        title={imagePopupTitle}
        attachmentId={imagePopupAttachment}
        setIsVisible={setImagePopupVisible}></ImageViewerPopup>
    </>
  );
};
