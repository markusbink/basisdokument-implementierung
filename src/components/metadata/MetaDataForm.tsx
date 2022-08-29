import cx from "classnames";
import {
  ContentState,
  convertFromHTML,
  convertToRaw,
  EditorState,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FloppyDisk, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Button } from "../Button";

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

interface MetaDataFormProps {
  isPlaintiff: boolean;
  onAbort: (plainText: string, rawHtml: string) => void;
  onSave: (plainText: string, rawHtml: string) => void;
  defaultContent?: string;
}

export const MetaDataForm: React.FC<MetaDataFormProps> = ({
  isPlaintiff,
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
      className={cx("rounded-b-lg bg-white", {
        "RichEditor-hidePlaceholder": hidePlaceholder,
      })}
    >
      <Editor
        defaultEditorState={editorState}
        onEditorStateChange={setEditorState}
        wrapperClassName={cx("w-full focus:outline-none")}
        editorClassName="p-6 min-h-[160px] overflow-visible"
        placeholder="Text eingeben..."
        toolbarClassName={cx(
          "p-2 relative rounded-none border border-x-0 border-t-0 border-lightGrey leading-none"
        )}
        toolbar={toolbarOptions}
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
          bgColor="bg-lightRed"
          textColor="font-bold text-darkRed"
        >
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
          bgColor="bg-lightGreen"
          textColor="font-bold text-darkGreen"
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};
