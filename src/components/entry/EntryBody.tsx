import cx from "classnames";
import Highlight from "highlight-react/dist/highlight";
import { useHeaderContext } from "../../contexts";

interface EntryBodyProps {
  isPlaintiff: boolean;
  children: React.ReactNode;
}

export const EntryBody: React.FC<EntryBodyProps> = ({ isPlaintiff, children }) => {
  const { searchbarValue } = useHeaderContext();
  return (
    <div
      className={cx("p-6 bg-white rounded-b-lg border border-t-0", {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
      })}
    >
      {searchbarValue === "" ? <p dangerouslySetInnerHTML={{ __html: children as string }}></p> : <Highlight search={searchbarValue}>{children}</Highlight>}
    </div>
  );
};
