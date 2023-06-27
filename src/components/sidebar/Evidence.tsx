import { DotsThree, Eye, PencilSimple, Trash } from "phosphor-react";
import React, { useRef, useState } from "react";
import { useCase, useHeaderContext } from "../../contexts";
import { IEvidence } from "../../types";
import { getEntryCodesForEvidence } from "../../util/get-entry-code";
import { Button } from "../Button";
import cx from "classnames";
import { ErrorPopup } from "../ErrorPopup";
import { getTheme } from "../../themes/getTheme";
import { useOutsideClick } from "../../hooks/use-outside-click";

export interface EvidenceProps {
  evidence: IEvidence;
}

export const Evidence: React.FC<EvidenceProps> = ({ evidence }) => {
  const { entries, setEntries, currentVersion } = useCase();
  const { selectedTheme } = useHeaderContext();
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));

  let entryCodes: string[] = [];
  try {
    entryCodes = getEntryCodesForEvidence(entries, evidence);
  } catch {}

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newEntries = entries.map((entry) => {
      entry.evidences = entry.evidences.map((ev) => {
        if (ev.id === evidence.id) {
          ev.name = value;
        }
        return ev;
      });
      return entry;
    });
    setEntries(newEntries);
  };

  const removeEvidenceOverall = (id: string) => {
    const newEntries = entries.map((entry) => {
      entry.evidences = entry.evidences.filter(
        (evidence) => evidence.id !== id
      );
      return entry;
    });
    setEntries(newEntries);
  };

  return (
    <div className="flex flex-col gap-2 bg-offWhite rounded-lg mt-4 p-2 font-medium">
      {evidence.hasAttachment && (
        <span className="text-xs font-bold flex gap-1 mt-1 ml-1 self-start w-fit">
          Anlage {evidence.attachmentId}
        </span>
      )}
      {isInEditMode ? (
        <input
          autoFocus={true}
          type="text"
          name="name"
          placeholder="Beschreibung..."
          className="focus:outline focus:outline-offWhite focus:bg-offWhite px-2 m-0 border-b-[1px]"
          value={evidence.name}
          onBlur={() => setIsInEditMode(false)}
          onChange={handleNameChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsInEditMode(false);
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
              <ul className="absolute right-0 bottom-2 p-2 bg-white text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                <li
                  tabIndex={0}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsInEditMode(true);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                  <PencilSimple size={16} />
                  Bearbeiten
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
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie den Beweis <b>{evidence.name}</b> löschen
            möchten? Der Beweis wird aus allen Beiträgen gelöscht. Diese
            Aktion kann nicht rückgängig gemacht werden.
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
                removeEvidenceOverall(evidence.id);
              }}>
              Beweis löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </div>
  );
};
