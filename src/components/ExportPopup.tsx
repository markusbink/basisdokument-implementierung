import { X, Info, Trash, Upload } from "phosphor-react";
import { useExport, useCase } from "../contexts";
import { FileArrowDown } from "phosphor-react";
import { toast } from "react-toastify";
import { Tooltip } from "../components/Tooltip";
import {
  IBookmark,
  IEntry,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  IMetaData,
  IIntroduction,
  INote,
  ISection,
  IStateUserInput,
  IVersion,
} from "../types";
import {
  downloadBasisdokument,
  downloadEditFile,
} from "../data-management/download-handler";
import { useRef, useState } from "react";
import { Button } from "./Button";

interface IProps {
  fileId: string;
  caseId: string;
  currentVersion: number;
  versionHistory: IVersion[];
  metaData: IMetaData | null;
  introduction: IIntroduction | null;
  entries: IEntry[];
  sectionList: ISection[];
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
  introduction,
  entries,
  sectionList,
  hints,
  highlightedEntries,
  colorSelection,
  notes,
  bookmarks,
  individualSorting,
}) => {
  const { setIsExportPopupOpen } = useExport();
  const { individualEntrySorting } = useCase();
  const [errorText, setErrorText] = useState<IStateUserInput["errorText"]>("");
  let [coverPDF, setCoverPDF] = useState<ArrayBuffer>();
  const [coverFilename, setCoverFilename] =
    useState<IStateUserInput["coverFilename"]>("");
  const [prename, setPrename] = useState<IStateUserInput["prename"]>("");
  const [surname, setSurname] = useState<IStateUserInput["surname"]>("");
  let otherAuthor: string | undefined = prename + " " + surname;
  const [showAuthorChange, setShowAuthorChange] = useState<boolean>(false);
  let [regard, setRegard] = useState<string | undefined>("");
  const [showAddRegard, setShowAddRegard] = useState<boolean>(false);
  const [showOptionalCover, setShowOptionalCover] = useState<boolean>(false);
  var [downloadNewAdditionally, setDownloadNewAdditionally] =
    useState<boolean>(false);
  var validUserInput: boolean = true;

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
        introduction,
        entries,
        sectionList,
        hints,
        coverPDF,
        otherAuthor,
        downloadNewAdditionally,
        regard
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
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-3xl min-w-[500px]">
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
            {/*body*/}
            <div>
              <div className="flex flex-row items-center justify-left gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={showOptionalCover}
                  onChange={() => setShowOptionalCover(!showOptionalCover)}
                />
                <div className="flex flex-row gap-0.5">
                  <span className="font-semibold">Deckblatt:</span>
                  <Tooltip
                    text="Optional Deckblatt PDF-Datei hochladen"
                    position="top"
                    delayDuration={0}
                    disabled={true}>
                    <Info size={18} color={"slateGray"} />
                  </Tooltip>
                </div>
                {showOptionalCover && (
                  <div className="bg-offWhite rounded-md pl-3 pr-3 p-2 flex flex-row gap-2">
                    <label
                      role="button"
                      className="flex items-center justify-center gap-2 cursor-pointer">
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
                        className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
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
                )}
              </div>
              <div className="text-darkGrey opacity-80 ml-5 mb-7">
                Sie können vor dem Herunterladen des Basisdokuments optional ein
                Deckblatt einfügen, das dem Basisdokument vorangestellt wird.
              </div>
              <div className="flex flex-row gap-2">
                <input
                  className="small-checkbox accent-darkGrey cursor-pointer"
                  type="checkbox"
                  checked={showAddRegard}
                  onChange={() => setShowAddRegard(!showAddRegard)}
                />
                <div className="font-semibold">
                  Betreff zur Basisdokument-PDF hinzufügen
                </div>
              </div>
              <div
                className={`text-darkGrey opacity-80 ml-5 ${
                  showAddRegard ? "" : "mb-7"
                }`}>
                Sie können einen Betreff zu dieser Version des Basisdokuments
                hinzufügen.
              </div>
              {showAddRegard && (
                <div className="mt-4 ml-4 mb-7">
                  <input
                    className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none w-full"
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
                <div className="font-semibold">
                  Signatur im Basisdokument-PDF ändern
                </div>
              </div>
              <div
                className={`text-darkGrey opacity-80 ml-5 ${
                  showAuthorChange ? "" : "mb-7"
                }`}>
                Sie können die Signatur des Basisdokuments ändern.
              </div>
              {showAuthorChange && (
                <div className="flex flex-row w-auto mt-4 gap-4 ml-4 mb-7">
                  <input
                    className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none"
                    type="text"
                    placeholder="Vorname..."
                    value={prename}
                    onChange={onChangeGivenPrename}
                  />
                  <input
                    className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none"
                    type="text"
                    placeholder="Nachname..."
                    value={surname}
                    onChange={onChangeGivenSurname}
                  />
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
                </div>
              </div>
              <div className="text-darkGrey opacity-80 ml-5 mb-7">
                Sie können zusätzlich alle von Ihnen neu hinzugefügten Beiträge
                herunterladen.
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
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
