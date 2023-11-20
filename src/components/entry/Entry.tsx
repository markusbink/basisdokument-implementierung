import cx from "classnames";
import { format } from "date-fns";
import {
  ArrowBendDownRight,
  ArrowBendLeftUp,
  BookmarkSimple,
  DotsThree,
  Notepad,
  Pencil,
  Scales,
  Trash,
  ArrowSquareOut,
} from "phosphor-react";
import React, { SetStateAction, useRef, useState } from "react";
import { EditText } from "react-edit-text";
import { toast } from "react-toastify";
import { Action, EntryBody, EntryForm, EntryHeader, NewEntry } from ".";
import {
  useCase,
  useHeaderContext,
  useNotes,
  useHints,
  useUser,
} from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import {
  IEntry,
  UserRole,
  Tool,
  IBookmark,
  SidebarState,
  IndividualEntrySortingEntry,
  ViewMode,
  IEvidence,
} from "../../types";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";
import { Tooltip } from "../Tooltip";
import { EntryList } from "./EntryList";
import { useBookmarks } from "../../contexts";
import { v4 as uuidv4 } from "uuid";
import { useSidebar } from "../../contexts/SidebarContext";
import { getTheme } from "../../themes/getTheme";
import { getEntryCode } from "../../util/get-entry-code";
import { useView } from "../../contexts/ViewContext";
import { getBrowser } from "../../util/get-browser";
import { AssociationsPopup } from "../AssociationsPopup";
import { getEntryById } from "../../contexts/CaseContext";
import { getEvidenceIds, getEvidences } from "../../util/get-evidences";
import { useEvidence } from "../../contexts/EvidenceContext";

interface EntryProps {
  entry: IEntry;
  isBookmarked?: boolean;
  viewedBy: UserRole;
  isHidden?: boolean;
  isOld?: boolean;
  isHighlighted?: boolean;
  shownInPopup?: boolean;
  setAssociatedEntryInProgress?: (
    entry: IEntry,
    setIsNewEntryVisible: React.Dispatch<SetStateAction<boolean>>
  ) => void;
}

export const Entry: React.FC<EntryProps> = ({
  entry,
  viewedBy,
  isBookmarked = false,
  isHidden = false,
  isOld = false,
  isHighlighted = false,
  shownInPopup = false,
  setAssociatedEntryInProgress,
}) => {
  // Threaded entries
  const {
    entries,
    currentVersion,
    groupedEntries,
    setEntries,
    setHighlightedEntries,
    setIndividualEntrySorting,
  } = useCase();

  const {
    versionHistory,
    searchbarValue,
    hideEntriesHighlighter,
    getCurrentTool,
    highlightElementsWithSpecificVersion,
    selectedVersion,
    selectedTheme,
    showEntrySorting,
  } = useHeaderContext();

  const { setShowNotePopup, setAssociatedEntryIdNote } = useNotes();
  const { setShowJudgeHintPopup, setAssociatedEntryIdHint } = useHints();
  const { view } = useView();
  const {
    evidenceList,
    updateEvidenceList,
    removeEvidencesWithoutReferences,
    setPlaintiffFileVolume,
    setDefendantFileVolume,
  } = useEvidence();

  const versionTimestamp = versionHistory[entry.version - 1].timestamp;

  var thread: IEntry[] = [];
  if (view !== ViewMode.SideBySide)
    thread = groupedEntries[entry.sectionId][entry.id];

  // State of current entry
  const [isBodyOpen, setIsBodyOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAssociationsPopupOpen, setIsAssociationsPopupOpen] =
    useState<boolean>(false);
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);
  const [isEditErrorVisible, setIsEditErrorVisible] = useState<boolean>(false);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>(entry.author);
  const [lowerOpacityForSearch, setLowerOpcacityForSearch] =
    useState<boolean>(false);
  const [lowerOpcacityForHighlighters, setLowerOpcacityForHighlighters] =
    useState<boolean>(false);
  const { bookmarks, setBookmarks, deleteBookmarkByReference } = useBookmarks();
  const { setActiveSidebar } = useSidebar();
  const { user } = useUser();

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;
  const isOwnEntry =
    (viewedBy === UserRole.Plaintiff && entry.role === UserRole.Plaintiff) ||
    (viewedBy === UserRole.Defendant && entry.role === UserRole.Defendant);
  const canAddEntry = isJudge || !isOwnEntry;
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  const toggleBody = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    if (isEditing) {
      return;
    }
    setIsEditing(false);
    setIsBodyOpen(!isBodyOpen);
  };

  const createAssociatedEntryButton = useRef<HTMLAnchorElement | null>(null);

  const showNewEntry = () => {
    // TODO: check other browsers
    if (!getBrowser().includes("Firefox"))
      setTimeout(() => createAssociatedEntryButton.current?.click(), 1);
    if (view === ViewMode.SideBySide) {
      setAssociatedEntryInProgress!(entry, setIsNewEntryVisible);
    } else {
      setIsNewEntryVisible(true);
    }
  };

  const bookmarkEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      deleteBookmarkByReference(entry.id);
    } else {
      setIsMenuOpen(false);
      setBookmarks((oldBookmarks) => {
        const newBookmark: IBookmark = {
          id: uuidv4(),
          title: `Lesezeichen ${oldBookmarks.length + 1}`,
          associatedEntry: entry.id,
          isInEditMode: true,
        };
        const newBookmarks = [...oldBookmarks, newBookmark];
        return newBookmarks;
      });
      setActiveSidebar(SidebarState.Bookmarks);
    }
  };

  const getBookmarkTitle = () => {
    if (!isBookmarked) return;
    const bm = bookmarks.find(
      (bookmark) => bookmark.associatedEntry === entry.id
    );
    return bm ? bm.title : "";
  };

  const addNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowNotePopup(true);
    setAssociatedEntryIdNote(entry.id);
  };

  const addHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowJudgeHintPopup(true);
    setAssociatedEntryIdHint(entry.id);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const editEntry = (e: React.MouseEvent) => {
    setIsEditing(!isEditing);
    setIsBodyOpen(true);
  };

  const deleteEntry = (
    entryId: string,
    entryCode: string,
    sectionId: string
  ) => {
    deleteBookmarkByReference(entryId);
    let prevEntries = entries
      .filter((entry) => entry.id !== entryId)
      .map((entry, index) => {
        // Only update entries that were added in the current version and
        // are contained withing the specified section
        const isCurrentVersion = entry.version === currentVersion;
        const isInSection = entry.sectionId === sectionId;

        if (isCurrentVersion && isInSection) {
          const newEntryCode = entry.entryCode.split("-");
          if (
            Number(newEntryCode[newEntryCode.length - 1]) >
            Number(entryCode.split("-")[newEntryCode.length - 1])
          ) {
            newEntryCode[newEntryCode.length - 1] = String(
              Number(newEntryCode[newEntryCode.length - 1]) - 1
            );
            entry.entryCode = newEntryCode.join("-");
          }
        }
        return entry;
      });
    removeEvidencesWithoutReferences(prevEntries);
    setEntries(prevEntries);

    setIndividualEntrySorting((prevEntrySorting) => {
      let newEntrySorting: { [key: string]: IndividualEntrySortingEntry[] } = {
        ...prevEntrySorting,
      };
      const columnIndex = isPlaintiff ? 0 : 1;

      // Remove the entry from the sorting array
      newEntrySorting = Object.keys(prevEntrySorting).reduce(
        (acc, sectionId) => {
          const sectionSorting = newEntrySorting[sectionId].map((row) => {
            if (row.columns[columnIndex].includes(entryId)) {
              row.columns[columnIndex].filter((id) => id !== entryId);
              return row;
            }
            return row;
          });

          acc[sectionId] = sectionSorting;

          return acc;
        },
        {} as { [key: string]: IndividualEntrySortingEntry[] }
      );

      return newEntrySorting;
    });
  };

  const updateEntry = (
    plainText: string,
    rawHtml: string,
    evidences: IEvidence[],
    caveatOfProof: boolean
  ) => {
    if (plainText.length === 0) {
      toast("Bitte geben Sie einen Text ein.", { type: "error" });
      return;
    }
    updateEvidenceList(evidences, entries);
    const newEvidenceIds = getEvidenceIds(evidences);
    setIsEditing(false);
    setEntries((oldEntries) => {
      const newEntries = [...oldEntries];
      const entryIndex = newEntries.findIndex(
        (newEntry) => newEntry.id === entry.id
      );
      newEntries[entryIndex].text = rawHtml;
      newEntries[entryIndex].author = authorName || entry.author;
      newEntries[entryIndex].evidenceIds = newEvidenceIds;
      newEntries[entryIndex].caveatOfProof = caveatOfProof;
      removeEvidencesWithoutReferences(newEntries);
      return newEntries;
    });

    // Remove highlighter if entry was edited since it is no longer the same
    setHighlightedEntries((prevEntries) =>
      prevEntries.filter((prevEntry) => prevEntry.entryId !== entry.id)
    );
  };

  return (
    <>
      <div
        id={entry.entryCode}
        className={cx("text-sm", {
          "opacity-50": isHidden,
          "opacity-30 pointer-events-none":
            (!lowerOpacityForSearch && searchbarValue !== "" && !isEditing) ||
            (searchbarValue === "" &&
              lowerOpcacityForHighlighters &&
              hideEntriesHighlighter &&
              getCurrentTool.id === Tool.Cursor),
          "pointer-events-none": isHidden,
          "w-1/2": shownInPopup,
        })}>
        <div
          className={cx("flex flex-col", {
            "items-end": !isPlaintiff && !shownInPopup,
          })}>
          <div
            className={cx("transition-all", {
              "w-[calc(50%_-_12px)]":
                !isExpanded && view === ViewMode.Columns && !showEntrySorting,
              "w-full":
                isExpanded || view === ViewMode.Rows || showEntrySorting,
              "mt-6":
                (isExpanded || view === ViewMode.Rows || showEntrySorting) &&
                entry.associatedEntry &&
                entry.role === UserRole.Plaintiff &&
                !shownInPopup,
              "w-[calc(100%_-_12px)]":
                !isExpanded &&
                (view === ViewMode.SideBySide || shownInPopup) &&
                !showEntrySorting,
            })}>
            {/* Entry */}
            {/* visualize association */}
            {entry.associatedEntry && !shownInPopup ? (
              <a
                href={`#${getEntryCode(entries, entry.associatedEntry)}`}
                className={cx(
                  "flex flex-row gap-1 self-center text-xs font-normal rounded-t-md p-1 w-fit h-50 -mt-50 hover:text-white",
                  {
                    [`mr-0 ml-auto bg-${
                      getTheme(selectedTheme)?.primaryPlaintiff
                    } text-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
                      entry.entryCode?.charAt(0) === "B",
                    [`bg-${getTheme(selectedTheme)?.primaryDefendant} text-${
                      getTheme(selectedTheme)?.secondaryDefendant
                    }`]: entry.entryCode?.charAt(0) === "K",
                  }
                )}
                onClick={(e) => e.stopPropagation()}>
                <ArrowBendDownRight size={14}></ArrowBendDownRight>
                {`Bezieht sich auf ${getEntryCode(
                  entries,
                  entry.associatedEntry
                )}`}
                <div
                  className={cx("h-[16px] w-[0.5px]", {
                    [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
                      entry.entryCode?.charAt(0) === "B",
                    [`bg-${getTheme(selectedTheme)?.secondaryDefendant}`]:
                      entry.entryCode?.charAt(0) === "K",
                  })}></div>
                <Tooltip text="Bezugnahme gesondert anzeigen">
                  <ArrowSquareOut
                    size={14}
                    onClick={() =>
                      setIsAssociationsPopupOpen(true)
                    }></ArrowSquareOut>
                </Tooltip>
              </a>
            ) : (
              //spacing
              <div className="h-6"></div>
            )}
            <div
              className={cx("shadow rounded-lg", {
                "outline outline-2 outline-offset-4 outline-blue-600":
                  selectedVersion + 1 === entry.version &&
                  highlightElementsWithSpecificVersion,
                isHighlighted,
              })}>
              <div
                className={cx("", {
                  [`pr-1 rounded-l-xl rounded-br-lg bg-${
                    getTheme(selectedTheme)?.primaryPlaintiff
                  }`]:
                    entry.entryCode?.charAt(0) === "B" &&
                    entry.associatedEntry &&
                    !shownInPopup,
                  [`pl-1 rounded-r-xl rounded-bl-lg bg-${
                    getTheme(selectedTheme)?.primaryDefendant
                  }`]:
                    entry.entryCode?.charAt(0) === "K" &&
                    entry.associatedEntry &&
                    !shownInPopup,
                })}>
                <EntryHeader
                  isPlaintiff={isPlaintiff}
                  isBodyOpen={isBodyOpen}
                  toggleBody={toggleBody}>
                  <div className="overflow-auto max-w-[350px] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={cx(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          {
                            [`bg-${
                              getTheme(selectedTheme)?.primaryPlaintiff
                            } text-${
                              getTheme(selectedTheme)?.secondaryPlaintiff
                            }`]: isPlaintiff,
                            [`bg-${
                              getTheme(selectedTheme)?.primaryDefendant
                            } text-${
                              getTheme(selectedTheme)?.secondaryDefendant
                            }`]: !isPlaintiff,
                          }
                        )}>
                        {entry.entryCode}
                      </span>
                      {isEditing ? (
                        <EditText
                          inputClassName={cx(
                            "font-bold h-[28px] p-0 my-0 focus:outline-none bg-transparent",
                            {
                              [`border-${
                                getTheme(selectedTheme)?.primaryPlaintiff
                              }`]: isPlaintiff,
                              [`border-${
                                getTheme(selectedTheme)?.primaryDefendant
                              }`]: !isPlaintiff,
                            }
                          )}
                          className={cx(
                            "font-bold p-0 my-0 flex items-center mr-2",
                            {
                              [`text-${
                                getTheme(selectedTheme)?.primaryPlaintiff
                              }`]: isPlaintiff,
                              [`text-${
                                getTheme(selectedTheme)?.primaryDefendant
                              }`]: !isPlaintiff,
                            }
                          )}
                          value={authorName}
                          onChange={(e) => {
                            setAuthorName(e.target.value);
                          }}
                          showEditButton
                          editButtonContent={
                            <Tooltip asChild text="Name bearbeiten">
                              <Pencil />
                            </Tooltip>
                          }
                          editButtonProps={{
                            className: cx("bg-transparent flex items-center"),
                          }}
                        />
                      ) : (
                        <span className="font-bold">{entry.author}</span>
                      )}
                      <span>
                        {entry.version < currentVersion &&
                          format(new Date(versionTimestamp), "dd.MM.yyyy")}
                      </span>
                    </div>
                  </div>
                  {!shownInPopup && user?.role !== UserRole.Client && (
                    <div className="flex gap-2">
                      <Tooltip
                        text={
                          isBookmarked ? (
                            <span>
                              Lesezeichen <b>{getBookmarkTitle()}</b> entfernen
                            </span>
                          ) : (
                            "Zu Lesezeichen hinzufügen"
                          )
                        }>
                        <Action
                          onClick={bookmarkEntry}
                          isPlaintiff={isPlaintiff}>
                          <BookmarkSimple
                            size={20}
                            weight={isBookmarked ? "fill" : "regular"}
                          />
                        </Action>
                      </Tooltip>
                      <Tooltip text="Notiz hinzufügen">
                        <Action onClick={addNote} isPlaintiff={isPlaintiff}>
                          <Notepad size={20} />
                        </Action>
                      </Tooltip>
                      {(isJudge || (entry.role === viewedBy && !isOld)) && (
                        <div ref={menuRef} className="flex relative space-y-2">
                          <Tooltip text="Mehr Optionen">
                            <Action
                              className={cx({
                                [`bg-${
                                  getTheme(selectedTheme)?.primaryPlaintiff
                                } text-${
                                  getTheme(selectedTheme)?.secondaryPlaintiff
                                }`]: isPlaintiff && isMenuOpen,
                                [`bg-${
                                  getTheme(selectedTheme)?.primaryDefendant
                                } text-${
                                  getTheme(selectedTheme)?.secondaryDefendant
                                }`]: !isPlaintiff && isMenuOpen,
                              })}
                              onClick={toggleMenu}
                              isPlaintiff={isPlaintiff}>
                              <DotsThree size={20} />
                            </Action>
                          </Tooltip>
                          {isMenuOpen ? (
                            <ul className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl min-w-[250px] shadow-lg z-50">
                              {isJudge && (
                                <li
                                  tabIndex={0}
                                  onClick={addHint}
                                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                                  <Scales size={20} />
                                  Hinweis hinzufügen
                                </li>
                              )}
                              {!isOld && (
                                <>
                                  <li
                                    tabIndex={0}
                                    onClick={editEntry}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                                    <Pencil size={20} />
                                    Bearbeiten
                                  </li>
                                  <li
                                    tabIndex={0}
                                    onClick={() =>
                                      setIsDeleteErrorVisible(true)
                                    }
                                    className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                                    <Trash size={20} />
                                    Löschen
                                  </li>
                                </>
                              )}
                            </ul>
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                </EntryHeader>
                {/* Body */}
                {isBodyOpen && !isEditing && (
                  <EntryBody
                    isPlaintiff={isPlaintiff}
                    setLowerOpcacityForSearch={setLowerOpcacityForSearch}
                    setLowerOpcacityForHighlighters={
                      setLowerOpcacityForHighlighters
                    }
                    lowerOpcacityForHighlighters={lowerOpcacityForHighlighters}
                    entryId={entry.id}
                    caveatOfProof={entry.caveatOfProof}
                    showInPopup={shownInPopup}
                    evidences={getEvidences(evidenceList, entry.evidenceIds)}>
                    {entry.text}
                  </EntryBody>
                )}
                {isBodyOpen && isEditing && (
                  <EntryForm
                    entryId={entry.id}
                    caveatOfProof={entry.caveatOfProof}
                    defaultContent={entry.text}
                    isPlaintiff={isPlaintiff}
                    isExpanded={isExpanded}
                    setIsExpanded={() => setIsExpanded(!isExpanded)}
                    onAbort={() => {
                      setIsEditErrorVisible(true);
                    }}
                    onSave={(
                      plainText: string,
                      rawHtml: string,
                      evidences: IEvidence[],
                      caveatOfProof: boolean,
                      plaintiffVolume: number,
                      defendantFileVolume: number
                    ) => {
                      updateEntry(plainText, rawHtml, evidences, caveatOfProof);
                      setPlaintiffFileVolume(plaintiffVolume);
                      setDefendantFileVolume(defendantFileVolume);
                      setIsExpanded(false);
                    }}
                    evidences={getEvidences(evidenceList, entry.evidenceIds)}
                  />
                )}
              </div>
            </div>
            {/* Button to add response */}
            {canAddEntry &&
            !isNewEntryVisible &&
            !showEntrySorting &&
            !shownInPopup &&
            user?.role !== UserRole.Client ? (
              <a
                className="inline-block"
                href={`#${entry.sectionId}-scroll`}
                ref={createAssociatedEntryButton}>
                <Button
                  size="sm"
                  alternativePadding="mt-2"
                  bgColor="bg-lightGrey hover:bg-mediumGrey"
                  textColor="text-darkGrey hover:text-offWhite"
                  onClick={showNewEntry}
                  icon={<ArrowBendLeftUp weight="bold" size={18} />}>
                  Auf diesen Beitrag Bezug nehmen
                </Button>
              </a>
            ) : (
              //spacing
              <div className="h-9"></div>
            )}
          </div>
          {isNewEntryVisible && (
            <div className={cx(`flex flex-col w-full`)}>
              {view !== ViewMode.Columns && (
                <button className="ml-5 w-5 border-l-2 border-lightGrey"></button>
              )}
              <NewEntry
                roleForNewEntry={
                  entry.role === UserRole.Plaintiff
                    ? UserRole.Defendant
                    : UserRole.Plaintiff
                }
                sectionId={entry.sectionId}
                associatedEntry={entry.id}
                setIsNewEntryVisible={setIsNewEntryVisible}
              />
            </div>
          )}
        </div>
      </div>
      {thread?.length > 0 && !showEntrySorting && !shownInPopup && (
        <div
          className={cx({
            flex: view !== ViewMode.Columns,
          })}>
          {view !== ViewMode.Columns && (
            <button className="mt-6 ml-5 w-5 border-l-2 border-lightGrey" />
          )}
          <EntryList entriesList={thread} sectionId={thread[0].sectionId} />
        </div>
      )}
      <ErrorPopup isVisible={isEditErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie Ihre Änderungen verwerfen und somit{" "}
            <strong>nicht</strong> speichern möchten?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsEditErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsEditErrorVisible(false);
                setIsNewEntryVisible(false);
                setIsEditing(false);
              }}>
              Verwerfen
            </Button>
          </div>
        </div>
      </ErrorPopup>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie diesen Beitrag löschen möchten? Diese
            Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsDeleteErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
                deleteEntry(entry.id, entry.entryCode, entry.sectionId);
              }}>
              Beitrag löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
      {isAssociationsPopupOpen && (
        <AssociationsPopup
          setIsAssociationsPopupOpen={setIsAssociationsPopupOpen}
          entry={entry}
          associatedEntry={
            getEntryById(entries, entry.associatedEntry!)!
          }></AssociationsPopup>
      )}
    </>
  );
};
