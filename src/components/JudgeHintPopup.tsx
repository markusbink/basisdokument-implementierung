import { XCircle, WarningCircle, Quotes } from "phosphor-react";
import { Button } from "./Button";
import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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

interface JudgeHintPopupProps{
  isVisible: boolean;
  onClose: any;
}

export const JudgeHintPopup = ({ isVisible, onClose }: JudgeHintPopupProps) => {
    const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
    const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML("");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(contentState);
  });

  const contentState = editorState.getCurrentContent();
  useEffect(() => {
    setHidePlaceholder(
      () => contentState.getBlockMap().first().getType() !== "unstyled"
    );
  }, [contentState]);

  if (!isVisible) return null;
  
    return(
        <div>
        <>
          <div
            className={cx(
              "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none",
              {
                "RichEditor-hidePlaceholder": hidePlaceholder,
              }
            )}
          >
            <div className="w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-lg ">
                  <h3 className="text-2xl font-bold text-darkGrey">
                    Neuen Hinweis an Parteien verfassen
                  </h3>
                  <div>
                    <button
                      onClick={onClose}
                      className="text-darkGrey"
                    >
                      <XCircle size={29} weight="fill" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mx-20 p-3 bg-lightOrange rounded-lg font-bold text-darkOrange">
                  <span>
                    <WarningCircle size={40} />
                  </span>
                  <p className="text-sm">
                    Hinweise von Richter:innen sind öffentlich und können von den anderen Parteien eingesehen werden. 
                    Sie können einen Hinweis nachträglich bearbeiten und löschen, bis zu dem Zeitpunkt der Übermittlung dieser Version des Basisdokuments. 
                  </p>
                </div>
                {/*body*/}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="note_popup_input"
                      className="leading-relaxed text-lg font-bold text-darkGrey"
                    >
                      Titel
                    </label>
                    <input
                      id="note_popup_input"
                      className="w-full px-2 py-3 bg-offWhite block rounded text-mediumGrey focus:outline-none"
                      placeholder="Titel eingeben..."
                    ></input>
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
                      toolbarClassName={cx(
                        "p-2 border-none border-white"
                      )}
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
                        <div className="flex items-center gap-2 cursor-pointer rounded-full pl-3 pr-1 py-1 m-1 text-xs font-semibold bg-darkGrey text-white">
                          K-2-1
                          <XCircle size={20} weight="fill" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end">
                  <Button onClick={onClose}>
                    Notiz hinzufügen
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
        </div>
    )
}