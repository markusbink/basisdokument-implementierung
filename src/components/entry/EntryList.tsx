import React from "react";
import { SetStateAction, useRef, useState } from "react";
import { useBookmarks, useCase } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { useView } from "../../contexts/ViewContext";
import { IEntry, UserRole, ViewMode } from "../../types";
import { Entry, NewEntry } from "./";

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

  const [associatedsList, setAssociatedsList] = useState<
    {
      entry: IEntry;
      visibilitySetter: React.Dispatch<SetStateAction<boolean>>;
    }[]
  >([]);

  const ref = React.createRef<HTMLDivElement>();

  // const refs = associatedsList.reduce((acc, value) => {
  //   acc[value.entry.id as keyof {}] = React.createRef<HTMLDivElement>();
  //   return acc;
  // }, {});

  //const ref = useRef(null);

  const showNewEntry = (
    entry: IEntry,
    setIsNewEntryVisible: React.Dispatch<SetStateAction<boolean>>
  ) => {
    if (!associatedsList.find((assoc) => assoc.entry.id === entry.id)) {
      setAssociatedsList((prevAssociateds) => [
        ...prevAssociateds,
        { entry: entry, visibilitySetter: setIsNewEntryVisible },
      ]);
    }

    //TODO: Scrolling

    ref.current?.scrollIntoView();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {
    //   myRef.current.focus();
    // });
  };

  const onNewEntryClosed = (id: string) => {
    setAssociatedsList((prevAssociateds) =>
      prevAssociateds.filter((assoc) => assoc.entry.id !== id)
    );
  };

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
        <>
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
                    setAssociatedEntryInProgress={showNewEntry}
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
                    setAssociatedEntryInProgress={showNewEntry}
                  />
                ))}
            </div>
          </div>

          {/* For new entries created via "Bezug nehmen" */}
          <div ref={ref} className="align-content-end w-full">
            {associatedsList.map((elem) => (
              <NewEntry
                key={elem.entry.id}
                roleForNewEntry={
                  elem.entry.role === UserRole.Defendant
                    ? UserRole.Plaintiff
                    : UserRole.Defendant
                }
                sectionId={elem.entry.sectionId}
                associatedEntry={elem.entry.id}
                setIsNewEntryVisible={elem.visibilitySetter}
                onClose={onNewEntryClosed}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};
