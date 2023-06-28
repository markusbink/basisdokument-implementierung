import { CaretDown, CaretUp, Plus, X, XCircle } from "phosphor-react";
import { useRef, useState } from "react";
import { SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import { Button } from "../Button";
import {
  getEvidences,
  getEvidenceAttachmentId,
} from "../../util/get-evidences";
import { useCase, useHeaderContext } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IEvidence, UserRole } from "../../types";
import { ErrorPopup } from "../ErrorPopup";
import { v4 as uuidv4 } from "uuid";
import { Tooltip } from "../Tooltip";
import cx from "classnames";
import { EntryHeader } from "./EntryHeader";
import { getTheme } from "../../themes/getTheme";

interface EvidencesPopupProps {
  entryId?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaintiff: boolean;
  evidences: IEvidence[];
  backupEvidences: IEvidence[] | undefined;
  setEvidences: React.Dispatch<React.SetStateAction<IEvidence[]>>;
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
  backupEvidences,
  setEvidences,
}) => {
  const { entries, setEntries, currentVersion } = useCase();
  const { selectedTheme } = useHeaderContext();
  const [currentEvidences, setCurrentEvidences] =
    useState<IEvidence[]>(evidences);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [lastAttachmentId, setLastAttachmentId] = useState<string>("");
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [isEditErrorVisible, setIsEditErrorVisible] = useState<boolean>(false);
  const [evidenceToRemove, setEvidenceToRemove] = useState<IEvidence>();
  const [evidenceEditMode, setEvidenceEditMode] = useState<{
    evidence: IEvidence;
    value: boolean;
  }>();

  const inputRef = useRef(null);
  useOutsideClick(inputRef, () => setSuggestionsActive(false));

  const handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.key !== "Enter") return;
    handleEvidenceAddedToCurrent();
  };

  const handleEvidenceAddedToCurrent = () => {
    if (!currentInput || currentInput?.trim().length <= 0) return;
    const ev: IEvidence = {
      id: uuidv4(),
      name: currentInput,
      hasAttachment: hasAttachment,
      version: currentVersion,
      isCurrentEntry: true,
      role: isPlaintiff ? UserRole.Plaintiff : UserRole.Defendant,
      isInEditMode: false,
    };
    if (hasAttachment) {
      ev.role = isPlaintiff ? UserRole.Plaintiff : UserRole.Defendant;
      let id: string;
      if (lastAttachmentId) {
        id =
          (isPlaintiff ? "K" : "B") + (parseInt(lastAttachmentId.slice(1)) + 1);
      } else {
        id = getEvidenceAttachmentId(entries, ev.role);
      }
      ev.attachmentId = id;
      setLastAttachmentId(id);
    }
    setCurrentEvidences([...currentEvidences, ev]);
    setCurrentInput("");
    setHasAttachment(false);
  };

  const addExisting = (input: IEvidence) => {
    setCurrentEvidences([...currentEvidences, input]);
    setCurrentInput("");
  };

  const removeEvidence = (evidence: IEvidence) => {
    setEvidenceToRemove(evidence);
    if (!hasReferencesInOtherEntries(evidence.id)) {
      setIsEditErrorVisible(true);
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    evidenceToEdit: IEvidence
  ) => {
    const { value } = e.target;
    const newEntries = entries.map((entry) => {
      entry.evidences = entry.evidences.map((ev) => {
        if (ev.id === evidenceToEdit.id) {
          ev.name = value;
        }
        return ev;
      });
      return entry;
    });
    setEntries(newEntries);
  };

  const removeFromEntry = () => {
    const currentId = evidenceToRemove
      ? parseInt(evidenceToRemove.attachmentId!.slice(1))
      : -1;

    if (evidenceToRemove?.version === currentVersion) {
      let updatedEvidences = currentEvidences.filter(
        (evidence) => evidence.id !== evidenceToRemove?.id
      );
      updatedEvidences = updatedEvidences.map((evidence) => {
        if (
          evidence.version === currentVersion &&
          evidence.hasAttachment &&
          evidence.isCurrentEntry
        ) {
          if (
            currentId !== -1 &&
            parseInt(evidence.attachmentId!.slice(1)) > currentId
          ) {
            const newId = parseInt(evidence.attachmentId!.slice(1)) - 1;
            evidence.attachmentId = isPlaintiff ? "K" + newId : "B" + newId;
          }
        }
        return evidence;
      });
      setCurrentEvidences(updatedEvidences);
      setLastAttachmentId(getLastAttachemntId(updatedEvidences));
    } else {
      const filteredEvidences = currentEvidences.filter(
        (evidence) => evidence.id !== evidenceToRemove?.id
      );
      setCurrentEvidences(filteredEvidences);
      setLastAttachmentId(getLastAttachemntId(filteredEvidences));
    }
  };

  const getLastAttachemntId = (newEvidences: IEvidence[]): string => {
    let lastAttachmentId: string | undefined;
    for (let i = 0; i < newEvidences.length; i++) {
      if (newEvidences[i].attachmentId) {
        lastAttachmentId = newEvidences[i].attachmentId;
      }
    }
    return lastAttachmentId ? lastAttachmentId : "";
  };

  const addEvidence = () => {
    const updatedEvidences = currentEvidences.map((evidence) => {
      evidence.isCurrentEntry = false;
      return evidence;
    });
    setEvidences(updatedEvidences);
    setIsVisible(false);
  };

  const hasReferencesInOtherEntries = (id: string) => {
    for (let i = 0; i < entries.length; i++) {
      if (entryId && entryId !== entries[i].id) {
        for (let j = 0; j < entries[i].evidences.length; j++) {
          if (
            entries[i].evidences[j] &&
            entries[i].evidences[j].hasAttachment &&
            entries[i].evidences[j].id === id
          ) {
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
      (!(index < currentEvidences.length - 1) && direction === Direction.Down)
    ) {
      return;
    }

    const moveBy = direction === Direction.Up ? -1 : 1;
    const newCurrentEvidences = [...currentEvidences];
    [newCurrentEvidences[index + moveBy], newCurrentEvidences[index]] = [
      newCurrentEvidences[index],
      newCurrentEvidences[index + moveBy],
    ];
    setCurrentEvidences(newCurrentEvidences);
  };

  if (!isVisible) {
    return null;
  }

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
                  if (backupEvidences) setEvidences(backupEvidences);
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
                      {getEvidences(
                        entries,
                        currentInput,
                        currentEvidences
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
                  className="w-2.5 h-2.5 cursor-pointer"
                  type="checkbox"
                  id="new"
                  name="new"
                  value="new"
                  checked={hasAttachment}
                  onChange={() => setHasAttachment(!hasAttachment)}
                />
                <label
                  htmlFor="new"
                  className="cursor-pointer whitespace-nowrap pl-2">
                  {" "}
                  als Anlage
                </label>
              </div>
              <div className="items-center flex my-1">
                <Button
                  bgColor="bg-lightGreen hover:bg-darkGreen"
                  textColor="text-darkGreen hover:text-white"
                  alternativePadding="p-1.5"
                  icon={<Plus size={20} weight="bold" />}
                  onClick={() => handleEvidenceAddedToCurrent()}></Button>
              </div>
            </div>
          </div>
          <div
            className={cx("border-[1px] rounded-xl shadow mr-2", {
              [`border-${getTheme(selectedTheme)?.secondaryPlaintiff}`]:
                isPlaintiff,
              [`border-${getTheme(selectedTheme)?.secondaryDefendant}`]:
                !isPlaintiff,
            })}>
            <EntryHeader isPlaintiff={isPlaintiff} isBodyOpen={true}>
              <div>
                <i>Vorschau</i>
              </div>
            </EntryHeader>
            <div className="flex border-t border-lightGrey rounded-b-lg py-2 items-center gap-2 justify-between mt-4 mb-2 mx-6">
              {currentEvidences.length <= 0 ? (
                <div
                  className="flex flex-col gap-2 items-center cursor-pointer"
                  onClick={(e) => {
                    //TODO
                  }}>
                  <span className="italic">Keine Beweise</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full max-h-56 overflow-auto">
                  <span className="ml-1 font-bold">{currentEvidences.length === 1 ? "Beweis:" : "Beweise:"}</span>
                  <div className="flex flex-col flex-wrap gap-1">
                    {currentEvidences.map((ev, index) => (
                      <div className="flex flex-row">
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
                                    (!(index < currentEvidences.length - 1) &&
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
                              text="Doppelklick, um zu Editieren">
                              <div
                                className="flex flex-row gap-2 items-center"
                                onDoubleClick={() => {
                                  setEvidenceEditMode({
                                    evidence: ev,
                                    value: true,
                                  });
                                }}>
                                <span className="w-4">{index + 1 + "."}</span>
                                {evidenceEditMode?.value &&
                                evidenceEditMode?.evidence === ev ? (
                                  <>
                                    <input
                                      autoFocus={true}
                                      type="text"
                                      name="name"
                                      placeholder="Beschreibung..."
                                      className="focus:outline focus:outline-offWhite focus:bg-offWhite px-2 m-0 border-b-[1px]"
                                      value={ev.name}
                                      onBlur={() => {
                                        setEvidenceEditMode({
                                          evidence: ev,
                                          value: false,
                                        });
                                      }}
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
                              <span className="w-4">{index + 1 + "."}</span>

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

            <div className="flex items-center justify-end pt-6">
              <button
                className="bg-darkGrey hover:bg-mediumGrey rounded-md text-white py-2 px-3 text-sm"
                onClick={() => {
                  addEvidence();
                }}>
                Gelistete Beweise hinzufügen
              </button>
            </div>
          </div> */}
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
                removeFromEntry();
                setIsEditErrorVisible(false);
              }}>
              Löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </>
  );
};
