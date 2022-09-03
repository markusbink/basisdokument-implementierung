import { XCircle, WarningCircle, Quotes } from "phosphor-react";
import { Button } from "./Button";
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
import { INote } from "../types";
import { v4 as uuidv4 } from "uuid";

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
    associatedEntryId,
    setAssociatedEntryId,
    setNotes,
    notes,
  } = useNotes();

  const { user } = useUser();
  const { entries } = useCase();

  useEffect(() => {
    setHidePlaceholder(
      () => contentState.getBlockMap().first().getType() !== "unstyled"
    );
  }, [contentState]);

  const addNote = () => {
    const newHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (title === "" || newHtml === "<p></p>\n") {
      setShowErrorText(true);
    } else {
      // edit Note
      if (openedNoteId !== "" && user !== null) {
        let newNote: INote = {
          id: openedNoteId,
          title: title,
          text: newHtml,
          author: user?.name,
          timestamp: new Date(),
        };
        if (associatedEntryId !== "") {
          newNote["associatedEntry"] = associatedEntryId;
        }
        updateNote(newNote);
      } else {
        if (user !== null) {
          let newNote: INote = {
            id: uuidv4(),
            title: title,
            text: newHtml,
            author: user?.name,
            timestamp: new Date(),
          };
          if (associatedEntryId !== "") {
            newNote["associatedEntry"] = associatedEntryId;
          }
          setNotes([...notes, newNote]);
        }
      }

      // Reset all states
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
      setAssociatedEntryId("");
    }
  };

  const getEntryCode = () => {
    let entry = entries.find((obj) => {
      return obj.id === associatedEntryId;
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
              <h3 className="text-2xl font-bold text-darkGrey">
                Neue Notiz verfassen
              </h3>
              <div>
                <button
                  onClick={() => {
                    setShowErrorText(false);
                    setShowNotePopup(false);
                  }}
                  className="text-darkGrey">
                  <XCircle size={29} weight="fill" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mx-20 p-3 bg-lightOrange rounded-lg font-bold text-darkOrange">
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
                  className="leading-relaxed text-lg font-bold text-darkGrey">
                  Titel
                </label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  id="note_popup_input"
                  className="w-full px-2 py-3 bg-offWhite block rounded text-mediumGrey focus:outline-none"
                  placeholder="Titel eingeben..."></input>
              </div>
              <div>
                <label className="my-4 text-lg leading-relaxed font-bold text-darkGrey">
                  Text
                </label>
                <Editor
                  defaultEditorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName={cx("w-full focus:outline-none")}
                  editorClassName="p-3 bg-offWhite text-mediumGrey rounded min-h-[140px]"
                  placeholder="Text eingeben..."
                  toolbarClassName={cx("p-2 border-none border-white")}
                  toolbar={toolbarOptions}
                />
              </div>
              <div className="space-y-2">
                <label className="my-4 text-lg leading-relaxed font-bold text-darkGrey">
                  Verweis auf einen Beitrag hinzufügen
                </label>
                <div className="flex p-3 items-center justify-content w-fit rounded-lg bg-offWhite text-darkGrey gap-3">
                  <p className="text-sm">Beitrag auswählen:</p>
                  <div className="flex flex-1 border-lightGrey border border-solid p-1 rounded-lg">
                    <div className="bg-darkGrey rounded flex items-center p-1 m-1">
                      <Quotes size={16} color="white" weight="regular" />
                    </div>

                    {associatedEntryId !== "" ? (
                      <div className="flex items-center gap-2 cursor-pointer rounded-full pl-3 pr-1 py-1 m-1 text-xs font-semibold bg-darkGrey text-white">
                        {getEntryCode()}
                        <XCircle
                          size={20}
                          weight="fill"
                          onClick={() => {
                            setAssociatedEntryId("");
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
                  Bitte geben Sie einen Titel und einen Text ein.
                </p>
              ) : null}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end">
              <Button
                onClick={() => {
                  addNote();
                }}>
                Notiz hinzufügen
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
