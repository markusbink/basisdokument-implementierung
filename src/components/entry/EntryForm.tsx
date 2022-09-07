import cx from "classnames";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { CornersIn, CornersOut, FloppyDisk, X } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useCase, useHeaderContext } from "../../contexts";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import { Action } from "./Action";

const toolbarOptions = {
  options: ["blockType", "inline", "list", "textAlign"],
  blockType: {
    inDropdown: true,
    options: ["Normal", "H3"],
    className: ["!mb-0 hover:shadow-none rounded text-black"],
  },
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

interface EntryBodyProps {
  isPlaintiff: boolean;
  isExpanded: boolean;
  setIsExpanded: () => void;
  onAbort: (plainText: string, rawHtml: string) => void;
  onSave: (plainText: string, rawHtml: string) => void;
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
  console.log({ defaultContent });

  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const contentState = stateFromHTML(defaultContent || "");

    return EditorState.createWithContent(contentState);
  });

  const { showColumnView } = useHeaderContext();
  const { entries } = useCase();
  const editorRef = useRef<Editor>(null);
  const suggestions = entries.map((entry) => ({
    text: entry.entryCode,
    value: entry.entryCode,
    url: `#${entry.entryCode}`,
  }));
  const contentState = editorState.getCurrentContent();

  useEffect(() => {
    setHidePlaceholder(
      () => contentState.getBlockMap().first().getType() !== "unstyled"
    );
  }, [contentState]);

  useEffect(() => {
    // Focus the editor when the component is mounted.
    editorRef.current?.focusEditor();
  }, []);

  return (
    <div
      className={cx("border border-t-0 rounded-b-lg", {
        "border-lightPurple": isPlaintiff,
        "border-lightPetrol": !isPlaintiff,
        "RichEditor-hidePlaceholder": hidePlaceholder,
      })}>
      <Editor
        ref={editorRef}
        mention={{
          separator: " ",
          trigger: "#",
          suggestions,
        }}
        defaultEditorState={editorState}
        stripPastedStyles={true}
        onEditorStateChange={setEditorState}
        wrapperClassName={cx("w-full focus:outline-none")}
        editorClassName="p-6 min-h-[300px] overflow-visible"
        placeholder="Text eingeben..."
        toolbarClassName={cx(
          "p-2 relative rounded-none border border-x-0 border-t-0 border-lightGrey leading-none"
        )}
        toolbar={toolbarOptions}
        toolbarCustomButtons={
          showColumnView
            ? [
                <span className="absolute right-2 top-1/2 -translate-y-1/2 leading-[0]">
                  <Tooltip
                    position="top"
                    text={isExpanded ? "Minimieren" : "Maximieren"}>
                    <Action
                      className="text-base"
                      onClick={() => setIsExpanded()}
                      isPlaintiff={isPlaintiff}>
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
          onClick={() => {
            const plainText = editorState.getCurrentContent().getPlainText();
            const newHtml = draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            );

            onAbort(plainText, newHtml);
          }}
          size="sm"
          bgColor="bg-lightRed hover:bg-darkRed"
          textColor="font-bold text-darkRed hover:text-white">
          Abbrechen
        </Button>
        <Button
          icon={<FloppyDisk size={20} />}
          onClick={() => {
            const plainText = editorState.getCurrentContent().getPlainText();
            const newHtml = draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            );

            onSave(plainText, newHtml);
          }}
          size="sm"
          bgColor="bg-lightGreen hover:bg-darkGreen"
          textColor="font-bold text-darkGreen hover:text-white">
          Speichern
        </Button>
      </div>
    </div>
  );
};
