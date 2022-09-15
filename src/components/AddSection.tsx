import { Plus } from "phosphor-react";
import { v4 as uuidv4 } from "uuid";
import { useCase, useSection } from "../contexts";
import { IndividualEntrySortingEntry, ISection } from "../types";
import { Button } from "./Button";

export const AddSection = () => {
  const { setSectionList, setIndividualSorting } = useSection();
  const { setIndividualEntrySorting } = useCase();
  const { currentVersion } = useCase();

  const handleClick = () => {
    const section: ISection = {
      id: uuidv4(),
      version: currentVersion,
      titlePlaintiff: "",
      titleDefendant: "",
    };
    setSectionList((prev) => [...prev, section]);
    setIndividualSorting((prev) => [...prev, section.id]);

    const newIndividualEntrySorting: IndividualEntrySortingEntry = {
      columns: [[], []],
      rowId: uuidv4(),
    };

    setIndividualEntrySorting((prev) => ({
      ...prev,
      ...{ [section.id]: [newIndividualEntrySorting] },
    }));
  };

  return (
    <div className="flex justify-end border-t-[1px] border-lightGrey pt-4 mt-8">
      <Button
        bgColor="bg-darkGrey hover:bg-darkGrey/60"
        textColor="text-white"
        onClick={handleClick}
        size="md"
        icon={<Plus weight="bold" />}>
        Gliederungspunkt hinzufügen
      </Button>
    </div>
  );
};
