import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { DotsThree, Trash, CheckCircle, XCircle, Circle } from "phosphor-react";
import { useCase, useHeaderContext, useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";
import { Tooltip } from "../Tooltip";
import { ErrorPopup } from "../ErrorPopup";
import { useState } from "react";
import { useEvidence } from "../../contexts/EvidenceContext";

interface SectionDropdownProps {
  sectionId: string;
  version: number;
}

export const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sectionId,
  version,
}) => {
  const { user } = useUser();
  const { currentVersion, setIndividualEntrySorting, entries, setEntries } =
    useCase();
  const { sectionList, setSectionList, setIndividualSorting } = useSection();
  const { showEntrySorting } = useHeaderContext();
  const { removeEvidencesWithoutReferences } = useEvidence();

  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);

  const isOld = version < currentVersion;

  const deleteSection = () => {
    // Remove entries that belong to the section
    let entriesToDelete = entries.filter(
      (entry) => entry.sectionId !== sectionId
    );
    removeEvidencesWithoutReferences(entriesToDelete);
    setEntries(entriesToDelete);

    const indexSection = sectionList.findIndex((sect) => sect.id === sectionId);

    // Remove the section
    setSectionList((prevSectionList) =>
      prevSectionList.filter((section) => section.id !== sectionId)
    );
    setIndividualSorting((prevIndividualSorting) =>
      prevIndividualSorting.filter((id) => id !== sectionId)
    );
    setIndividualEntrySorting((prevIndividualEntrySorting) => {
      const { [sectionId]: _, ...rest } = prevIndividualEntrySorting;
      return rest;
    });

    // Update entryCodes
    const sectionIdsAfter = sectionList
      .slice(indexSection)
      .map((sect) => sect.id);

    setEntries(
      entries.map((entr) => {
        if (sectionIdsAfter.includes(entr.sectionId)) {
          const newNum =
            parseInt(entr.entryCode.match(/(?<=-)\d*(?=-)/)![0]) - 1;
          entr.entryCode = entr.entryCode.replace(
            /(?<=-)\d*(?=-)/,
            newNum.toString()
          );
        }
        return entr;
      })
    );
  };

  const resetLitigiousChecks = () => {
    setIndividualEntrySorting((prevIndividualEntrySorting) => {
      const newSorting = { ...prevIndividualEntrySorting };

      Object.keys(newSorting).forEach((sectionId) => {
        newSorting[sectionId] = newSorting[sectionId].map((row) => ({
          ...row,
          isLitigious: undefined,
        }));
      });
      return newSorting;
    });
  };

  const setAllLitigious = () => {
    // If sectionEntriesIds are already in the litigiousChecks array, update them to be litigious.
    setIndividualEntrySorting((prevIndividualEntrySorting) => {
      const newSorting = { ...prevIndividualEntrySorting };

      Object.keys(newSorting).forEach((sortingSectionId) => {
        if (sortingSectionId === sectionId) {
          newSorting[sectionId] = newSorting[sectionId].map((row) => ({
            ...row,
            isLitigious: true,
          }));
        }
      });
      return newSorting;
    });
  };

  const setAllNotLitigious = () => {
    // If sectionEntriesIds are already in the litigiousChecks array, update them to be litigious.
    setIndividualEntrySorting((prevIndividualEntrySorting) => {
      const newSorting = { ...prevIndividualEntrySorting };

      Object.keys(newSorting).forEach((sortingSectionId) => {
        if (sortingSectionId === sectionId) {
          newSorting[sectionId] = newSorting[sectionId].map((row) => ({
            ...row,
            isLitigious: false,
          }));
        }
      });
      return newSorting;
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <span>
            <Tooltip asChild text="Mehr Optionen">
              <DotsThree
                size={20}
                weight="bold"
                className={`rounded-md hover:bg-darkGrey hover:text-lightGrey`}
              />
            </Tooltip>
          </span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            className="bg-darkGrey rounded-lg shadow-lg z-50">
            {!isOld && (
              <DropdownMenu.Item onClick={() => setIsDeleteErrorVisible(true)}>
                <Button icon={<Trash size={18} />} size="sm">
                  Gliederungspunkt löschen
                </Button>
              </DropdownMenu.Item>
            )}
            {user?.role === UserRole.Judge && showEntrySorting && (
              <>
                <DropdownMenu.Item onClick={() => resetLitigiousChecks()}>
                  <Button icon={<Circle size={18} />} size="sm">
                    Alle Streitigkeitsmarkierungen des Gliederungspunktes
                    zurücksetzen
                  </Button>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => setAllNotLitigious()}>
                  <Button icon={<CheckCircle size={18} />} size="sm">
                    Alle Beiträge des Gliederungspunktes als unstreitig
                    markieren
                  </Button>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => setAllLitigious()}>
                  <Button icon={<XCircle size={18} />} size="sm">
                    Alle Beiträge des Gliederungspunktes als streitig markieren
                  </Button>
                </DropdownMenu.Item>
              </>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie den gesamten Gliederungspunkt mit allen
            dazu aufgeführten Beiträgen löschen möchten? Diese Aktion kann nicht
            rückgängig gemacht werden.
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
                deleteSection();
              }}>
              Gliederungspunkt löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </>
  );
};
