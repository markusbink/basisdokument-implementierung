import cx from "classnames";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { FloppyDisk, ImageSquare, PencilSimple, X } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useCase, useHeaderContext } from "../../contexts";
import { useView } from "../../contexts/ViewContext";
import { getTheme } from "../../themes/getTheme";
import { IEvidence, ViewMode } from "../../types";
import { Button } from "../Button";
import { ExpandButton } from "./ExpandButton";
import { EvidencesPopup } from "./EvidencePopup";
import { ImageViewerPopup } from "./ImageViewerPopup";
import { useEvidence } from "../../contexts/EvidenceContext";

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
  caveatOfProof: boolean;
  isPlaintiff: boolean;
  isExpanded: boolean;
  setIsExpanded: () => void;
  onAbort: (plainText: string, rawHtml: string) => void;
  onSave: (
    plainText: string,
    rawHtml: string,
    evidences: IEvidence[],
    caveatOfProof: boolean,
    plaintiffVolume: number,
    defendantVolume: number
  ) => void;
  defaultContent?: string;
  evidences: IEvidence[];
}

export const EntryForm: React.FC<EntryBodyProps> = ({
  entryId,
  caveatOfProof,
  isPlaintiff,
  isExpanded,
  setIsExpanded,
  onAbort,
  onSave,
  defaultContent,
  evidences,
}) => {
  const { plaintiffFileVolume, defendantFileVolume } = useEvidence();
  const [currCaveatOfProof, setCaveatOfProof] =
    useState<boolean>(caveatOfProof);

  //evidences from evidencePopup -> to save at onSave if there is no cancellation
  const [evidencesToSave, setEvidencesToSave] =
    useState<IEvidence[]>(evidences);
  //fileVolumes from evidencePopup -> to save at onSave if there is no cancellation
  const [plaintiffFileVolumeToSave, setPlaintiffFileVolumeToSave] =
    useState<number>(plaintiffFileVolume);
  const [defendantFileVolumeToSave, setDefendantFileVolumeToSave] =
    useState<number>(defendantFileVolume);

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

  const [imagePopupFilename, setImagePopupFilename] = useState<string>("");
  const [imagePopupData, setImagePopupData] = useState<string>("");
  const [imagePopupAttachment, setImagePopupAttachment] = useState<string>("");
  const [imagePopupTitle, setImagePopupTitle] = useState<string>("");
  const [imagePopupVisible, setImagePopupVisible] = useState<boolean>(false);

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

  const showImage = (
    filedata: string,
    filename: string,
    attId: string,
    title: string
  ) => {
    setImagePopupVisible(!imagePopupVisible);
    setImagePopupData(filedata);
    setImagePopupAttachment(attId);
    setImagePopupFilename(filename);
    setImagePopupTitle(title);
  };

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
          {evidencesToSave && evidencesToSave.length <= 0 ? (
            <div
              className="flex flex-col gap-2 items-center cursor-pointer"
              onClick={(e) => {
                setEvidencePopupVisible(true);
                e.stopPropagation();
              }}>
              <span className="italic">Keine Beweise</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="ml-1 font-bold">
                {(evidences.length === 1 ? "Beweis" : "Beweise") +
                  (currCaveatOfProof
                    ? " unter Verwahrung gegen die Beweislast"
                    : "") +
                  ":"}
              </span>
              <div className="flex flex-col flex-wrap gap-1">
                {evidencesToSave &&
                  evidencesToSave.map((evidence, index) => (
                    <div
                      className="flex flex-row items-center px-1"
                      key={index}>
                      <div className="flex flex-row gap-2">
                        {evidencesToSave.length !== 1 && (
                          <span className="w-4">{index + 1 + "."}</span>
                        )}
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
                        {evidence.hasImageFile && (
                          <ImageSquare
                            size={20}
                            className="text-mediumGrey hover:text-black"
                            onClick={() => {
                              showImage(
                                evidence.imageFile!,
                                evidence.imageFilename!,
                                evidence.attachmentId!,
                                evidence.name
                              );
                            }}
                          />
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
              onSave(
                plainText,
                newHtml,
                evidencesToSave,
                currCaveatOfProof,
                plaintiffFileVolumeToSave,
                defendantFileVolumeToSave
              );
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
        caveatOfProof={currCaveatOfProof}
        setCaveatOfProof={setCaveatOfProof}
        isVisible={evidencePopupVisible}
        setIsVisible={setEvidencePopupVisible}
        isPlaintiff={isPlaintiff}
        evidences={evidencesToSave}
        setEvidencesToSave={setEvidencesToSave}
        setPlaintiffFileVolumeToSave={setPlaintiffFileVolumeToSave}
        setDefendantFileVolumeToSave={
          setDefendantFileVolumeToSave
        }></EvidencesPopup>
      <ImageViewerPopup
        isVisible={imagePopupVisible}
        filedata={imagePopupData}
        filename={imagePopupFilename}
        title={imagePopupTitle}
        attachmentId={imagePopupAttachment}
        setIsVisible={setImagePopupVisible}></ImageViewerPopup>
    </>
  );
};
