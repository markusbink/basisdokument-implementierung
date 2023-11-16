import {
  DotsThree,
  Eye,
  ImageSquare,
  PencilSimple,
  Trash,
} from "phosphor-react";
import React, { useRef, useState } from "react";
import { useCase, useHeaderContext } from "../../contexts";
import { IEvidence, UserRole } from "../../types";
import { getEntryCodesForEvidence } from "../../util/get-entry-code";
import { Button } from "../Button";
import cx from "classnames";
import { ErrorPopup } from "../ErrorPopup";
import { getTheme } from "../../themes/getTheme";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useEvidence } from "../../contexts/EvidenceContext";
import { ImageViewerPopup } from "../entry/ImageViewerPopup";
import { toast } from "react-toastify";
import { getEvidenceById } from "../../util/get-evidences";

export interface EvidenceProps {
  evidence: IEvidence;
}

export const Evidence: React.FC<EvidenceProps> = ({ evidence }) => {
  const { entries, setEntries, currentVersion } = useCase();
  const { selectedTheme } = useHeaderContext();
  const {
    evidenceList,
    removeFromEvidenceList,
    removeEvidenceIdDefendant,
    removeEvidenceIdPlaintiff,
  } = useEvidence();
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isInNameEditMode, setIsInNameEditMode] = useState<boolean>(false);
  const [isInAttachmentEditMode, setIsInAttachmentEditMode] =
    useState<boolean>(false);
  const [imagePopupFilename, setImagePopupFilename] = useState<string>("");
  const [imagePopupData, setImagePopupData] = useState<string>("");
  const [imagePopupAttachment, setImagePopupAttachment] = useState<string>("");
  const [imagePopupTitle, setImagePopupTitle] = useState<string>("");
  const [imagePopupVisible, setImagePopupVisible] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));

  let entryCodes: string[] | undefined = [];
  entryCodes = getEntryCodesForEvidence(entries, evidence);

  const imageFileUploadRef = useRef<HTMLInputElement>(null);
  const handleImageFileUpload = (e: any) => {
    const fileReader = new FileReader();
    try {
      if (
        (e.target.files[0].type as string).includes("image") ||
        (e.target.files[0].type as string).includes("pdf")
      ) {
        fileReader.readAsDataURL(e.target.files[0]);
        let filename = e.target.files[0].name;
        fileReader.onload = (e: any) => {
          let result = e.target.result;
          const newEntries = entries.map((entry) => {
            entry.evidenceIds = entry.evidenceIds?.map((evId) => {
              if (evId === evidence.id) {
                getEvidenceById(evidenceList, evId)!.imageFile = result;
                getEvidenceById(evidenceList, evId)!.imageFilename = filename;
              }
              return evId;
            });
            return entry;
          });
          setEntries(newEntries);
        };
        e.target.value = "";
      } else {
        throw new Error();
      }
    } catch (error) {
      toast.error("Bitte laden Sie eine valide PDF- oder TIFF-Datei hoch.");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newEntries = entries.map((entry) => {
      entry.evidenceIds = entry.evidenceIds?.map((evId) => {
        if (evId === evidence.id) {
          getEvidenceById(evidenceList, evId)!.name = value;
        }
        return evId;
      });
      return entry;
    });
    setEntries(newEntries);
  };

  const handleAttachmentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newEntries = entries.map((entry) => {
      entry.evidenceIds = entry.evidenceIds?.map((evId) => {
        if (evId === evidence.id) {
          getEvidenceById(evidenceList, evId)!.attachmentId = value;
        }
        return evId;
      });
      return entry;
    });
    setEntries(newEntries);
  };

  const removeEvidenceOverall = (evidence: IEvidence) => {
    removeFromEvidenceList(evidence);
    const newEntries = entries.map((entry) => {
      entry.evidenceIds = entry.evidenceIds?.filter(
        (evId) => evId !== evidence.id
      );
      if (evidence.hasAttachment) {
        if (evidence.role === UserRole.Plaintiff) {
          removeEvidenceIdPlaintiff(evidence.id);
        } else {
          removeEvidenceIdDefendant(evidence.id);
        }
      }
      return entry;
    });
    setEntries(newEntries);
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

  return (
    <div className="flex flex-col gap-2 bg-offWhite rounded-lg mt-4 p-2 font-medium">
      <div className="flex flex-row justify-between mt-1 w-full">
        {evidence.hasAttachment && (
          <>
            <div className="gap-1">
              <span className="text-xs font-bold ml-1 self-center">Anlage</span>
              {isInAttachmentEditMode ? (
                <input
                  autoFocus={true}
                  type="text"
                  name="name"
                  placeholder="Anlage..."
                  className="focus:outline focus:outline-offWhite focus:bg-offWhite px-2 m-0 border-b-[1px]"
                  value={evidence.attachmentId}
                  onBlur={() => setIsInAttachmentEditMode(false)}
                  onChange={handleAttachmentIdChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setIsInAttachmentEditMode(false);
                    }
                  }}
                />
              ) : (
                <span className="text-xs font-bold ml-1 self-center">
                  {evidence.attachmentId}
                </span>
              )}
            </div>
            <div>
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
          </>
        )}
      </div>
      {isInNameEditMode ? (
        <input
          autoFocus={true}
          type="text"
          name="name"
          placeholder="Beschreibung..."
          className="focus:outline focus:outline-offWhite focus:bg-offWhite px-2 m-0 border-b-[1px]"
          value={evidence.name}
          onBlur={() => setIsInNameEditMode(false)}
          onChange={handleNameChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsInNameEditMode(false);
            }
          }}
        />
      ) : (
        <span className="break-words w-full text-left border-b-[1px] px-2">
          {evidence.name}
        </span>
      )}
      <div className="flex flex-row w-full items-center">
        <div className="flex flex-row w-full gap-2 flex-wrap">
          {entryCodes &&
            entryCodes.map((entryCode) => (
              <div key={entryCode}>
                <a
                  href={`#${entryCode}`}
                  className={cx(
                    "flex items-center gap-1 px-1.5 py-0.25 rounded-xl text-[10px] font-semibold cursor-pointer min-w-fit grow",
                    {
                      "bg-darkGrey text-offWhite hover:bg-mediumGrey":
                        !entryCode,
                      [`bg-${
                        getTheme(selectedTheme)?.secondaryPlaintiff
                      } text-${
                        getTheme(selectedTheme)?.primaryPlaintiff
                      } hover-bg-${
                        getTheme(selectedTheme)?.primaryPlaintiff
                      } hover-text-${
                        getTheme(selectedTheme)?.secondaryPlaintiff
                      }`]: entryCode.charAt(0) === "K",
                      [`bg-${
                        getTheme(selectedTheme)?.secondaryDefendant
                      } text-${
                        getTheme(selectedTheme)?.primaryDefendant
                      } hover-bg-${
                        getTheme(selectedTheme)?.primaryDefendant
                      } hover-text-${
                        getTheme(selectedTheme)?.secondaryDefendant
                      }`]: entryCode.charAt(0) === "B",
                    }
                  )}>
                  <Eye size={16} weight="bold" className="inline"></Eye>
                  {`${entryCode}`}
                </a>
              </div>
            ))}
        </div>
        {evidence.version === currentVersion && (
          <div ref={ref} className="self-end relative">
            <Button
              key="evidenceMenu"
              bgColor={
                isMenuOpen ? "bg-lightGrey" : "bg-offWhite hover:bg-lightGrey"
              }
              size="sm"
              textColor="text-darkGrey"
              hasText={false}
              alternativePadding="p-1"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              icon={<DotsThree size={20} weight="bold" />}></Button>{" "}
            {isMenuOpen ? (
              <ul className="absolute right-0 bottom-2 p-2 bg-white text-darkGrey rounded-xl w-[220px] shadow-lg z-50 font-medium text-xs">
                {evidence.hasImageFile ? (
                  <li
                    tabIndex={0}
                    onClick={() => {
                      imageFileUploadRef?.current?.click();
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      ref={imageFileUploadRef}
                      onChange={(e) => {
                        handleImageFileUpload(e);
                        setIsMenuOpen(false);
                      }}
                    />
                    <PencilSimple size={16} />
                    Datei bearbeiten
                  </li>
                ) : null}
                {evidence.hasAttachment ? (
                  <li
                    tabIndex={0}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsInAttachmentEditMode(true);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                    <PencilSimple size={16} />
                    Nummerierung bearbeiten
                  </li>
                ) : null}
                <li
                  tabIndex={0}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsInNameEditMode(true);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                  <PencilSimple size={16} />
                  Benennung bearbeiten
                </li>

                <li
                  tabIndex={0}
                  onClick={() => setIsDeleteErrorVisible(true)}
                  className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                  <Trash size={16} />
                  Löschen
                </li>
              </ul>
            ) : null}
          </div>
        )}
      </div>
      <ImageViewerPopup
        isVisible={imagePopupVisible}
        filedata={imagePopupData}
        filename={imagePopupFilename}
        title={imagePopupTitle}
        attachmentId={imagePopupAttachment}
        setIsVisible={setImagePopupVisible}></ImageViewerPopup>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie den Beweis <b>{evidence.name}</b> löschen
            möchten? Der Beweis wird aus allen Beiträgen gelöscht. Diese Aktion
            kann nicht rückgängig gemacht werden.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsDeleteErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
                removeEvidenceOverall(evidence);
              }}>
              Beweis löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </div>
  );
};
