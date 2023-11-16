import {
  CaretDown,
  CaretUp,
  ImageSquare,
  Trash,
  Upload,
  X,
  XCircle,
} from "phosphor-react";
import { useRef, useState } from "react";
import { SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import { Button } from "../Button";
import { getFilteredEvidencesSuggestions } from "../../util/get-evidences";
import { useCase, useHeaderContext } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IEvidence, UserRole } from "../../types";
import { ErrorPopup } from "../ErrorPopup";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "../Tooltip";
import cx from "classnames";
import { getTheme } from "../../themes/getTheme";
import { ImageViewerPopup } from "./ImageViewerPopup";
import { useEvidence } from "../../contexts/EvidenceContext";

interface EvidencesPopupProps {
  entryId?: string;
  caveatOfProof: boolean;
  setCaveatOfProof: React.Dispatch<React.SetStateAction<boolean>>;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaintiff: boolean;
  evidences: IEvidence[];
  setEvidencesToSave: React.Dispatch<React.SetStateAction<IEvidence[]>>;
}

const enum Direction {
  Up = "up",
  Down = "down",
}

const moveEvidenceButtons = [
  {
    icon: <CaretUp size={8} weight="bold" />,
    title: "Nach oben verschieben",
    action: Direction.Up,
  },
  {
    icon: <CaretDown size={8} weight="bold" />,
    title: "Nach unten verschieben",
    action: Direction.Down,
  },
];

export const EvidencesPopup: React.FC<EvidencesPopupProps> = ({
  entryId,
  isVisible,
  setIsVisible,
  isPlaintiff,
  evidences,
  setEvidencesToSave,
  caveatOfProof,
  setCaveatOfProof,
}) => {
  const { entries, currentVersion } = useCase();
  const { selectedTheme } = useHeaderContext();
  const {
    evidenceList,
    evidenceIdsDefendant,
    evidenceIdsPlaintiff,
    removeLast,
    plaintiffFileVolume,
    setPlaintiffFileVolume,
    defendantFileVolume,
    setDefendantFileVolume,
    getFileSize,
  } = useEvidence();
  const [currentEvidenceList, setCurrentEvidenceList] =
    useState<IEvidence[]>(evidences);
  const [currEvIdsPlaintiff, setCurrEvIdsPlaintiff] =
    useState<(string | undefined)[]>(evidenceIdsPlaintiff);
  const [currEvIdsDefendant, setCurrEvIdsDefendant] =
    useState<(string | undefined)[]>(evidenceIdsDefendant);

  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentCaveatOfProof, setCurrentCaveatOfProof] =
    useState<boolean>(caveatOfProof);
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [hasImageFile, setHasImageFile] = useState<boolean>(false);
  const [isEditErrorVisible, setIsEditErrorVisible] = useState<boolean>(false);
  const [evidenceToRemove, setEvidenceToRemove] = useState<IEvidence>();
  const [evidenceEditMode, setEvidenceEditMode] = useState<{
    evidence: IEvidence;
    value: boolean;
  }>();
  const [imagePopupFilename, setImagePopupFilename] = useState<string>("");
  const [imagePopupData, setImagePopupData] = useState<string>("");
  const [imagePopupAttachment, setImagePopupAttachment] = useState<string>("");
  const [imagePopupTitle, setImagePopupTitle] = useState<string>("");
  const [imagePopupVisible, setImagePopupVisible] = useState<boolean>(false);
  const [fileVolumeExceeded, setFileVolumeExceeded] = useState<boolean>(false);
  const [currPlaintiffFileVolume, setCurrPlaintiffFileVolume] =
    useState<number>(plaintiffFileVolume);
  const [currDefendantFileVolume, setCurrDefendantFileVolume] =
    useState<number>(defendantFileVolume);

  const inputRef = useRef(null);
  useOutsideClick(inputRef, () => setSuggestionsActive(false));

  const handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.key !== "Enter") return;
    handleEvidenceAddedToCurrent();
  };

  const [isValidImageFile, setIsValidImageFile] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [imageFile, setImageFile] = useState<string | undefined>("");
  const [imageFilename, setImageFilename] = useState<string>("");
  const imageFileUploadRef = useRef<HTMLInputElement>(null);

  const handleImageFileUpload = (e: any) => {
    const fileReader = new FileReader();
    try {
      // only tiff and pdf allowed
      if (
        (e.target.files[0].type as string).includes("tiff") ||
        (e.target.files[0].type as string).includes("pdf")
      ) {
        fileReader.readAsDataURL(e.target.files[0]);
        setImageFilename(e.target.files[0].name);
        fileReader.onload = (e: any) => {
          let result = e.target.result;
          setImageFile(result);
          getImageFileSize(result);
          setHasImageFile(true);
        };
        e.target.value = "";
        setErrorText("");
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrorText("Bitte laden Sie eine valide PDF- oder TIFF-Datei hoch.");
    }
  };

  const getImageFileSize = (imgfile: string | undefined) => {
    if (imgfile) {
      let imgFileSize = getFileSize(imgfile);
      // check if new file would exceed data limit of 40MB for plaintiff/defendant
      if (
        (isPlaintiff ? currPlaintiffFileVolume : defendantFileVolume) +
          imgFileSize <
        40000000
      ) {
        if (isPlaintiff) {
          setCurrPlaintiffFileVolume(currPlaintiffFileVolume + imgFileSize);
        } else {
          setCurrDefendantFileVolume(currDefendantFileVolume + imgFileSize);
        }
      } else {
        setFileVolumeExceeded(true);
        setErrorText(
          "Die PDF oder TIFF-Datei ist zu groß! Bitte verkleinern Sie die Datei."
        );
      }
      return imgFileSize;
    } else {
      return 0;
    }
  };

  const updateCurrEvidenceList = (evidenceToUpdate: IEvidence) => {
    let updatedCurrEvidenceList: IEvidence[] = [];
    let evidenceUpdated: boolean = false;
    for (let i = 0; i < currentEvidenceList.length; i++) {
      if (currentEvidenceList[i].id === evidenceToUpdate.id) {
        updatedCurrEvidenceList.push(evidenceToUpdate);
        evidenceUpdated = true;
      } else {
        updatedCurrEvidenceList.push(currentEvidenceList[i]);
      }
    }
    if (evidenceUpdated === false) {
      updatedCurrEvidenceList.push(evidenceToUpdate);
    }
    setCurrentEvidenceList(updatedCurrEvidenceList);
  };

  const addToCurrEvidenceIdDefendant = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i = 0; i < currEvIdsDefendant.length; i++) {
      if (currEvIdsDefendant[i] === undefined) {
        // set initial attachmentId value
        evidence.attachmentId = "B" + (i + 1);
        currEvIdsDefendant[i] = evidence.id;
        emptySpace = true;
      }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId = "B" + (currEvIdsDefendant.length + 1).toString();
      currEvIdsDefendant.push(evidence.id);
    }
    updateCurrEvidenceList(evidence);
  };

  const addToCurrEvidenceIdPlaintiff = (evidence: IEvidence) => {
    let emptySpace = false;
    for (let i = 0; i < currEvIdsPlaintiff.length; i++) {
      if (currEvIdsPlaintiff[i] === undefined) {
        // set initial attachmentId value
        evidence.attachmentId = "K" + (i + 1);
        currEvIdsPlaintiff[i] = evidence.id;
        emptySpace = true;
      }
    }
    if (emptySpace === false) {
      // set initial attachmentId value
      evidence.attachmentId = "K" + (currEvIdsPlaintiff.length + 1).toString();
      currEvIdsPlaintiff.push(evidence.id);
    }
    updateCurrEvidenceList(evidence);
  };

  const removeCurrEvidenceIdDefendant = (evidenceId: string) => {
    setCurrEvIdsDefendant(
      currEvIdsDefendant.map((evId) => (evId === evidenceId ? undefined : evId))
    );
    removeLast(currEvIdsDefendant);
  };

  const removeCurrEvidenceIdPlaintiff = (evidenceId: string) => {
    setCurrEvIdsPlaintiff(
      currEvIdsPlaintiff.map((evId) => (evId === evidenceId ? undefined : evId))
    );
    removeLast(currEvIdsPlaintiff);
  };

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

  const handleEvidenceAddedToCurrent = () => {
    if (!currentInput || currentInput?.trim().length <= 0) {
      setErrorText("Bitte Beschreibung hinzufügen");
      return;
    }
    if (hasImageFile && !imageFile) {
      setErrorText("Bitte PDF oder TIFF-Datei hochladen");
      return;
    }
    const ev: IEvidence = {
      id: uuidv4(),
      name: currentInput,
      hasAttachment: hasAttachment,
      hasImageFile: hasImageFile,
      version: currentVersion,
      //isCurrentEntry: true,
      role: isPlaintiff ? UserRole.Plaintiff : UserRole.Defendant,
      isInEditMode: false,
    };
    if (hasImageFile) {
      ev.imageFile = imageFile;
      ev.imageFilename = imageFilename;
      setImageFile("");
      setImageFilename("");
    }

    // if has attachment add to plaintiff/defendant arrays for attachment id handling
    if (hasAttachment) {
      if (ev.role === UserRole.Plaintiff) {
        addToCurrEvidenceIdPlaintiff(ev);
      } else {
        addToCurrEvidenceIdDefendant(ev);
      }
      setCurrentEvidenceList([...currentEvidenceList, ev]);
    } else {
      // if no attachment, no adding to plaintiff/defendant arrays is needed
      setCurrentEvidenceList([...currentEvidenceList, ev]);
    }
    setCurrentInput("");
    setErrorText("");
    setHasAttachment(false);
    setHasImageFile(false);
  };

  // if existing evidence is added to entry, no handling of plaintiff/defendant arrays is needed
  const addExisting = (input: IEvidence) => {
    setCurrentEvidenceList([...currentEvidenceList, input]);
    setCurrentInput("");
  };

  // check if evidence would be removed only from entry or whole document
  const removeEvidence = (evidence: IEvidence) => {
    // set evidence for possible removal
    setEvidenceToRemove(evidence);
    // open edit error if evidence would be removed from whole document
    if (!hasReferencesInOtherEntries(evidence.id)) {
      setIsEditErrorVisible(true);
    } else {
      removeFromEntry(evidence);
    }
  };

  // handle input for adjusted name of evidence
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    evidenceToEdit: IEvidence
  ) => {
    const { value } = e.target;
    evidenceToEdit.name = value;
    updateCurrEvidenceList(evidenceToEdit);
  };

  // handle input for individual attachment id
  const handleAttachmentIdChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    evidenceToEdit: IEvidence
  ) => {
    const { value } = e.target;
    evidenceToEdit.attachmentId = value;
    if (evidenceToEdit.role === UserRole.Plaintiff) {
    }
    updateCurrEvidenceList(evidenceToEdit);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    evidenceToEdit: IEvidence
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && (file.type as string).includes("image")) {
      const fileReader = new FileReader();
      try {
        fileReader.readAsDataURL(file);
        fileReader.onload = (e: any) => {
          evidenceToEdit.imageFile = e.target.result;
          evidenceToEdit.imageFilename = file.name;
          updateCurrEvidenceList(evidenceToEdit);
        };
        e.target.value = "";
      } catch (error) {}
    }
  };

  const removeFromEntry = (evidenceToDelete: IEvidence) => {
    // filter evidenceToDelete from currentEvidenceList
    const filteredEvidences = currentEvidenceList.filter(
      (evidence) => evidence.id !== evidenceToDelete.id
    );
    if (evidenceToDelete.hasAttachment) {
      if (evidenceToDelete.role === UserRole.Plaintiff) {
        removeCurrEvidenceIdPlaintiff(evidenceToDelete.id);
      } else {
        removeCurrEvidenceIdDefendant(evidenceToDelete.id);
      }
    }
    setCurrentEvidenceList(filteredEvidences);
  };

  // click on "save":
  const saveEvidences = () => {
    setEvidencesToSave(currentEvidenceList);
    // dataVolumeToSave
    if (isPlaintiff) {
      setPlaintiffFileVolume(currPlaintiffFileVolume);
    } else {
      setDefendantFileVolume(currDefendantFileVolume);
    }
    //TODO: check if changes are made without "Hinzufügen", dann Hinweis zum speichern!
    setIsVisible(false);
  };

  const hasReferencesInOtherEntries = (id: string) => {
    for (let i = 0; i < entries.length; i++) {
      if (entryId && entryId !== entries[i].id) {
        for (let j = 0; j < entries[i].evidenceIds?.length; j++) {
          if (entries[i].evidenceIds[j] && entries[i].evidenceIds[j] === id) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleMoveEvidence = (direction: Direction, index: number) => {
    if (
      (!(index > 0) && direction === Direction.Up) ||
      (!(index < currentEvidenceList.length - 1) &&
        direction === Direction.Down)
    ) {
      return;
    }
    const moveBy = direction === Direction.Up ? -1 : 1;
    const newCurrentEvidenceList = [...currentEvidenceList];
    [newCurrentEvidenceList[index + moveBy], newCurrentEvidenceList[index]] = [
      newCurrentEvidenceList[index],
      newCurrentEvidenceList[index + moveBy],
    ];
    setCurrentEvidenceList(newCurrentEvidenceList);
  };

  if (!isVisible) {
    return null;
  }

  const caveatOfProofClicked = (e: any) => {
    setCurrentCaveatOfProof(e.target.checked);
    setCaveatOfProof(e.target.checked);
  };

  return (
    <>
      <div className="opacity-25 fixed inset-0 z-40 bg-black !m-0" />
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            p-8 bg-white rounded-lg content-center shadow-lg space-y-8 w-full max-w-[600px]">
          <div className="flex items-start justify-between rounded-lg ">
            <h3>Beweise hinzufügen</h3>
            <div>
              <button
                onClick={() => {
                  setIsVisible(false);
                }}
                className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                <X size={24} />
              </button>
            </div>
          </div>
          <span className="text-sm">
            Fügen Sie Beweise zu diesem Beitrag hinzu. Sie können dabei auch auf
            Anlagen verweisen, welche Sie später mit versenden. Beweise, die
            hier hinzugefügt wurden, können auch in anderen Beiträgen
            referenziert werden.
          </span>
          <div className="flex flex-col mr-2">
            <div className="flex flex-row w-full items-center justify-between gap-1">
              <div className="w-full" ref={inputRef}>
                <input
                  value={currentInput}
                  className="w-full px-2 py-2 text-sm bg-offWhite block rounded-lg text-mediumGrey focus:outline-none"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                  }}
                  onFocus={() => setSuggestionsActive(true)}
                  type="text"
                  placeholder="Beschreibung..."
                />

                <div className="relative">
                  {suggestionsActive ? (
                    <ul className="absolute my-1 ml-0 p-1 text-darkGrey w-full max-h-[100px] overflow-auto opacity-90 bg-offWhite rounded-b-lg shadow-lg empty:hidden">
                      {getFilteredEvidencesSuggestions(
                        evidenceList,
                        currentInput,
                        currentEvidenceList
                      ).map((ev, index) => (
                        <li
                          key={index}
                          tabIndex={index}
                          className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer"
                          onClick={(e: React.BaseSyntheticEvent) => {
                            setCurrentInput(e.target.innerHTML);
                            setSuggestionsActive(false);
                            addExisting(ev);
                          }}>
                          {ev.name}
                          {ev.hasAttachment && (
                            <span>
                              <b> als Anlage {ev.attachmentId}</b>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
              <div className="bg-offWhite rounded-lg px-2 py-1.5 self-center items-center flex">
                <input
                  className="w-2.5 h-2.5 cursor-pointer accent-darkGrey"
                  type="checkbox"
                  id="att"
                  name="att"
                  value="att"
                  checked={hasAttachment}
                  onChange={(e) => {
                    if (hasImageFile && !e.target.checked) {
                      setHasImageFile(false);
                    }
                    setHasAttachment(!hasAttachment);
                  }}
                />
                <label
                  htmlFor="att"
                  className="cursor-pointer whitespace-nowrap pl-2">
                  {" "}
                  als Anlage
                </label>
              </div>
              <div className="bg-offWhite rounded-lg px-2 py-1.5 self-center items-center flex">
                <input
                  className="w-2.5 h-2.5 cursor-pointer accent-darkGrey"
                  type="checkbox"
                  id="img"
                  name="img"
                  value="img"
                  checked={hasImageFile}
                  onChange={(e) => {
                    setHasImageFile(!hasImageFile);
                    if (e.target.checked) setHasAttachment(true);
                    else {
                      setImageFile("");
                      setImageFilename("");
                      setErrorText("");
                    }
                  }}
                />
                <label
                  htmlFor="img"
                  className="cursor-pointer whitespace-nowrap pl-2">
                  {" "}
                  als PDF/TIFF
                </label>
              </div>
            </div>
            {hasImageFile && (
              <>
                <div className="bg-offWhite rounded-md pl-3 pr-3 p-2 my-2 flex flex-row justify-between items-center gap-2">
                  {(imageFile
                    ? "PDF/TIFF hochgeladen: "
                    : "PDF/TIFF hochladen: ") + imageFilename}
                  <div className="flex gap-2">
                    <label
                      role="button"
                      className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        accept=".tiff,.pdf"
                        ref={imageFileUploadRef}
                        onChange={handleImageFileUpload}
                      />
                      <button
                        onClick={() => {
                          if (!isValidImageFile) {
                            setErrorText("");
                            setIsValidImageFile(true);
                          }
                          imageFileUploadRef?.current?.click();
                        }}
                        className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                        <Upload size={24} color={"white"} />
                      </button>
                    </label>
                    {true && (
                      <button
                        onClick={() => {
                          if (isPlaintiff) {
                            setCurrPlaintiffFileVolume(
                              currPlaintiffFileVolume -
                                getImageFileSize(imageFile)
                            );
                          } else {
                            setCurrDefendantFileVolume(
                              currDefendantFileVolume -
                                getImageFileSize(imageFile)
                            );
                          }
                          setFileVolumeExceeded(false);
                          setImageFile(undefined);
                          setImageFilename("");
                          setErrorText("");
                        }}
                        className="bg-lightRed hover:bg-marker-red rounded-md p-1">
                        <Trash size={24} color={"darkRed"} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full gap-2 mb-2 items-center">
                  <label htmlFor="fileVolume">
                    {isPlaintiff ? "Klagepartei" : "Beklagtenpartei"}{" "}
                    Dateivolumen verbleibend:
                  </label>
                  {/* styling the progress-bar: https://github.com/tailwindlabs/tailwindcss/discussions/3921 */}
                  <progress
                    className="[&::-webkit-progress-bar]:bg-offWhite [&::-webkit-progress-value]:bg-purple-300 [&::-moz-progress-bar]:bg-purple-300"
                    id="fileVolume"
                    max="40000000"
                    value={
                      isPlaintiff
                        ? currPlaintiffFileVolume
                        : currDefendantFileVolume
                    }></progress>
                  <span>
                    {Number(
                      (
                        100 -
                        100 /
                          (40000000 /
                            (isPlaintiff
                              ? currPlaintiffFileVolume
                              : currDefendantFileVolume))
                      ).toFixed(1)
                    )}{" "}
                    %
                  </span>
                </div>
                <div>
                  {errorText !== "" ? (
                    <div className="flex bg-lightRed p-2 -mt-1 mb-1 rounded-md">
                      <p className="text-darkRed">
                        <span className="font-bold">Fehler:</span> {errorText}
                      </p>
                    </div>
                  ) : null}
                </div>
              </>
            )}
            <div className="items-center flex my-1 w-full">
              <Button
                bgColor="bg-lightGreen hover:bg-darkGreen"
                textColor="text-darkGreen hover:text-white"
                alternativePadding="p-1.5 w-full"
                disabled={(hasImageFile && !imageFile) || fileVolumeExceeded}
                onClick={() => {
                  if (!fileVolumeExceeded) handleEvidenceAddedToCurrent();
                }}>
                Hinzufügen
              </Button>
            </div>
          </div>
          <div
            className={cx("border-[1px] rounded-xl shadow mr-2", {
              [`border-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
                isPlaintiff,
              [`border-${getTheme(selectedTheme)?.secondaryDefendant}`]:
                !isPlaintiff,
            })}>
            <div
              className={`flex items-center justify-between rounded-t-lg px-6 py-3 cursor-pointer select-none ${
                isPlaintiff
                  ? `bg-${getTheme(selectedTheme)?.secondaryPlaintiff} text-${
                      getTheme(selectedTheme)?.primaryPlaintiff
                    }`
                  : `bg-${getTheme(selectedTheme)?.secondaryDefendant} text-${
                      getTheme(selectedTheme)?.primaryDefendant
                    }`
              }`}>
              <div>
                <i>Vorschau</i>
              </div>
            </div>
            <div className="flex border-t border-lightGrey rounded-b-lg py-2 items-center gap-2 justify-between mt-4 mb-2 mx-6">
              {currentEvidenceList.length <= 0 ? (
                <div className="flex flex-col gap-2 items-center">
                  <span className="italic">Keine Beweise</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full max-h-56 overflow-auto">
                  <span className="ml-1 font-bold">
                    {(currentEvidenceList.length === 1 ? "Beweis" : "Beweise") +
                      (currentCaveatOfProof
                        ? " unter Verwahrung gegen die Beweislast"
                        : "") +
                      ":"}
                  </span>

                  <div className="flex flex-col flex-wrap gap-1">
                    {currentEvidenceList.map((ev, index) => (
                      <div key={index} className="flex flex-row">
                        <div className="flex pr-1 flex-col">
                          {moveEvidenceButtons.map((button, btnIndex) => (
                            <button
                              key={`${btnIndex}-${button.title}`}
                              onClick={() => {
                                handleMoveEvidence(button.action, index);
                              }}
                              className={cx(
                                "flex items-center py-1 px-1 hover:bg-mediumGrey text-darkGrey hover:text-white rounded transition-all",
                                {
                                  // Disabled buttons when cannot move up or down
                                  "cursor-default hover:bg-transparent hover:text-darkGrey opacity-50":
                                    (!(index > 0) &&
                                      button.action === Direction.Up) ||
                                    (!(
                                      index <
                                      currentEvidenceList.length - 1
                                    ) &&
                                      button.action === Direction.Down),
                                }
                              )}>
                              {button.icon}
                            </button>
                          ))}
                        </div>
                        <div
                          className="flex flex-row items-center px-2 rounded-lg py-1 bg-offWhite justify-between w-full"
                          key={index}>
                          {ev.version === currentVersion ? (
                            <Tooltip
                              className="w-full"
                              text="Doppelklick, um zu Editieren - Enter, um zu Bestätigen">
                              <div
                                className="flex flex-row gap-2 items-center"
                                onDoubleClick={() => {
                                  setEvidenceEditMode({
                                    evidence: ev,
                                    value: true,
                                  });
                                }}>
                                {currentEvidenceList.length !== 1 && (
                                  <span className="w-4">{index + 1 + "."}</span>
                                )}
                                {evidenceEditMode?.value &&
                                evidenceEditMode?.evidence === ev ? (
                                  <>
                                    <input
                                      autoFocus={true}
                                      type="text"
                                      name="name"
                                      placeholder="Beschreibung..."
                                      className="focus:outline focus:outline-offWhite bg-offWhite px-2 m-0 border-b-[1px] border-slate-500"
                                      value={ev.name}
                                      onChange={(e) => handleNameChange(e, ev)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          setEvidenceEditMode({
                                            evidence: ev,
                                            value: false,
                                          });
                                        }
                                      }}
                                    />
                                    {ev.hasAttachment && (
                                      <span className="flex flex-row">
                                        <b>
                                          {" "}
                                          als Anlage
                                          <input
                                            autoFocus={false}
                                            type="text"
                                            name="name"
                                            placeholder="Anlagennummer"
                                            className="focus:outline focus:outline-offWhite bg-offWhite px-2 m-0 border-b-[1px] border-slate-500 w-14"
                                            value={ev.attachmentId}
                                            onChange={(e) =>
                                              handleAttachmentIdChange(e, ev)
                                            }
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                setEvidenceEditMode({
                                                  evidence: ev,
                                                  value: false,
                                                });
                                              }
                                            }}
                                          />
                                        </b>
                                      </span>
                                    )}
                                    {ev.hasImageFile && (
                                      <>
                                        <input
                                          type="file"
                                          ref={imageFileUploadRef}
                                          onChange={(e) => {
                                            handleImageChange(e, ev);
                                          }}
                                        />
                                        <ImageSquare
                                          size={20}
                                          className="text-mediumGrey hover:text-black"
                                          onClick={() => {
                                            if (!isValidImageFile) {
                                              setErrorText("");
                                              setIsValidImageFile(true);
                                            }
                                            imageFileUploadRef?.current?.click();
                                          }}
                                        />
                                      </>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {ev.hasAttachment ? (
                                      <span className="break-words font-medium">
                                        {ev.name}
                                        <b> als Anlage {ev.attachmentId}</b>
                                      </span>
                                    ) : (
                                      <span className="break-words font-medium">
                                        {ev.name}
                                      </span>
                                    )}
                                    {ev.hasImageFile && (
                                      <ImageSquare
                                        size={20}
                                        className="text-mediumGrey hover:text-black"
                                        onClick={() => {
                                          showImage(
                                            ev.imageFile!,
                                            ev.imageFilename!,
                                            ev.attachmentId!,
                                            ev.name
                                          );
                                        }}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="flex flex-row gap-2 items-center">
                              <span className="w-4">
                                {currentEvidenceList.length === 1
                                  ? ""
                                  : index + 1 + "."}
                              </span>

                              {ev.hasAttachment ? (
                                <span className="break-words font-medium">
                                  {ev.name}
                                  <b> als Anlage {ev.attachmentId}</b>
                                </span>
                              ) : (
                                <span className="break-words font-medium">
                                  {ev.name}
                                </span>
                              )}
                            </div>
                          )}
                          <div>
                            <XCircle
                              size={20}
                              weight="fill"
                              className="cursor-pointer"
                              onClick={() => {
                                removeEvidence(ev);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <input
              autoFocus={false}
              type="checkbox"
              name="caveat"
              checked={currentCaveatOfProof}
              placeholder="Beweislast"
              className="bg-offWhite px-2 m-0 w-8 accent-darkGrey"
              onChange={(e) => caveatOfProofClicked(e)}
            />
            Zusatz "Unter Verwahrung gegen die Beweislast" hinzufügen
          </div>
          <div className="flex items-center justify-end">
            <button
              className="bg-darkGrey hover:bg-mediumGrey rounded-md text-white py-2 px-3 text-sm"
              onClick={() => {
                saveEvidences();
              }}>
              {(currentEvidenceList.length === 1 ? "Beweis" : "Beweise") +
                " speichern"}
            </button>
          </div>
        </div>
      </div>
      <ErrorPopup isVisible={isEditErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-center text-base">
            Dieser Beweis wird in keinem anderen Beitrag referenziert. Wenn Sie
            ihn aus diesem Beitrag löschen, wird er für das gesamte
            Basisdokument entfernt.
          </p>
          <p className="text-center text-base">
            Um den Beweis zu einem anderen Beitrag zu referenzieren, müssen Sie
            ihn dort erneut erstellen.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsEditErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                removeFromEntry(evidenceToRemove!);
                setIsEditErrorVisible(false);
              }}>
              Löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
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
