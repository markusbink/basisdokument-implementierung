import { CaretDown, CaretRight } from "phosphor-react";
import { useState } from "react";
import { useCase } from "../../contexts";
import { UserRole } from "../../types";
import { getEvidences, getEvidencesForRole } from "../../util/get-evidences";
import { Evidence } from "./Evidence";

export const SidebarEvidences = () => {
  const [plaintiffEvidencesOpen, setPlaintiffEvidencesOpen] =
    useState<boolean>(true);
  const [defendantEvidencesOpen, setDefendantEvidencesOpen] =
    useState<boolean>(true);
  const { entries } = useCase();

  return (
    <div className="flex flex-col gap-3 flex-1 h-[calc(100vh_-_3.5rem)] overflow-auto">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Beweise</div>
      </div>
      {getEvidences(entries, "", []).length <= 0 ? (
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
            {getEvidencesForRole(entries, UserRole.Plaintiff).length <= 0 &&
            plaintiffEvidencesOpen ? (
              <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                Die Klagepartei hat noch keine Beweise hinzugefügt.
              </div>
            ) : (
              getEvidencesForRole(entries, UserRole.Plaintiff).map(
                (evidence) => <Evidence key={evidence.id} evidence={evidence} />
              )
            )}
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
            {getEvidencesForRole(entries, UserRole.Defendant).length <= 0 &&
            defendantEvidencesOpen ? (
              <div className="text-darkGrey opacity-40 text-center text-sm p-4">
                Die Beklagtenpartei hat noch keine Beweise hinzugefügt.
              </div>
            ) : (
              getEvidencesForRole(entries, UserRole.Defendant).map(
                (evidence) => <Evidence key={evidence.id} evidence={evidence} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
