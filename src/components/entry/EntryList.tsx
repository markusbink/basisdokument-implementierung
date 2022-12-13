import { useBookmarks, useCase } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { IEntry } from "../../types";
import { DraggableEntry } from "../judge-sorting";
import { Entry } from "./";

interface EntryListProps {
  entries: IEntry[];
}

export const EntryList: React.FC<EntryListProps> = ({ entries }) => {
  const { user } = useUser();
  const { currentVersion } = useCase();
  const { bookmarks } = useBookmarks();

  return (
    <div className="space-y-4 w-full">
      {entries.map((entry, index) => (
        <>
          {entry.version === currentVersion && !entry.associatedEntry ? (
            <DraggableEntry
              key={entry.id}
              entryId={entry.id}
              position={{
                sectionId: entry.sectionId,
                rowId: entry.sectionId,
                column: 1,
              }}
              index={index}
            />
          ) : (
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
          )}
        </>
      ))}
    </div>
  );
};
