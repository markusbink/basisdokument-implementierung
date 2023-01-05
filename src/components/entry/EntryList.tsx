import { useBookmarks, useCase } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { useView } from "../../contexts/ViewContext";
import { IEntry, UserRole, ViewMode } from "../../types";
import { Entry } from "./";

interface EntryListProps {
  entriesList: IEntry[];
  sectionId: string;
}

export const EntryList: React.FC<EntryListProps> = ({
  entriesList,
  sectionId,
}) => {
  const { user } = useUser();
  const { currentVersion } = useCase();
  const { bookmarks } = useBookmarks();
  const { view } = useView();
  const { entries } = useCase();

  return (
    <>
      {view !== ViewMode.SideBySide ? (
        <div className="space-y-4 w-full">
          {entriesList.map((entry, index) => (
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
          ))}
        </div>
      ) : (
        <div className="flex flex-row justify-between w-full h-fit">
          <div className="flex flex-col w-1/2 gap-5">
            {entries
              .filter(
                (entr) =>
                  entr.sectionId === sectionId &&
                  entr.role === UserRole.Plaintiff
              )
              .map((plaintiffEntry) => (
                <Entry
                  key={plaintiffEntry.id}
                  entry={plaintiffEntry}
                  isOld={plaintiffEntry.version < currentVersion}
                  viewedBy={user!.role}
                  isBookmarked={
                    bookmarks.find(
                      (bookmark) =>
                        bookmark.associatedEntry === plaintiffEntry.id
                    )
                      ? true
                      : false
                  }
                />
              ))}
          </div>
          <div className="flex flex-col w-1/2 gap-5">
            {entries
              .filter(
                (entr) =>
                  entr.sectionId === sectionId &&
                  entr.role === UserRole.Defendant
              )
              .map((defendantEntry) => (
                <Entry
                  key={defendantEntry.id}
                  entry={defendantEntry}
                  isOld={defendantEntry.version < currentVersion}
                  viewedBy={user!.role}
                  isBookmarked={
                    bookmarks.find(
                      (bookmark) =>
                        bookmark.associatedEntry === defendantEntry.id
                    )
                      ? true
                      : false
                  }
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};
