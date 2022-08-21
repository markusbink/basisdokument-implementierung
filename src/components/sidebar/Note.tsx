import {
  DotsThree,
  Eye,
  FloppyDisk,
  PencilSimple,
  Trash,
  X,
} from "phosphor-react";
import { Button } from "../Button";
import cx from "classnames";
import React, { useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { useOutsideClick } from "../../hooks/use-outside-click";

export interface NoteProps {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: Date;
  referenceTo?: string;
}

const toolbarOptions = {
  options: ["inline", "list"],
  inline: {
    className: ["!mb-0 flex gap-2 items-center"],
    options: ["bold", "italic", "underline", "strikethrough"],
  },
  list: {
    className: ["!mb-0 flex gap-2 items-center"],
    options: ["unordered", "ordered"],
  },
};

export const Note: React.FC<NoteProps> = (note: NoteProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML(note.content || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(contentState);
  });
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));

  const showReference = (e: React.MouseEvent) => {
    //TODO
  };

  const editNote = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    setEditMode(!editMode);
    //TODO
  };

  const deleteNote = (e: React.MouseEvent) => {
    //TODO
  };

  const onAbort = () => {
    setEditMode(!editMode);
    //TODO
  };

  const onSave = () => {
    setEditMode(!editMode);
    //TODO
  };

  return (
    <div ref={ref}>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {note.referenceTo && (
          <div
            className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit
              bg-darkGrey hover:bg-mediumGrey text-lightGrey text-[10px] font-semibold rounded-xl"
            onClick={showReference}
          >
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${note.referenceTo}`}
          </div>
        )}

        <div className={cx("mx-3", { "mt-3": !note.referenceTo })}>
          <div className="mb-2 text-sm font-bold">{note.title}</div>
          {editMode ? (
            <div>
              <Editor
                defaultEditorState={editorState}
                onEditorStateChange={setEditorState}
                wrapperClassName={cx(
                  "min-h-[140px] w-full focus:outline-none bg-white rounded-t-lg"
                )}
                editorClassName="p-2"
                placeholder="Text eingeben..."
                toolbarClassName={cx(
                  "p-2 relative rounded-none border border-x-0 border-t-0 border-lightGrey flex gap-5"
                )}
                toolbar={toolbarOptions}
                toolbarCustomButtons={[]}
              />
              <div className="flex justify-end gap-1 p-2 border-t border-lightGrey bg-white rounded-b-lg">
                <Button
                  icon={<X size={16} />}
                  onClick={() => onAbort()}
                  size="xs"
                  gap="gap-0.5"
                  bgColor="bg-lightRed"
                  alternativePadding="p-1"
                  textColor="font-bold text-darkRed"
                >
                  Abbrechen
                </Button>
                <Button
                  icon={<FloppyDisk size={16} />}
                  onClick={() => onSave()}
                  size="xs"
                  gap="gap-0.5"
                  bgColor="bg-lightGreen"
                  alternativePadding="p-1"
                  textColor="font-bold text-darkGreen"
                >
                  Speichern
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-2">{note.content}</div>
          )}

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{note.author}</div>
              <div className="opacity-40">
                {`${String(note.timestamp.getDate()).padStart(2, "0")}.
            ${String(note.timestamp.getMonth()).padStart(2, "0")}.
            ${note.timestamp.getFullYear()}`}
              </div>
            </div>

            <div className="self-end relative">
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
                icon={<DotsThree size={16} weight="bold" />}
              ></Button>{" "}
              {isMenuOpen ? (
                <ul className="absolute right-7 top-0 p-2 bg-lightGrey text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                  <li
                    tabIndex={0}
                    onClick={editNote}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                  >
                    <PencilSimple size={16} />
                    Bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={deleteNote}
                    className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                  >
                    <Trash size={16} />
                    Löschen
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
