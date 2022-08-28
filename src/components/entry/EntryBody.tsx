import cx from "classnames";
import Highlight from "highlight-react/dist/highlight";
import { useEffect } from "react";
import { useHeaderContext } from "../../contexts";
import { doHighlight, optionsImpl } from "@funktechno/texthighlighter/lib/index";

interface EntryBodyProps {
  isPlaintiff: boolean;
  entryId: string;
  children: React.ReactNode;
  setLowerOpcacityForSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EntryBody: React.FC<EntryBodyProps> = ({ isPlaintiff, entryId, setLowerOpcacityForSearch, children }) => {
  const { searchbarValue, currentColorSelection } = useHeaderContext();

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

  const createHighlighting = () => {
    const domEle: any = document.querySelector(`.marker-text-${entryId}`);


    const options: optionsImpl = { color: getCurrentHighlighterColorAsHTMLString() };
    if (domEle) {
      const highlightMade = doHighlight(domEle, true, options);
      console.log("highlightMade", highlightMade);
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
        <p className={cx(`marker-text-${entryId}`)} onMouseUp={createHighlighting} dangerouslySetInnerHTML={{ __html: children as string }}></p>
      ) : (
        <Highlight search={`(?<=(\>[^<>]*))${searchbarValue}(?=([^<>]*\<.*\>))`}>{children}</Highlight> // eslint-disable-line
      )}
    </div>
  );
};
