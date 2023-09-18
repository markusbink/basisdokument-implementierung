import { CaretDown, CaretRight, Funnel } from "phosphor-react";
import { useState } from "react";
import { useCase } from "../../contexts";
import { UserRole } from "../../types";
import { getEvidences, getEvidencesForRole } from "../../util/get-evidences";
import { Evidence } from "./Evidence";
import { Button } from "../Button";

export const SidebarEvidences = () => {
  const [plaintiffEvidencesOpen, setPlaintiffEvidencesOpen] =
    useState<boolean>(true);
  const [defendantEvidencesOpen, setDefendantEvidencesOpen] =
    useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [filterAttachment, setFilterAttachment] = useState<boolean>(false);
  const [filterFile, setFilterFile] = useState<boolean>(false);
  const [filterNoFileAttachment, setFilterNoFileAttachment] =
    useState<boolean>(false);
  const [filterNoAttachment, setFilterNoAttachment] = useState<boolean>(false);
  const { entries } = useCase();

  const filter = () => {
    console.log("filter entries");
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 flex-1 h-[calc(100vh_-_3.5rem)] overflow-auto">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Beweise</div>
        <Button
          key="createNote"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          bgColor="bg-darkGrey hover:bg-mediumGrey"
          size="sm"
          textColor="text-white"
          hasText={false}
          alternativePadding="p-1"
          icon={
            <Funnel size={18} weight="bold" className="p-[1px]" />
          }></Button>
        {isMenuOpen ? (
          <ul className="absolute right-4 top-20 p-2 bg-white text-darkGrey rounded-xl w-[220px] shadow-lg z-50 font-medium text-xs">
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={filterAttachment}
                onChange={(e) => setFilterAttachment(e.target.checked)}
              />
              Beweise mit Anlage
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={filterFile}
                onChange={(e) => setFilterFile(e.target.checked)}
              />
              Beweise mit Bild/PDF
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={filterNoFileAttachment}
                onChange={(e) => setFilterNoFileAttachment(e.target.checked)}
              />
              Beweise mit externer Anlage
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={filterNoAttachment}
                onChange={(e) => setFilterNoAttachment(e.target.checked)}
              />
              Beweise ohne Anlage
            </li>
            <li
              tabIndex={0}
              className="flex justify-between gap-2 items-center">
              <button
                onClick={() => {
                  setFilterAttachment(false);
                  setFilterFile(false);
                  setFilterNoFileAttachment(false);
                  setFilterNoAttachment(false);
                }}
                disabled={
                  !filterAttachment &&
                  !filterFile &&
                  !filterNoFileAttachment &&
                  !filterNoAttachment
                }
                className="w-full p-2 rounded-lg text-center bg-darkGrey text-offWhite hover:bg-mediumGrey disabled:bg-lightGrey disabled:cursor-not-allowed cursor-pointer">
                Zurücksetzen
              </button>
              <button
                className="w-full p-2 rounded-lg text-center bg-darkGrey text-offWhite hover:bg-mediumGrey cursor-pointer"
                onClick={filter}>
                Anwenden
              </button>
            </li>
          </ul>
        ) : null}
      </div>
      {getEvidences(entries, "", [], undefined).length <= 0 ? (
        <div className="mt-7 text-darkGrey opacity-40 text-center text-sm p-4">
          In einem Beitrag können Sie Beweise mit oder ohne Anlage hinzufügen.
          Alle Beweise des Basisdokuments erscheinen dann in dieser Ansicht.
        </div>
      ) : (
        <div className="flex flex-col p-4 text-mediumGrey font-extrabold text-sm h-fit">
          <div
            className="cursor-pointer flex items-center"
            onClick={() => setPlaintiffEvidencesOpen(!plaintiffEvidencesOpen)}>
            {plaintiffEvidencesOpen ? (
              <CaretDown size={14} className="inline mr-1" weight="bold" />
            ) : (
              <CaretRight size={14} className="inline mr-1" weight="bold" />
            )}
            ERSTELLT VON KLAGEPARTEI
          </div>
          <div>
            {plaintiffEvidencesOpen &&
              (getEvidencesForRole(entries, UserRole.Plaintiff).length <= 0 ? (
                <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                  Die Klagepartei hat noch keine Beweise hinzugefügt.
                </div>
              ) : (
                getEvidencesForRole(entries, UserRole.Plaintiff).map(
                  (evidence) => (
                    <Evidence key={evidence.id} evidence={evidence} />
                  )
                )
              ))}
          </div>
          <div
            className="cursor-pointer flex items-center mt-7"
            onClick={() => setDefendantEvidencesOpen(!defendantEvidencesOpen)}>
            {defendantEvidencesOpen ? (
              <CaretDown size={14} className="inline mr-1" weight="bold" />
            ) : (
              <CaretRight size={14} className="inline mr-1" weight="bold" />
            )}
            ERSTELLT VON BEKLAGTENPARTEI
          </div>
          <div>
            {defendantEvidencesOpen &&
              (getEvidencesForRole(entries, UserRole.Defendant).length <= 0 ? (
                <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                  Die Beklagtenpartei hat noch keine Beweise hinzugefügt.
                </div>
              ) : (
                getEvidencesForRole(entries, UserRole.Defendant).map(
                  (evidence) => (
                    <Evidence key={evidence.id} evidence={evidence} />
                  )
                )
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
