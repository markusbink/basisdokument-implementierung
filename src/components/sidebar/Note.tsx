import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { DotsThree, Eye, PencilSimple, Trash } from "phosphor-react";
import React, { useRef, useState } from "react";
import { useCase, useHeaderContext, useNotes } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { getTheme } from "../../themes/getTheme";
import { INote } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";

export interface NoteProps {
  note: INote;
}

export const Note: React.FC<NoteProps> = ({ note }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));
  const { entries } = useCase();
  const { notes, setNotes } = useNotes();
  const {
    setShowNotePopup,
    setTitle,
    setEditorState,
    setOpenedNoteId,
    setAssociatedEntryIdNote,
    setEditMode,
  } = useNotes();

  const { selectedTheme } = useHeaderContext();

  let entryCode;
  if (note.associatedEntry) {
    try {
      entryCode = getEntryCode(entries, note.associatedEntry);
    } catch {}
  }

  const editNote = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    setShowNotePopup(true);
    setTitle(note.title);
    setOpenedNoteId(note.id);
    setEditMode(true);
    if (note.associatedEntry) {
      setAssociatedEntryIdNote(note.associatedEntry);
    }
    const blocksFromHTML = convertFromHTML(note.text);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  };

  const deleteNote = () => {
    setNotes(notes.filter((item) => item.id !== note.id));
  };

  return (
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {note.associatedEntry && (
          <a
            href={`#${entryCode}`}
            className={cx(
              "flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit cursor-pointer text-[10px] font-semibold rounded-xl",
              {
                "bg-darkGrey text-offWhite hover:bg-mediumGrey": !entryCode,
                [`bg-${getTheme(selectedTheme)?.secondaryLeft} text-${
                  getTheme(selectedTheme)?.primaryLeft
                } hover-bg-${getTheme(selectedTheme)?.primaryLeft} hover-text-${
                  getTheme(selectedTheme)?.secondaryLeft
                }`]: entryCode?.charAt(0) === "K",
                [`bg-${getTheme(selectedTheme)?.secondaryRight} text-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-bg-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-text-${getTheme(selectedTheme)?.secondaryRight}`]:
                  entryCode?.charAt(0) === "B",
              }
            )}>
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${entryCode ? entryCode : "nicht verfügbar"}`}
          </a>
        )}

        <div className={cx("mx-3", { "mt-3": !note.associatedEntry })}>
          <h3 className="mb-2 text-sm font-bold">{note.title}</h3>
          <p className="mb-2" dangerouslySetInnerHTML={{ __html: note.text }} />

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{note.author}</div>
              <div className="opacity-40">{`${new Date(
                Date.parse(String(note.timestamp))
              ).toLocaleString("de-DE")}`}</div>
            </div>

            <div ref={ref} className="self-end relative">
              <Button
                key="createNote"
                bgColor={
                  isMenuOpen ? "bg-lightGrey" : "bg-offWhite hover:bg-lightGrey"
                }
                size="sm"
                textColor="text-darkGrey"
                hasText={false}
                alternativePadding="p-1"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                icon={<DotsThree size={20} weight="bold" />}></Button>{" "}
              {isMenuOpen ? (
                <ul className="absolute right-0 bottom-8 p-2 bg-white text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                  <li
                    tabIndex={0}
                    onClick={editNote}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                    <PencilSimple size={16} />
                    Bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={() => setIsDeleteErrorVisible(true)}
                    className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                    <Trash size={16} />
                    Löschen
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base font-normal">
            Sind Sie sicher, dass Sie die Notiz <b>{note.title}</b> löschen
            möchten? Diese Aktion kann nicht rückgängig gemacht werden.
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
                deleteNote();
              }}>
              Notiz löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </div>
  );
};
