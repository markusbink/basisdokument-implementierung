import { Plus } from "phosphor-react";
import { useState } from "react";
import { useUser } from "../contexts";
import { UserRole } from "../types";
import { Button } from "./Button";
import { NewEntry } from "./entry";

interface AddEntryButtonsProps {
  sectionId: string;
}

export const AddEntryButtons: React.FC<AddEntryButtonsProps> = ({
  sectionId,
}) => {
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);
  const [newEntryRole, setNewEntryRole] = useState<"Kläger" | "Beklagter">(
    "Kläger"
  );
  const { user } = useUser();

  const handleClick = (roleForNewEntry: "Kläger" | "Beklagter") => {
    setNewEntryRole(roleForNewEntry);
    setIsNewEntryVisible(true);
  };

  return (
    <div className="space-y-4">
      {isNewEntryVisible && (
        <NewEntry
          sectionId={sectionId}
          roleForNewEntry={newEntryRole}
          setIsNewEntryVisible={() => setIsNewEntryVisible(false)}
        />
      )}
      <div className="grid grid-cols-2 gap-6 mb-8 items-start w-full">
        <div>
          {(user?.role === UserRole.Plaintiff ||
            user?.role === UserRole.Judge) && (
            <Button
              size="sm"
              onClick={() => handleClick(UserRole.Plaintiff)}
              icon={<Plus size={18} weight="bold" />}
            >
              Beitrag hinzufügen
            </Button>
          )}
        </div>
        <div>
          {(user?.role === UserRole.Defendant ||
            user?.role === UserRole.Judge) && (
            <Button
              size="sm"
              onClick={() => handleClick(UserRole.Defendant)}
              icon={<Plus size={18} weight="bold" />}
            >
              Beitrag hinzufügen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
