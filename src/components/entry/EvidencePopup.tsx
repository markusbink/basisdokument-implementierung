import { DotsSixVertical, Plus, X, XCircle } from "phosphor-react";
import { useRef, useState } from "react";
import { SyntheticKeyboardEvent } from "react-draft-wysiwyg";
import { Button } from "../Button";
import {
  getEvidences,
  getEvidenceAttachmentId,
} from "../../util/get-evidences";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IEvidence, UserRole } from "../../types";
import { ErrorPopup } from "../ErrorPopup";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface EvidencesPopupProps {
  entryId?: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaintiff: boolean;
  evidences: IEvidence[];
  backupEvidences: IEvidence[] | undefined;
  setEvidences: React.Dispatch<React.SetStateAction<IEvidence[]>>;
}

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
  const [currentEvidences, setCurrentEvidences] =
    useState<IEvidence[]>(evidences);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);
  const [lastAttachmentId, setLastAttachmentId] = useState<string>("");
  const [hasAttachment, setHasAttachment] = useState<boolean>(false);
  const [isEditErrorVisible, setIsEditErrorVisible] = useState<boolean>(false);
  const [evidenceToRemove, setEvidenceToRemove] = useState<IEvidence>();

  const inputRef = useRef(null);
  useOutsideClick(inputRef, () => setSuggestionsActive(false));

  const handleKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.key !== "Enter") return;
    login();
  };

  const login = () => {
    if (!currentInput || currentInput?.trim().length <= 0) return;
    const ev: IEvidence = {
      id: uuidv4(),
      name: currentInput,
      hasAttachment: hasAttachment,
      version: currentVersion,
      isCurrentEntry: true,
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

  const removeEvidenceOverall = (id: string) => {
    const newEntries = entries.map((entry) => {
      entry.evidences.forEach((evidence) => {
        if (evidence.hasAttachment && evidence.id === id) {
          entry.evidences = entry.evidences.splice(
            entry.evidences.indexOf(evidence)
          );
        }
      });
      return entry;
    });
    setEntries(newEntries);
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

  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...currentEvidences];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setCurrentEvidences(updatedList);
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
            p-8 bg-white rounded-lg content-center shadow-lg space-y-4 w-full max-w-[600px]">
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
            Fügen Sie Beweise zum Beweisbereich dieses Beitrags hinzu, indem Sie
            eine kurze Beschreibung angeben. Sie können dabei auch auf Anlagen
            verweisen, welche Sie später mit versenden. Beweise, die hier
            hinzugefügt wurden, können dann auch in anderen Beiträgen
            referenziert werden.
          </span>
          <div className="flex flex-col pr-6">
            <div className="flex flex-row w-full items-center justify-between gap-1">
              <div className="w-full" ref={inputRef}>
                <input
                  value={currentInput}
                  className="w-full px-2 py-2 text-sm bg-offWhite block rounded-lg text-mediumGrey focus:outline-none"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                  }}
                  onFocus={(e) => setSuggestionsActive(true)}
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
                  bgColor="bg-offWhite hover:bg-lightGrey"
                  alternativePadding="p-1.5"
                  icon={<Plus size={20} color="grey" weight="regular" />}
                  onClick={() => login()}></Button>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <span>
              {currentEvidences && currentEvidences.length > 0
                ? "Beweise"
                : "Bisher keine Beweise"}{" "}
              zu diesem Beitrag
            </span>
            <div className="flex flex-col gap-1 w-full max-h-[20vh] overflow-auto mt-2">
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="sorting-evidences">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {currentEvidences.map((ev, index) => (
                        <Draggable
                          key={index}
                          draggableId={index + ""}
                          index={index}>
                          {(provided) => (
                            <div
                              className="flex flex-row items-center py-1 rounded-lg w-full"
                              key={index}
                              ref={provided.innerRef}
                              {...provided.draggableProps}>
                              <div className="flex flex-row items-center select-none group w-full">
                                <div {...provided.dragHandleProps}>
                                  <DotsSixVertical size={24} />
                                </div>
                                <a
                                  href={`#${ev}`}
                                  draggable={false}
                                  className="flex flex-row gap-2 rounded-md p-2 bg-offWhite text-darkGrey w-full justify-between item-container transition-all group-hover:bg-lightGrey"
                                  onClick={(e) => e.stopPropagation()}>
                                  <div className="flex flex-row gap-3">
                                    <span>{index + 1 + "."}</span>
                                    <span className="break-words text-sm font-medium">
                                      {ev.name}
                                    </span>
                                    {ev.hasAttachment && (
                                      <span>
                                        <b>als Anlage {ev.attachmentId}</b>
                                      </span>
                                    )}
                                  </div>
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
                                </a>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
          </div>
        </div>
      </div>
      <ErrorPopup isVisible={isEditErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-center text-base">
            Dieser Beweis wird in keinem anderen Beitrag referenziert. Wenn Sie
            ihn also aus dem Beweisbereich dieses Beitrags löschen, wird er
            zunächst für das ganze Basisdokument gelöscht.
          </p>
          <p className="text-center text-base">
            Um den Beweis bei einem anderen Beitrag anzuhängen, müssen Sie den
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
