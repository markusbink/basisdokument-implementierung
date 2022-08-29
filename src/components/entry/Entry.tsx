import cx from "classnames";
import { format } from "date-fns";
import {
  ArrowBendLeftUp,
  BookmarkSimple,
  DotsThree,
  Notepad,
  Pencil,
  Scales,
  Trash,
} from "phosphor-react";
import React, { useRef, useState } from "react";
import { EditText } from "react-edit-text";
import { toast } from "react-toastify";
import { Action, EntryBody, EntryForm, EntryHeader, NewEntry } from ".";
import { useCase, useHeaderContext } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IEntry, UserRole, Tool } from "../../types";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";
import { Tooltip } from "../Tooltip";
import { EntryList } from "./EntryList";
import { LitigiousCheck } from "./LitigiousCheck";

interface EntryProps {
  entry: IEntry;
  isBookmarked?: boolean;
  viewedBy: UserRole;
  isHidden?: boolean;
  isOld?: boolean;
  isHighlighted?: boolean;
}

export const Entry: React.FC<EntryProps> = ({ entry, viewedBy, isBookmarked = false, isHidden = false, isOld = false, isHighlighted = false }) => {
  // Threaded entries
  const { currentVersion, groupedEntries, setEntries } = useCase();
  const { versionHistory, showColumnView, searchbarValue, hideEntriesHighlighter, getCurrentTool, hideElementsWithoutSpecificVersion, selectedVersion} = useHeaderContext();

  const versionTimestamp = versionHistory[entry.version - 1].timestamp;
  const thread = groupedEntries[entry.sectionId][entry.id];

  // State of current entry
  const [isBodyOpen, setIsBodyOpen] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);
  const [isLitigious, setIsLitigious] = useState<boolean | null>(null);
  const [isEditErrorVisible, setIsEditErrorVisible] = useState<boolean>(false);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>(entry.author);
  const [lowerOpacityForSearch, setLowerOpcacityForSearch] = useState<boolean>(false);
  const [lowerOpcacityForHighlighters, setLowerOpcacityForHighlighters] = useState<boolean>(false);

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;
  const isOwnEntry = (viewedBy === UserRole.Plaintiff && entry.role === "Kläger") || (viewedBy === UserRole.Defendant && entry.role === "Beklagter");
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

  const showNewEntry = () => {
    setIsNewEntryVisible(true);
  };

  const bookmarkEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
  };

  const addNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const editEntry = (e: React.MouseEvent) => {
    setIsEditing(!isEditing);
    setIsBodyOpen(true);
  };

  const deleteEntry = (entryId: string, entryCode: string, sectionId: string) => {
    setEntries((prevEntries) =>
      prevEntries
        .filter((entry) => entry.id !== entryId)
        .map((entry, index) => {
          // Only update entries that were added in the current version and
          // are contained withing the specified section
          const isCurrentVersion = entry.version === currentVersion;
          const isInSection = entry.sectionId === sectionId;

          if (isCurrentVersion && isInSection) {
            const newEntryCode = entry.entryCode.split("-");
            if (Number(newEntryCode[newEntryCode.length - 1]) > Number(entryCode.split("-")[newEntryCode.length - 1])) {
              newEntryCode[newEntryCode.length - 1] = String(Number(newEntryCode[newEntryCode.length - 1]) - 1);
              entry.entryCode = newEntryCode.join("-");
            }
          }
          return entry;
        })
    );
  };

  const updateEntry = (plainText: string, rawHtml: string) => {
    if (plainText.length === 0) {
      toast("Bitte geben Sie einen Text ein.", { type: "error" });
      return;
    }

    setIsEditing(false);
    setEntries((oldEntries) => {
      const newEntries = [...oldEntries];
      const entryIndex = newEntries.findIndex((newEntry) => newEntry.id === entry.id);
      newEntries[entryIndex].text = rawHtml;
      newEntries[entryIndex].author = authorName || entry.author;
      return newEntries;
    });
  };

  const addHint = () => {};

  return (
    <>
      <div
        id={entry.entryCode}
        className={cx("text-sm", {
          "opacity-50": isHidden,
          "opacity-30 pointer-events-none":(!lowerOpacityForSearch && searchbarValue !== "" && !isEditing) || (searchbarValue === "" && lowerOpcacityForHighlighters && hideEntriesHighlighter && getCurrentTool.id === Tool.Cursor),
          "pointer-events-none": isHidden,
        })}
      >
        <div
          className={cx("flex flex-col", {
            "items-end": !isPlaintiff,
          })}
        >
          <div
            className={cx("transition-all", {
              "w-[calc(50%_-_12px)]": !isExpanded && showColumnView,
              "w-full": isExpanded || !showColumnView,
            })}
          >
            {/* Entry */}
            <div
              className={cx("shadow rounded-lg bg-white relative", {
                "outline outline-2 outline-offset-4 outline-blue-600": selectedVersion + 1 === entry.version && hideElementsWithoutSpecificVersion,
              })}
            >
              {isJudge && (
                <LitigiousCheck
                  isLitigious={isLitigious}
                  setIsLitigious={setIsLitigious}
                />
              )}
              <EntryHeader
                isPlaintiff={isPlaintiff}
                isBodyOpen={isBodyOpen}
                toggleBody={toggleBody}
              >

                <div className="overflow-auto max-w-[350px] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={cx("rounded-full px-3 py-1 text-xs font-semibold", {
                        "bg-darkPurple text-lightPurple": isPlaintiff,
                        "bg-darkPetrol text-lightPetrol": !isPlaintiff,
                      })}
                    >
                      {entry.entryCode}
                    </span>
                    {isEditing ? (
                      <EditText
                        inputClassName={cx("font-bold h-[28px] p-0 my-0 focus:outline-none bg-transparent", {
                          "border-darkPurple": isPlaintiff,
                          "border-darkPetrol": !isPlaintiff,
                        })}
                        className={cx("font-bold p-0 my-0 flex items-center mr-2", {
                          "text-darkPurple": isPlaintiff,
                          "text-darkPetrol": !isPlaintiff,
                        })}
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
                    <span>{entry.version < currentVersion && format(new Date(versionTimestamp), "dd.MM.yyyy")}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Tooltip text="Zu Lesezeichen hinzufügen">
                    <Action onClick={bookmarkEntry} isPlaintiff={isPlaintiff}>
                      <BookmarkSimple size={20} weight={isBookmarked ? "fill" : "regular"} />
                    </Action>
                  </Tooltip>
                  <Tooltip text="Notiz hinzufügen">
                    <Action onClick={addNote} isPlaintiff={isPlaintiff}>
                      <Notepad size={20} />
                    </Action>
                  </Tooltip>
                  {(isJudge || (entry.role === viewedBy && !isOld)) && (
                    <div className="flex relative space-y-2">
                      <Tooltip text="Mehr Optionen">
                        <Action
                          className={cx({
                            "bg-darkPurple text-lightPurple": isPlaintiff && isMenuOpen,
                            "bg-darkPetrol text-lightPetrol": !isPlaintiff && isMenuOpen,
                          })}
                          onClick={toggleMenu}
                          isPlaintiff={isPlaintiff}
                        >
                          <DotsThree size={20} />
                        </Action>
                      </Tooltip>
                      {isMenuOpen ? (
                        <ul
                          ref={menuRef}
                          className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl min-w-[250px] shadow-lg z-50"
                        >
                          {isJudge && (
                            <li tabIndex={0} onClick={addHint} className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                              <Scales size={20} />
                              Hinweis hinzufügen
                            </li>
                          )}
                          {!isOld && (
                            <>
                              <li tabIndex={0} onClick={editEntry} className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
                                <Pencil size={20} />
                                Bearbeiten
                              </li>
                              <li
                                tabIndex={0}
                                onClick={() => setIsDeleteErrorVisible(true)}
                                className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                              >
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
              </EntryHeader>
              {/* Body */}
              {isBodyOpen && !isEditing && (
                <EntryBody
                  isPlaintiff={isPlaintiff}
                  setLowerOpcacityForSearch={setLowerOpcacityForSearch}
                  setLowerOpcacityForHighlighters={setLowerOpcacityForHighlighters}
                  lowerOpcacityForHighlighters={lowerOpcacityForHighlighters}
                  entryId={entry.id}
                >
                  {entry.text}
                </EntryBody>
              )}
              {isBodyOpen && isEditing && (
                <EntryForm
                  defaultContent={entry.text}
                  isPlaintiff={isPlaintiff}
                  isExpanded={isExpanded}
                  setIsExpanded={() => setIsExpanded(!isExpanded)}
                  onAbort={() => {
                    setIsEditErrorVisible(true);
                  }}
                  onSave={(plainText: string, rawHtml: string) => {
                    updateEntry(plainText, rawHtml);
                    setIsExpanded(false);
                  }}
                />
              )}
            </div>
            {/* Button to add response */}
            {canAddEntry && !isNewEntryVisible && (
              <Button
                onClick={showNewEntry}
                icon={<ArrowBendLeftUp weight="bold" size={18} />}
                size="sm"
                bgColor="transparent"
                textColor={cx("font-bold", {
                  "text-darkPurple": isPlaintiff,
                  "text-darkPetrol": !isPlaintiff,
                })}
              >
                Text verfassen
              </Button>
            )}
          </div>
          {isNewEntryVisible && (
            <div className={cx("flex flex-col w-full")}>
              {!showColumnView && <button className="ml-5 w-5 border-l-2 border-lightGrey"></button>}
              <NewEntry
                roleForNewEntry={entry.role === UserRole.Plaintiff ? UserRole.Defendant : UserRole.Plaintiff}
                sectionId={entry.sectionId}
                associatedEntry={entry.associatedEntry ? entry.associatedEntry : entry.id}
                setIsNewEntryVisible={setIsNewEntryVisible}
              />
            </div>
          )}
        </div>
      </div>
      {thread?.length > 0 && (
        <div
          className={cx({
            flex: !showColumnView,
          })}
        >
          {!showColumnView && <button className="ml-5 w-5 border-l-2 border-lightGrey"></button>}
          <EntryList entries={thread} />
        </div>
      )}
      <ErrorPopup isVisible={isEditErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie Ihre Änderungen verwerfen und somit <strong>nicht</strong> speichern möchten?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey"
              textColor="text-mediumGrey font-bold"
              onClick={() => {
                setIsEditErrorVisible(false);
              }}
            >
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsEditErrorVisible(false);
                setIsNewEntryVisible(false);
                setIsEditing(false);
              }}
            >
              Verwerfen
            </Button>
          </div>
        </div>
      </ErrorPopup>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">Sind Sie sicher, dass Sie diesen Beitrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey"
              textColor="text-mediumGrey font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
              }}
            >
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
                deleteEntry(entry.id, entry.entryCode, entry.sectionId);
              }}
            >
              Beitrag Löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </>
  );
};
