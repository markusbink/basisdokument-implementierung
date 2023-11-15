import { CaretDown, CaretRight, Funnel } from "phosphor-react";
import { useRef, useState } from "react";
import { useCase } from "../../contexts";
import { UserRole } from "../../types";
import { FilterTypes, getFilteredEvidences } from "../../util/get-evidences";
import { Evidence } from "./Evidence";
import { Button } from "../Button";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useEvidence } from "../../contexts/EvidenceContext";

export const SidebarEvidences = () => {
  const { evidenceFilters, setEvidenceFilters } = useCase();
  const { evidenceList } = useEvidence();
  const [plaintiffEvidencesOpen, setPlaintiffEvidencesOpen] =
    useState<boolean>(true);
  const [defendantEvidencesOpen, setDefendantEvidencesOpen] =
    useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuRef = useRef(null);
  useOutsideClick(menuRef, () => setIsMenuOpen(false));

  const addFilter = (filter: FilterTypes) => {
    setEvidenceFilters([...evidenceFilters, filter]);
  };

  const removeFilter = (filter: FilterTypes) => {
    const updatedFilters = evidenceFilters.filter((f) => f !== filter);
    setEvidenceFilters(updatedFilters);
  };

  const resetFilters = () => {
    setEvidenceFilters([]);
  };

  return (
    <div className="flex flex-col gap-3 flex-1 h-[calc(100vh_-_3.5rem)] overflow-auto">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Beweise</div>
        <div className="flex items-center gap-2">
          {evidenceFilters.length > 0 && (
            <div className="text-xs bg-lightGrey rounded-lg py-[1px] px-2 w-fit h-fit">
              Filter aktiv
            </div>
          )}
          <Button
            key="createNote"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
            }}
            bgColor="p-1 bg-darkGrey hover:bg-mediumGrey"
            size="sm"
            textColor="text-offWhite"
            hasText={false}
            alternativePadding="p-1"
            icon={
              <Funnel size={18} weight="bold" className="p-[1px]" />
            }></Button>
        </div>
        {isMenuOpen ? (
          <ul
            ref={menuRef}
            className="absolute right-4 top-20 p-2 bg-white text-darkGrey rounded-xl w-[220px] shadow-lg z-50 font-medium text-xs">
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={evidenceFilters.includes(FilterTypes.Attchment)}
                onChange={(e) => {
                  if (e.target.checked) addFilter(FilterTypes.Attchment);
                  else removeFilter(FilterTypes.Attchment);
                }}
              />
              Beweise mit Anlage
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={evidenceFilters.includes(FilterTypes.File)}
                onChange={(e) => {
                  if (e.target.checked) addFilter(FilterTypes.File);
                  else removeFilter(FilterTypes.File);
                }}
              />
              Beweise mit PDF/TIFF
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={evidenceFilters.includes(FilterTypes.AttachmentNoFile)}
                onChange={(e) => {
                  if (e.target.checked) addFilter(FilterTypes.AttachmentNoFile);
                  else removeFilter(FilterTypes.AttachmentNoFile);
                }}
              />
              Beweise mit externer Anlage
            </li>
            <li
              tabIndex={0}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-default">
              <input
                type="checkbox"
                className="accent-darkGrey cursor-pointer"
                checked={evidenceFilters.includes(FilterTypes.NoAttchment)}
                onChange={(e) => {
                  if (e.target.checked) addFilter(FilterTypes.NoAttchment);
                  else removeFilter(FilterTypes.NoAttchment);
                }}
              />
              Beweise ohne Anlage
            </li>
            <li
              tabIndex={0}
              className="flex justify-between gap-2 items-center">
              <button
                onClick={resetFilters}
                disabled={evidenceFilters.length <= 0}
                className="w-full p-2 rounded-lg text-center bg-darkGrey text-offWhite hover:bg-mediumGrey disabled:bg-lightGrey disabled:cursor-not-allowed cursor-pointer">
                Zurücksetzen
              </button>
            </li>
          </ul>
        ) : null}
      </div>

      {evidenceList.length <= 0 ? (
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
              (getFilteredEvidences(
                evidenceList,
                evidenceFilters,
                UserRole.Plaintiff
              ).length <= 0 ? (
                <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                  {evidenceFilters && evidenceFilters.length > 0
                    ? "Die Klagepartei hat noch keine Beweise hinzugefügt, die zu diesem Filter passen."
                    : "Die Klagepartei hat noch keine Beweise hinzugefügt."}
                </div>
              ) : (
                getFilteredEvidences(
                  evidenceList,
                  evidenceFilters,
                  UserRole.Plaintiff
                ).map((evidence) => (
                  <Evidence key={evidence.id} evidence={evidence} />
                ))
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
              (getFilteredEvidences(
                evidenceList,
                evidenceFilters,
                UserRole.Defendant
              ).length <= 0 ? (
                <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                  {evidenceFilters && evidenceFilters.length > 0
                    ? "Die Beklagtenpartei hat noch keine Beweise hinzugefügt, die zu diesem Filter passen."
                    : "Die Beklagtenpartei hat noch keine Beweise hinzugefügt."}
                </div>
              ) : (
                getFilteredEvidences(
                  evidenceList,
                  evidenceFilters,
                  UserRole.Defendant
                ).map((evidence) => (
                  <Evidence key={evidence.id} evidence={evidence} />
                ))
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
