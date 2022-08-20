import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { CornersIn, CornersOut, FloppyDisk, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
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
  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML(defaultContent || "");
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

  return (
    <div
      className={cx("border border-t-0 rounded-b-lg", {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
        "RichEditor-hidePlaceholder": hidePlaceholder,
      })}
    >
      <Editor
        defaultEditorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={cx("min-h-[140px] w-full focus:outline-none")}
        editorClassName={cx("p-6")}
        placeholder="Text eingeben..."
        toolbarClassName={cx(
          "p-2 relative rounded-none border border-x-0 border-t-0 border-lightGrey leading-none"
        )}
        toolbar={toolbarOptions}
        toolbarCustomButtons={[
          <span className="absolute right-2 top-1/2 -translate-y-1/2 leading-[0]">
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
        ]}
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
