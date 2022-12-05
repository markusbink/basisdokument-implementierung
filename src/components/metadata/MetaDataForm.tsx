import cx from "classnames";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { FloppyDisk, X } from "phosphor-react";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Button } from "../Button";

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

interface MetaDataFormProps {
  onAbort: (plainText: string, rawHtml: string) => void;
  onSave: (plainText: string, rawHtml: string) => void;
  defaultContent?: string;
}

export const MetaDataForm: React.FC<MetaDataFormProps> = ({
  onAbort,
  onSave,
  defaultContent,
}) => {
  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHtml = htmlToDraft(defaultContent || "");
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
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
      })}>
      <Editor
        localization={{
          locale: "de",
          translations: {
            "components.controls.blocktype.normal": "Text",
            "components.controls.blocktype.h3": "Überschrift",
          },
        }}
        defaultEditorState={editorState}
        stripPastedStyles={true}
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
