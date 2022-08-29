import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../Button";
import { DotsThree, Trash, CheckCircle, XCircle, Circle } from "phosphor-react";
import { useUser } from "../../contexts";
import { UserRole } from "../../types";

export const SectionDropdown = () => {
  const { user } = useUser();

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
          className="bg-darkGrey rounded-lg shadow-lg z-50"
        >
          <DropdownMenu.Item>
            <Button icon={<Trash size={18} />} size="sm">
              Gliederungspunkt löschen
            </Button>
          </DropdownMenu.Item>
          {user?.role === UserRole.Judge && (
            <>
              <DropdownMenu.Item>
                <Button icon={<Circle size={18} />} size="sm">
                  Alle Streitigkeitsmarkierungen zurücksetzen
                </Button>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <Button icon={<CheckCircle size={18} />} size="sm">
                  Alle Beiträge als unstreitig markieren
                </Button>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
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
