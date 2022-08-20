import {
  Eye,
  DotsThree,
  PencilSimple,
  Trash,
  FloppyDisk,
  X,
} from "phosphor-react";
import { useState } from "react";
import { Button } from "../Button";
import cx from "classnames";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, convertFromHTML, EditorState } from "draft-js";

export interface HintProps {
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

export const Hint: React.FC<HintProps> = (hint: HintProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML(hint.content || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(contentState);
  });

  const showReference = (e: React.MouseEvent) => {
    //TODO
  };

  const editHint = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    setEditMode(!editMode);

    //TODO
  };

  const deleteHint = (e: React.MouseEvent) => {
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
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {hint.referenceTo && (
          <div
            className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit
              bg-darkGrey hover:bg-mediumGrey text-lightGrey text-[10px] font-semibold rounded-xl"
            onClick={showReference}
          >
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${hint.referenceTo}`}
          </div>
        )}

        <div className={cx("mx-3", { "mt-3": !hint.referenceTo })}>
          <div className="mb-2 text-sm font-bold">{hint.title}</div>
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
            <div className="mb-2">{hint.content}</div>
          )}

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{hint.author}</div>
              <div className="opacity-40">
                {`${String(hint.timestamp.getDate()).padStart(2, "0")}.
            ${String(hint.timestamp.getMonth()).padStart(2, "0")}.
            ${hint.timestamp.getFullYear()}`}
              </div>
            </div>

            <div
              className="self-end relative"
              // onBlur={() => setIsMenuOpen(false)}
            >
              <Button
                key="createHint"
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
                    onClick={editHint}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                  >
                    <PencilSimple size={16} />
                    Bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={deleteHint}
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
