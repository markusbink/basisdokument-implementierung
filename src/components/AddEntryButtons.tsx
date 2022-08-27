import { Plus } from "phosphor-react";
import { useState } from "react";
import { Button } from "./Button";
import { NewEntry } from "./entry";

export const AddEntryButtons = () => {
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);
  const [newEntryRole, setNewEntryRole] = useState<"Kläger" | "Beklagter">(
    "Kläger"
  );

  const handleClick = (role: "Kläger" | "Beklagter") => {
    setNewEntryRole(role);
    setIsNewEntryVisible(true);
  };

  return (
    <>
      {isNewEntryVisible ? (
        <NewEntry
          parentRole={newEntryRole}
          setIsNewEntryVisible={() => setIsNewEntryVisible(false)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-6 mb-8 items-start w-full">
          <span className="col-start-1">
            <Button
              onClick={() => handleClick("Kläger")}
              icon={<Plus size={18} weight="bold" />}
            >
              Beitrag hinzufügen
            </Button>
          </span>
          <span className="col-start-2">
            <Button
              onClick={() => handleClick("Beklagter")}
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
