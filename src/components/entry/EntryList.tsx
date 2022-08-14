import { IEntry, UserRole } from "../../types";
import { Entry } from "./";

interface EntryListProps {
  entries: IEntry[];
}

export const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  return (
    <div>
      {entries.map((entry, index) => (
        <Entry
          key={entry.id}
          entry={entry}
          isBookmarked={index % 2 === 0}
          isOld={index % 2 === 0}
          viewedBy={UserRole.Judge}
        />
      ))}
    </div>
  );
};
