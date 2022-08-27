import { Plus } from "phosphor-react";
import { useState } from "react";
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

  const handleClick = (roleForNewEntry: "Kläger" | "Beklagter") => {
    setNewEntryRole(roleForNewEntry);
    setIsNewEntryVisible(true);
  };

  return (
    <>
      {isNewEntryVisible ? (
        <NewEntry
          sectionId={sectionId}
          roleForNewEntry={newEntryRole}
          setIsNewEntryVisible={() => setIsNewEntryVisible(false)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-6 mb-8 items-start w-full">
          <span className="col-start-1">
            <Button
              onClick={() => handleClick(UserRole.Plaintiff)}
              icon={<Plus size={18} weight="bold" />}
            >
              Beitrag hinzufügen
            </Button>
          </span>
          <span className="col-start-2">
            <Button
              onClick={() => handleClick(UserRole.Defendant)}
              icon={<Plus size={18} weight="bold" />}
            >
              Beitrag hinzufügen
            </Button>
          </span>
        </div>
      )}
    </>
  );
};
