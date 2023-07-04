import { XCircle, WarningCircle, Quotes, X } from "phosphor-react";
import cx from "classnames";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useCase, useNotes, useUser } from "../contexts";
import draftToHtml from "draftjs-to-html";
import { IEntry, INote } from "../types";
import { v4 as uuidv4 } from "uuid";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const toolbarOptions = {
  options: ["inline", "list", "textAlign"],
  inline: {
    className: ["!mb-0"],
    options: ["bold", "italic", "underline", "strikethrough"],
  },
  list: {
    className: ["!mb-0"],
    options: ["unordered", "ordered"],
  },
  textAlign: {
    className: ["!mb-0"],
    options: ["left", "center", "right", "justify"],
  },
};

export const NotePopup = () => {
  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const {
    setShowNotePopup,
    contentState,
    editorState,
    setEditorState,
    title,
    setTitle,
    showErrorText,
    setShowErrorText,
    updateNote,
    setOpenedNoteId,
    openedNoteId,
    associatedEntryIdNote,
    setAssociatedEntryIdNote,
    setNotes,
    notes,
    editMode,
    setEditMode,
  } = useNotes();

  const { user } = useUser();
  const { entries } = useCase();

  useEffect(() => {
    setHidePlaceholder(
      () => contentState.getBlockMap().first().getType() !== "unstyled"
    );
  }, [contentState]);

  const resetStates = () => {
    setTitle("");
    const blocksFromHTML = convertFromHTML("");
    const contentStateNew = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentStateNew));
    setShowNotePopup(false);
    setShowErrorText(false);
    setOpenedNoteId("");
    setAssociatedEntryIdNote("");
    setEditMode(false);
  };

  const addNote = () => {
    const newHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (title === "") {
      setShowErrorText(true);
    } else {
      // edit Note
      if (openedNoteId !== "" && user !== null) {
        let editedNote: INote = {
          id: openedNoteId,
          title: title,
          text: newHtml,
          author: user?.name,
          timestamp: new Date(),
        };
        if (associatedEntryIdNote !== "") {
          editedNote["associatedEntry"] = associatedEntryIdNote;
        }
        updateNote(editedNote);
      } else {
        if (user !== null) {
          let newNote: INote = {
            id: uuidv4(),
            title: title,
            text: newHtml,
            author: user?.name,
            timestamp: new Date(),
          };
          if (associatedEntryIdNote !== "") {
            newNote["associatedEntry"] = associatedEntryIdNote;
          }
          setNotes([...notes, newNote]);
        }
      }
      resetStates();
    }
  };

  const getEntryCode = () => {
    let entry = entries.find((obj) => {
      return obj.id === associatedEntryIdNote;
    });
    if (entry) {
      return entry.entryCode;
    }
    return "Beitrag nicht gefunden";
  };

  return (
    <>
      <div
        className={cx(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none",
          {
            "RichEditor-hidePlaceholder": hidePlaceholder,
          }
        )}>
        <div className="w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg ">
              <h3 className="text-xl font-bold text-darkGrey">
                {`${editMode ? "Notiz bearbeiten" : "Neue Notiz hinzufügen"}`}
              </h3>
              <div>
                <button
                  onClick={() => {
                    setShowErrorText(false);
                    setShowNotePopup(false);
                    if (editMode) {
                      resetStates();
                    }
                    setEditMode(false);
                  }}
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mx-20 p-3 bg-offWhite rounded-lg font-bold text-darkGrey">
              <span>
                <WarningCircle size={40} />
              </span>
              <p className="text-sm">
                Alle Notizen sind privat und können nicht von den anderen
                Parteien eingesehen werden. Sie können die Notiz zu jedem
                Zeitpunkt bearbeiten und löschen.
              </p>
            </div>
            {/*body*/}
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="note_popup_input"
                  className="leading-relaxed text-base font-bold text-darkGrey">
                  Titel
                </label>
                <span className="text-darkRed">*</span>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  id="note_popup_input"
                  className="w-full px-2 py-2 text-sm bg-offWhite block rounded text-mediumGrey focus:outline-none"
                  placeholder="Titel eingeben..."></input>
              </div>
              <div>
                <label className="my-4 text-base leading-relaxed font-bold text-darkGrey">
                  Text
                </label>
                <Editor
                  defaultEditorState={editorState}
                  stripPastedStyles={true}
                  onEditorStateChange={setEditorState}
                  wrapperClassName={cx("w-full focus:outline-none")}
                  editorClassName="p-2 text-sm bg-offWhite text-mediumGrey rounded min-h-[100px] max-h-[200px]"
                  placeholder="Text eingeben..."
                  toolbarClassName={cx("p-2 border-none border-white")}
                  toolbar={toolbarOptions}
                />
              </div>
              <div className="space-y-2">
                <label className="my-4 text-base leading-relaxed font-bold text-darkGrey">
                  Verweis auf einen Beitrag hinzufügen
                </label>
                <div className="flex flex-row w-fit p-2 items-center rounded-lg bg-offWhite text-darkGrey gap-3">
                  <span className="text-sm">Beitrag auswählen:</span>
                  <div className="flex flex-row items-center justify-center border-lightGrey border border-solid p-2 rounded-lg">
                    <DropdownMenu.Root modal={false}>
                      <DropdownMenu.Trigger className="justify-center bg-darkGrey hover:bg-mediumGrey rounded flex items-center h-6 w-6">
                        <Quotes size={14} color="white" weight="regular" />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content className="flex flex-col gap-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-[200px] mt-5 p-2 overflow-auto">
                          {entries.length === 0 && (
                            <div className="p-2 text-sm">
                              Es sind keine Beiträge im Basisdokument vorhanden.
                            </div>
                          )}
                          {entries &&
                            entries.map((entry: IEntry) => (
                              <DropdownMenu.Item
                                key={entry.id}
                                onClick={() => {
                                  setAssociatedEntryIdNote(entry.id);
                                }}
                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full rounded-md cursor-pointer"
                                role="menuitem"
                                id="menu-item-0">
                                {entry.entryCode}
                              </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    {associatedEntryIdNote !== "" ? (
                      <div className="flex items-center gap-2 cursor-pointer rounded-full pl-3 pr-1 py-1 mx-1 text-xs font-semibold bg-darkGrey text-white">
                        {getEntryCode()}
                        <XCircle
                          size={20}
                          weight="fill"
                          onClick={() => {
                            setAssociatedEntryIdNote("");
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {showErrorText ? (
                <p className="p-2 bg-lightRed text-darkRed rounded-md w-auto">
                  Bitte geben Sie einen Titel ein.
                </p>
              ) : null}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end">
              <button
                className="bg-darkGrey hover:bg-mediumGrey rounded-md text-white py-2 px-3 text-sm"
                onClick={() => {
                  addNote();
                }}>
                Notiz {`${editMode ? "speichern" : "hinzufügen"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
