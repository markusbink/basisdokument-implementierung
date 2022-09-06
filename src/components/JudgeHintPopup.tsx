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
import { useHints, useCase, useUser } from "../contexts";
import draftToHtml from "draftjs-to-html";
import { IEntry, IHint } from "../types";
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

export const JudgeHintPopup = () => {
  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const {
    setShowJudgeHintPopup,
    contentState,
    editorState,
    setEditorState,
    title,
    setTitle,
    showErrorText,
    setShowErrorText,
    updateHint,
    setOpenedHintId,
    openedHintId,
    associatedEntryId,
    setAssociatedEntryId,
    setHints,
    hints,
    editMode,
    setEditMode,
  } = useHints();

  const { user } = useUser();
  const { entries, currentVersion } = useCase();

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
    setShowJudgeHintPopup(false);
    setShowErrorText(false);
    setOpenedHintId("");
    setAssociatedEntryId("");
    setEditMode(false);
  };

  const addHint = () => {
    const newHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (title === "" || newHtml === "<p></p>\n") {
      setShowErrorText(true);
    } else {
      // edit Hint
      if (openedHintId !== "" && user !== null) {
        let editedHint: IHint = {
          id: openedHintId,
          title: title,
          text: newHtml,
          author: user?.name,
          version: currentVersion,
        };
        if (associatedEntryId !== "") {
          editedHint["associatedEntry"] = associatedEntryId;
        }
        updateHint(editedHint);
      } else {
        if (user !== null) {
          let newHint: IHint = {
            id: uuidv4(),
            title: title,
            text: newHtml,
            author: user?.name,
            version: currentVersion,
          };
          if (associatedEntryId !== "") {
            newHint["associatedEntry"] = associatedEntryId;
          }
          setHints([...hints, newHint]);
        }
      }
      resetStates();
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
              <h3 className="text-xl font-bold text-darkGrey">
                {`${
                  editMode ? "Hinweis bearbeiten" : "Neuen Hinweis hinzufügen"
                }`}
              </h3>
              <div>
                <button
                  onClick={() => {
                    setShowErrorText(false);
                    setShowJudgeHintPopup(false);
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
                Hinweise von Richter:innen sind öffentlich und können von den
                anderen Parteien eingesehen werden. Sie können einen Hinweis
                nachträglich bearbeiten und löschen, bis zu dem Zeitpunkt der
                Übermittlung dieser Version des Basisdokuments an die anderen
                Parteien.
              </p>
            </div>
            {/*body*/}
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="hint_popup_input"
                  className="leading-relaxed text-base font-bold text-darkGrey">
                  Titel
                </label>
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  id="hint_popup_input"
                  className="w-full px-2 py-2 text-sm bg-offWhite block rounded text-mediumGrey focus:outline-none"
                  placeholder="Titel eingeben..."></input>
              </div>
              <div>
                <label className="my-4 text-base leading-relaxed font-bold text-darkGrey">
                  Text
                </label>
                <Editor
                  defaultEditorState={editorState}
                  onEditorStateChange={setEditorState}
                  wrapperClassName={cx("w-full focus:outline-none")}
                  editorClassName="p-2 text-sm bg-offWhite text-mediumGrey rounded min-h-[100px] max-h-[200px]"
                  placeholder="Text eingeben..."
                  toolbarClassName={cx("p-2 border-none border-white")}
                  toolbar={toolbarOptions}
                />
              </div>
              <div className="space-y-2">
                <label className="my-4 text-lg leading-relaxed font-bold text-darkGrey">
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
                        <DropdownMenu.Content className="flex flex-col gap-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 max-h-[200px] mt-5 p-2">
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
                                  setAssociatedEntryId(entry.id);
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
                    {associatedEntryId !== "" ? (
                      <div className="flex items-center gap-2 cursor-pointer rounded-full pl-3 pr-1 py-1 mx-1 text-xs font-semibold bg-darkGrey text-white">
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
              <button
                className="bg-darkGrey hover:bg-mediumGrey rounded-md text-white py-2 px-3 text-sm"
                onClick={() => {
                  addHint();
                }}>
                Hinweis {`${editMode ? "speichern" : "hinzufügen"}`}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
