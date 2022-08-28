import cx from "classnames";
import Highlight from "highlight-react/dist/highlight";
import { useEffect } from "react";
import { useHeaderContext } from "../../contexts";

interface EntryBodyProps {
  isPlaintiff: boolean;
  entryId: string;
  children: React.ReactNode;
  setLowerOpcacityForSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EntryBody: React.FC<EntryBodyProps> = ({ isPlaintiff, entryId, setLowerOpcacityForSearch, children }) => {
  const { searchbarValue } = useHeaderContext();

  useEffect(() => {
    let highlightedTextElement: any = document.querySelector(`.search-text-${entryId}`);
    let numberOfMarksInEntry: any = highlightedTextElement.querySelectorAll("mark").length;
    if (numberOfMarksInEntry > 0) {
      setLowerOpcacityForSearch(true);
    } else {
      setLowerOpcacityForSearch(false);
    }
  }, [searchbarValue, entryId, setLowerOpcacityForSearch]);

  return (
    <div
      className={cx(`p-6 bg-white rounded-b-lg border border-t-0 search-text-${entryId}`, {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
      })}
    >
      {searchbarValue === "" ? <p dangerouslySetInnerHTML={{ __html: children as string }}></p> : <Highlight search={searchbarValue}>{children}</Highlight>}
    </div>
  );
};
