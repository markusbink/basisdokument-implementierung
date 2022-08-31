import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { DotsThree, Trash, CheckCircle, XCircle, Circle } from "phosphor-react";
import { useCase, useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";

interface SectionDropdownProps {
  sectionId: string;
  version: number;
}

export const SectionDropdown: React.FC<SectionDropdownProps> = ({
  sectionId,
  version,
}) => {
  const { user } = useUser();
  const { currentVersion } = useCase();
  const { setSectionList } = useSection();
  const isOld = version < currentVersion;

  const deleteSection = () => {
    setSectionList((prevSectionList) =>
      prevSectionList.filter((section) => section.id !== sectionId)
    );
  };

  const resetLitigiousChecks = () => {
    console.log("resetLitigiousChecks");
  };

  const setAllLitigious = () => {
    console.log("setAllLitigious");
  };

  const setAllNotLitigious = () => {
    console.log("setAllNotLitigious");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="py-1">
        <span>
          <DotsThree size={18} weight="bold" />
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
