import { useBookmarks, useCase } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { IEntry } from "../../types";
import { AddEntryButtons } from "../AddEntryButtons";
import { Entry } from "./";

interface EntryListProps {
  entries: IEntry[];
  sectionId: string;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, sectionId }) => {
  const { user } = useUser();
  const { currentVersion } = useCase();
  const { bookmarks } = useBookmarks();

  return (
    <div className="space-y-4 w-full">
      {entries.map((entry, index) => (
        <>
          <AddEntryButtons sectionId={sectionId} idFollowingEntry={entry.id} />
          <Entry
            key={entry.id}
            entry={entry}
            isOld={entry.version < currentVersion}
            viewedBy={user!.role}
            isBookmarked={
              bookmarks.find(
                (bookmark) => bookmark.associatedEntry === entry.id
              )
                ? true
                : false
            }
          />
        </>
      ))}
      <AddEntryButtons sectionId={sectionId} />
    </div>
  );
};
