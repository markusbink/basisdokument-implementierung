import cx from "classnames";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { FloppyDisk, PencilSimple, X } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useCase, useHeaderContext } from "../../contexts";
import { useView } from "../../contexts/ViewContext";
import { getTheme } from "../../themes/getTheme";
import { IEvidence, ViewMode } from "../../types";
import { Button } from "../Button";
import { ExpandButton } from "./ExpandButton";
import { EvidencesPopup } from "./EvidencePopup";

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
  entryId?: string;
  isPlaintiff: boolean;
  isExpanded: boolean;
  setIsExpanded: () => void;
  onAbort: (plainText: string, rawHtml: string) => void;
  onSave: (plainText: string, rawHtml: string, evidences: IEvidence[]) => void;
  defaultContent?: string;
  evidences: IEvidence[];
}

export const EntryForm: React.FC<EntryBodyProps> = ({
  entryId,
  isPlaintiff,
  isExpanded,
  setIsExpanded,
  onAbort,
  onSave,
  defaultContent,
  evidences,
}) => {
  const [entryEvidences, setEntryEvidences] = useState<IEvidence[]>(evidences);
  const [backupEvidences, setBackupEvidences] = useState<IEvidence[]>();
  const [hidePlaceholder, setHidePlaceholder] = useState<boolean>(false);
  const [evidencePopupVisible, setEvidencePopupVisible] =
    useState<boolean>(false);
  const [editorState, setEditorState] = useState(() => {
    const blocksFromHtml = htmlToDraft(defaultContent || "");
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );

    return EditorState.createWithContent(contentState);
  });

  const { selectedTheme } = useHeaderContext();
  const { view } = useView();
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
    <>
      <div
        className={cx("border border-t-0 rounded-b-lg bg-white", {
          [`border-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
            isPlaintiff,
          [`border-${getTheme(selectedTheme)?.secondaryDefendant}`]:
            !isPlaintiff,
          "RichEditor-hidePlaceholder": hidePlaceholder,
        })}>
        <Editor
          ref={editorRef}
          mention={{
            separator: " ",
            trigger: "#",
            suggestions,
          }}
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
          editorClassName="p-6 min-h-[300px] overflow-visible"
          placeholder="Text eingeben..."
          toolbarClassName={cx(
            "p-2 relative rounded-none border border-x-0 border-t-0 bg-white border-lightGrey leading-none sticky -top-[112px] z-10"
          )}
          toolbar={toolbarOptions}
          toolbarCustomButtons={
            view === ViewMode.Columns
              ? [
                  <ExpandButton
                    isPlaintiff={isPlaintiff}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                  />,
                ]
              : []
          }
        />
        <div className="flex border-t border-lightGrey rounded-b-lg px-3 py-2 items-center gap-2 justify-between">
          {entryEvidences.length <= 0 ? (
            <div
              className="flex flex-col gap-2 items-center cursor-pointer"
              onClick={(e) => {
                setEvidencePopupVisible(true);
                setBackupEvidences([...entryEvidences]);
                e.stopPropagation();
              }}>
              <span className="italic">Keine Beweise</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="ml-1 font-bold">Beweisangebot</span>
              <div className="flex flex-col flex-wrap gap-1">
                {entryEvidences.map((evidence, index) => (
                  <div className="flex flex-row items-center px-2" key={index}>
                    <div className="flex flex-row gap-2">
                      <span>{index + 1 + "."}</span>
                      {evidence.hasAttachment ? (
                        <span className="break-words font-medium">
                          {evidence.name}
                          <b> als Anlage {evidence.attachmentId}</b>
                        </span>
                      ) : (
                        <span className="break-words font-medium">
                          {evidence.name}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Button
            icon={<PencilSimple size={20} />}
            onClick={() => {
              setEvidencePopupVisible(true);
              setBackupEvidences([...entryEvidences]);
            }}
            size="sm"
            bgColor="bg-offWhite hover:bg-lightGrey"
            textColor="font-bold text-darkGrey"></Button>
        </div>
        <div className="flex justify-end p-3 pt-2 gap-2 border-t border-lightGrey">
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

              onSave(plainText, newHtml, entryEvidences);
            }}
            size="sm"
            bgColor="bg-lightGreen hover:bg-darkGreen"
            textColor="font-bold text-darkGreen hover:text-white">
            Speichern
          </Button>
        </div>
      </div>
      <EvidencesPopup
        entryId={entryId}
        isVisible={evidencePopupVisible}
        setIsVisible={setEvidencePopupVisible}
        isPlaintiff={isPlaintiff}
        evidences={entryEvidences}
        backupEvidences={backupEvidences}
        setEvidences={setEntryEvidences}></EvidencesPopup>
    </>
  );
};
