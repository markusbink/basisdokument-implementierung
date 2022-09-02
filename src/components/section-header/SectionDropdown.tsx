import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { DotsThree, Trash, CheckCircle, XCircle, Circle } from "phosphor-react";
import { useCase, useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";
import { Tooltip } from "../Tooltip";

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="py-1">
        <span>
          <Tooltip text="Mehr Optionen">
            <DotsThree
              size={20}
              weight="bold"
              className="rounded-md hover:bg-darkPurple hover:text-lightPurple"
            />
          </Tooltip>
        </span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className="bg-darkGrey rounded-lg shadow-lg z-50">
          {!isOld && (
            <DropdownMenu.Item onClick={() => deleteSection()}>
              <Button icon={<Trash size={18} />} size="sm">
                Gliederungspunkt löschen
              </Button>
            </DropdownMenu.Item>
          )}
          {user?.role === UserRole.Judge && (
            <>
              <DropdownMenu.Item onClick={() => resetLitigiousChecks()}>
                <Button icon={<Circle size={18} />} size="sm">
                  Alle Streitigkeitsmarkierungen zurücksetzen
                </Button>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setAllNotLitigious()}>
                <Button icon={<CheckCircle size={18} />} size="sm">
                  Alle Beiträge als unstreitig markieren
                </Button>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setAllLitigious()}>
                <Button icon={<XCircle size={18} />} size="sm">
                  Alle Beiträge als streitig markieren
                </Button>
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
