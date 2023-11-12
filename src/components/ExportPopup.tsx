import { X, Info, Trash, Upload, CaretDown, CaretUp } from "phosphor-react";
import { useExport, useCase, useUser } from "../contexts";
import { FileArrowDown } from "phosphor-react";
import { toast } from "react-toastify";
import { Tooltip } from "../components/Tooltip";
import {
  IBookmark,
  IEntry,
  IEvidence,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  IMetaData,
  INote,
  ISection,
  IStateUserInput,
  IVersion,
  JudgeTitle,
  UserRole,
} from "../types";
import {
  downloadBasisdokument,
  downloadEditFile,
} from "../data-management/download-handler";
import { useRef, useState } from "react";
import { Button } from "./Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface IProps {
  fileId: string;
  caseId: string;
  currentVersion: number;
  versionHistory: IVersion[];
  metaData: IMetaData | null;
  entries: IEntry[];
  sectionList: ISection[];
  evidenceList: IEvidence[];
  evidenceIdsPlaintiff: (string | undefined)[];
  evidenceIdsDefendant: (string | undefined)[];
  hints: IHint[];
  highlightedEntries: IHighlightedEntry[];
  colorSelection: IHighlighter[];
  notes: INote[];
  bookmarks: IBookmark[];
  individualSorting: string[];
}

export const ExportPopup: React.FC<IProps> = ({
  fileId,
  caseId,
  currentVersion,
  versionHistory,
  metaData,
  entries,
  sectionList,
  evidenceList,
  evidenceIdsPlaintiff,
  evidenceIdsDefendant,
  hints,
  highlightedEntries,
  colorSelection,
  notes,
  bookmarks,
  individualSorting,
}) => {
  const { setIsExportPopupOpen } = useExport();
  const { individualEntrySorting } = useCase();
  const { user, setUser } = useUser();
  const [errorText, setErrorText] = useState<IStateUserInput["errorText"]>("");
  const [prename, setPrename] = useState<IStateUserInput["prename"]>("");
  const [surname, setSurname] = useState<IStateUserInput["surname"]>("");
  const [showJudgeTitleMenu, setShowJudgeTitleMenu] = useState<boolean>(false);
  const [selectedJudgeTitle, setSelectedJudgeTitle] = useState<JudgeTitle>(
    user?.signature ? user.signature : JudgeTitle.Default
  );
  const [showAuthorChange, setShowAuthorChange] = useState<boolean>(false);
  const [showAddRegard, setShowAddRegard] = useState<boolean>(false);
  const [showOptionalCover, setShowOptionalCover] = useState<boolean>(false);
  const [downloadNewAdditionally, setDownloadNewAdditionally] =
    useState<boolean>(false);
  const [downloadEvidencesAdditionally, setDownloadEvidencesAdditionally] =
    useState<boolean>(false);
  const [dontDownloadAttachments, setDontDownloadAttachments] =
    useState<boolean>(false);

  let [regard, setRegard] = useState<string | undefined>("");
  let [coverPDF, setCoverPDF] = useState<ArrayBuffer>();
  let [coverFilename, setCoverFilename] =
    useState<IStateUserInput["coverFilename"]>("");
  let otherAuthor: string | undefined = prename + " " + surname;
  let validUserInput: boolean = true;

  //Refs
  const coverFileUploadRef = useRef<HTMLInputElement>(null);

  // Source: https://stackoverflow.com/questions/71991961/how-to-read-content-of-uploaded-json-file-on-react-next-js
  const handleCoverFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    try {
      fileReader.readAsArrayBuffer(e.target.files[0]);
      let filename = e.target.files[0].name;
      setCoverFilename(filename);
      validateUserInput(filename);
      fileReader.onload = (e: any) => {
        let result = e.target.result;
        setCoverPDF(result);
      };
      e.target.value = "";
    } catch (error) {}
  };

  const validateUserInput = (filename: string) => {
    // check if file exists and validate
    if (filename.endsWith(".pdf")) {
      setErrorText("");
      validUserInput = true;
    } else if (filename === "") {
      validUserInput = true;
    } else {
      setErrorText(
        "Bitte laden Sie eine valide Deckblatt PDF-Datei (.pdf) hoch!"
      );
      validUserInput = false;
    }
  };

  const onClickDownloadButton = () => {
    validateUserInput(coverFilename);
    if (validUserInput) {
      triggerDownload();
    }
  };

  const triggerDownload = () => {
    if (showOptionalCover === false) {
      coverPDF = undefined;
    }
    if (showAuthorChange === false) {
      otherAuthor = undefined;
    }
    if (showAddRegard === false) {
      regard = undefined;
    }
    setTimeout(() => {
      downloadBasisdokument(
        fileId,
        caseId,
        currentVersion,
        versionHistory,
        metaData,
        entries,
        sectionList,
        evidenceList,
        evidenceIdsPlaintiff,
        evidenceIdsDefendant,
        hints,
        coverPDF,
        otherAuthor,
        downloadNewAdditionally,
        downloadEvidencesAdditionally,
        regard,
        dontDownloadAttachments
      );
    }, 100);
    setTimeout(() => {
      downloadEditFile(
        fileId,
        caseId,
        currentVersion,
        highlightedEntries,
        colorSelection,
        notes,
        bookmarks,
        individualSorting,
        individualEntrySorting
      );
    }, 200);
    toast("Basisdokument wurde heruntergeladen!");
  };

  const onChangeGivenPrename = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrename(newValue);
  };

  const onChangeGivenSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSurname(newValue);
  };

  const onChangeRegard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setRegard(newValue);
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-[55vw] h-[85vh] my-6 mx-auto">
          {/*content*/}
          <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg">
              <h3 className="text-xl font-bold text-darkGrey">
                Basisdokument herunterladen
              </h3>
              <div>
                <button
                  onClick={(currentState) =>
                    setIsExportPopupOpen(!currentState)
                  }
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div>
              {errorText !== "" ? (
                <div className="flex bg-lightRed p-4 rounded-md">
                  <p className="text-darkRed">
                    <span className="font-bold">Fehler:</span> {errorText}
                  </p>
                </div>
              ) : null}
            </div>
            {/*body*/}
            <div className="flex flex-col gap-7 max-h-[450px] overflow-y-auto">
              <div className="flex justify-left gap-2 items-center">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={showOptionalCover}
                  onChange={() => setShowOptionalCover(!showOptionalCover)}
                />
                <span className="font-semibold">Deckblatt</span>
                <div className="flex flex-row gap-0.5">
                  <Tooltip
                    text="Sie können vor dem Herunterladen des Basisdokuments optional ein
                    Deckblatt einfügen, das dem Basisdokument vorangestellt wird."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>
              {showOptionalCover && (
                <div className="rounded-md flex flex-col gap-2 -mt-5 mb-4">
                  <div className="text-darkGrey opacity-80">
                    Sie können vor dem Herunterladen des Basisdokuments optional
                    ein Deckblatt einfügen, das dem Basisdokument vorangestellt
                    wird.
                  </div>
                  <div className="bg-offWhite rounded-md pl-3 pr-3 p-2 flex flex-row gap-2 max-w-fit">
                    <label
                      role="button"
                      className="flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap">
                      <input
                        ref={coverFileUploadRef}
                        type="file"
                        onChange={handleCoverFileUploadChange}
                        accept=".pdf"
                      />
                      {coverFilename}
                      <button
                        onClick={() => {
                          coverFileUploadRef?.current?.click();
                        }}
                        className="bg-darkGrey hover:bg-mediumGrey rounded-md px-2 p-1 flex flex-col w-full items-center">
                        <Upload size={24} color={"white"} />
                      </button>
                    </label>
                    {coverFilename && (
                      <button
                        onClick={() => {
                          setCoverFilename("");
                          setCoverPDF(undefined);
                        }}
                        className="bg-lightRed hover:bg-marker-red rounded-md p-1">
                        <Trash size={24} color={"darkRed"} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-row gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={showAddRegard}
                  onChange={() => setShowAddRegard(!showAddRegard)}
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">
                    Betreff zur Basisdokument-PDF hinzufügen
                  </span>
                  <Tooltip
                    text="Sie können einen Betreff zu dieser Version des Basisdokuments
                    hinzufügen."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>

              {showAddRegard && (
                <div className="flex flex-col gap-2 -mt-5 mb-4">
                  <div className="text-darkGrey opacity-80">
                    Sie können einen Betreff zu dieser Version des
                    Basisdokuments hinzufügen.
                  </div>
                  <input
                    className="p-2 px-3 h-[50px] bg-offWhite rounded-md outline-none"
                    type="text"
                    placeholder="Betreff..."
                    value={regard}
                    onChange={onChangeRegard}
                  />
                </div>
              )}
              <div className="flex flex-row gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={showAuthorChange}
                  onChange={() => setShowAuthorChange(!showAuthorChange)}
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">
                    Signatur im Basisdokument-PDF ändern
                  </span>
                  <Tooltip
                    text="Sie können die Signatur des Basisdokuments ändern."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>

              {showAuthorChange && (
                <div className="flex flex-col w-full gap-2 -mt-5 mb-4">
                  <div className="text-darkGrey opacity-80">
                    Sie können die Signatur des Basisdokuments ändern.
                  </div>
                  <div className="flex gap-4 w-[90%]">
                    <input
                      className="p-2 px-3 h-[50px] bg-offWhite rounded-md outline-none"
                      type="text"
                      placeholder="Vorname..."
                      value={prename}
                      onChange={onChangeGivenPrename}
                    />
                    <input
                      className="p-2 px-3 h-[50px] bg-offWhite rounded-md outline-none"
                      type="text"
                      placeholder="Nachname..."
                      value={surname}
                      onChange={onChangeGivenSurname}
                    />
                    <div className="flex items-normal gap-2">
                      {user?.role !== UserRole.Judge ? (
                        <p className="p-2 px-3 bg-offWhite rounded-md outline-none">
                          {user!.role}
                        </p>
                      ) : (
                        <DropdownMenu.Root
                          modal={false}
                          onOpenChange={() => {
                            setShowJudgeTitleMenu(!showJudgeTitleMenu);
                          }}>
                          <DropdownMenu.Trigger className="flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 px-2 h-full hover:cursor-pointer">
                            <span className="text-sm">
                              {selectedJudgeTitle}
                            </span>
                            {showJudgeTitleMenu ? (
                              <CaretDown
                                size={12}
                                className="text-darkGrey"
                                weight="bold"
                              />
                            ) : (
                              <CaretUp
                                size={12}
                                className="text-darkGrey"
                                weight="bold"
                              />
                            )}
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              side="bottom"
                              align="center"
                              className="flex flex-col bg-white shadow-md rounded-lg p-2 z-50 items-center">
                              {Object.values(JudgeTitle).map((title) => {
                                return (
                                  <DropdownMenu.Item
                                    className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
                                    onClick={() => {
                                      setSelectedJudgeTitle(
                                        title as JudgeTitle
                                      );
                                      setUser({
                                        name: user.name,
                                        role: user.role,
                                        signature: title as JudgeTitle,
                                      });
                                    }}>
                                    <div className="text-darkGrey text-sm font-medium">
                                      {title}
                                    </div>
                                  </DropdownMenu.Item>
                                );
                              })}
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-row items-center justify-left gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={downloadNewAdditionally}
                  onChange={() =>
                    setDownloadNewAdditionally(!downloadNewAdditionally)
                  }
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">
                    Zusätzlich alle neuen Beiträge als eigene PDF herunterladen
                  </span>
                  <Tooltip
                    text="Sie können zusätzlich alle von Ihnen neu hinzugefügten Beiträge
                    herunterladen."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-row items-center justify-left gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={downloadEvidencesAdditionally}
                  onChange={() =>
                    setDownloadEvidencesAdditionally(
                      !downloadEvidencesAdditionally
                    )
                  }
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">
                    Zusätzlich eine Liste aller Beweise in einer eigenen PDF
                    herunterladen
                  </span>
                  <Tooltip
                    text="Sie können zusätzlich alle Beweise im Basisdokument als eigenes
                    PDF-Dokument herunterladen."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-row items-center justify-left gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={dontDownloadAttachments}
                  onChange={() =>
                    setDontDownloadAttachments(!dontDownloadAttachments)
                  }
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">
                    Anhänge nicht herunterladen
                  </span>
                  <Tooltip
                    text="Sie können verhindern, dass die im Basisdokument hinterlegten
                    Anhänge mit heruntergeladen werden."
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <Button
                size="md"
                bgColor="bg-darkGrey hover:bg-darkGrey/60"
                textColor="text-white"
                onClick={onClickDownloadButton}>
                <FileArrowDown
                  size={18}
                  className="text-white mr-2"
                  weight="bold"
                />
                Basisdokument herunterladen
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
