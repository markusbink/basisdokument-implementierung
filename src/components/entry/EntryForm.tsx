import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { CornersIn, CornersOut, FloppyDisk, X } from "phosphor-react";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useEntries } from "../../contexts";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import { Action } from "./Action";

const toolbarOptions = {
  options: ["inline", "list"],
  inline: {
    className: ["!mb-0"],
    options: ["bold", "italic", "underline", "strikethrough"],
  },
  list: {
    className: ["!mb-0"],
    options: ["unordered", "ordered"],
  },
};

interface EntryBodyProps {
  isPlaintiff: boolean;
  isExpanded: boolean;
  setIsExpanded: () => void;
  onAbort: () => void;
  onSave: () => void;
  defaultContent?: string;
}

export const EntryForm: React.FC<EntryBodyProps> = ({
  isPlaintiff,
  isExpanded,
  setIsExpanded,
  onAbort,
  onSave,
  defaultContent,
}) => {
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML(defaultContent || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    return EditorState.createWithContent(contentState);
  });

  const { displayAsColumn } = useEntries();

  return (
    <div
      className={cx("border border-t-0 rounded-b-lg", {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
      })}
    >
      <Editor
        defaultEditorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={cx("min-h-[200px] w-full focus:outline-none")}
        editorClassName="p-6 "
        placeholder="Text eingeben..."
        toolbarClassName={cx(
          "p-2 relative rounded-none border border-x-0 border-t-0 border-lightGrey"
        )}
        toolbar={toolbarOptions}
        toolbarCustomButtons={
          displayAsColumn
            ? [
                <span className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Tooltip
                    position="top"
                    text={isExpanded ? "Minimieren" : "Maximieren"}
                  >
                    <Action
                      className="text-base"
                      onClick={() => setIsExpanded()}
                      isPlaintiff={isPlaintiff}
                    >
                      {isExpanded ? <CornersIn /> : <CornersOut />}
                    </Action>
                  </Tooltip>
                </span>,
              ]
            : []
        }
      />
      <div className="flex justify-end gap-2 p-3 pt-2 border-t border-lightGrey">
        <Button
          icon={<X size={20} />}
          onClick={() => onAbort()}
          size="sm"
          bgColor="bg-lightRed"
          textColor="font-bold text-darkRed"
        >
          Abbrechen
        </Button>
        <Button
          icon={<FloppyDisk size={20} />}
          onClick={() => onSave()}
          size="sm"
          bgColor="bg-lightGreen"
          textColor="font-bold text-darkGreen"
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};
