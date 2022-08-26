import { Button } from "./Button";
import { Plus } from "phosphor-react";
import { useCase, useSection } from "../contexts";
import { v4 as uuidv4 } from "uuid";
import { ISection } from "../types";

export const AddSection = () => {
  const { setSectionList } = useSection();
  const { currentVersion } = useCase();

  const handleClick = () => {
    const section: ISection = {
      id: uuidv4(),
      version: currentVersion,
      titlePlaintiff: "",
      titleDefendant: "",
    };
    setSectionList((prev) => [...prev, section]);
  };

  return (
    <div className="flex justify-end border-t-[1px] border-lightGrey pt-4 mt-8">
      <Button onClick={handleClick} size="md" icon={<Plus weight="bold" />}>
        Gliederungspunkt hinzufügen
      </Button>
    </div>
  );
};
