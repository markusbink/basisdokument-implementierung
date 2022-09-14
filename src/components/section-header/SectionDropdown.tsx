import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { DotsThree, Trash, CheckCircle, XCircle, Circle } from "phosphor-react";
import { useCase, useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";
import { Tooltip } from "../Tooltip";
import { ErrorPopup } from "../ErrorPopup";
import { useState } from "react";

interface SectionDropdownProps {
  sectionId: string;
  version: number;
}

export const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sectionId,
  version,
}) => {
  const { user } = useUser();
  const { entries, currentVersion, setLitigiousChecks } = useCase();
  const { setSectionList } = useSection();
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);

  const isOld = version < currentVersion;
  const sectionEntries = entries.filter(
    (entry) => entry.sectionId === sectionId
  );
  const sectionEntriesIds = sectionEntries.map((entry) => entry.id);

  const deleteSection = () => {
    setSectionList((prevSectionList) =>
      prevSectionList.filter((section) => section.id !== sectionId)
    );
  };

  const resetLitigiousChecks = () => {
    setLitigiousChecks((prevLitigiousChecks) =>
      prevLitigiousChecks.filter(
        (litigiousCheck) => !sectionEntriesIds.includes(litigiousCheck.entryId)
      )
    );
  };

  const setAllLitigious = () => {
    // If sectionEntriesIds are already in the litigiousChecks array, update them to be litigious.
    setLitigiousChecks((prevLitigiousChecks) => {
      const newLitigiousChecks = [...prevLitigiousChecks];
      sectionEntriesIds.forEach((entryId) => {
        const litigiousCheck = newLitigiousChecks.find(
          (litigiousCheck) => litigiousCheck.entryId === entryId
        );
        if (litigiousCheck) {
          litigiousCheck.isLitigious = true;
        } else {
          newLitigiousChecks.push({
            entryId,
            isLitigious: true,
          });
        }
      });
      return newLitigiousChecks;
    });
  };

  const setAllNotLitigious = () => {
    // If sectionEntriesIds are already in the litigiousChecks array, update them to be litigious.
    setLitigiousChecks((prevLitigiousChecks) => {
      const newLitigiousChecks = [...prevLitigiousChecks];
      sectionEntriesIds.forEach((entryId) => {
        const litigiousCheck = newLitigiousChecks.find(
          (litigiousCheck) => litigiousCheck.entryId === entryId
        );
        if (litigiousCheck) {
          litigiousCheck.isLitigious = false;
        } else {
          newLitigiousChecks.push({
            entryId,
            isLitigious: false,
          });
        }
      });
      return newLitigiousChecks;
    });
  };

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="py-1">
          <span>
            <Tooltip text="Mehr Optionen">
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
            {user?.role === UserRole.Judge && (
              <>
                <DropdownMenu.Item onClick={() => resetLitigiousChecks()}>
                  <Button icon={<Circle size={18} />} size="sm">
                    Alle Streitigkeitsmarkierungen des Gliederungspunktes
                  zurücksetzen
                  </Button>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => setAllNotLitigious()}>
                  <Button icon={<CheckCircle size={18} />} size="sm">
                    Alle Beiträge des Gliederungspunktes als unstreitig markieren
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
