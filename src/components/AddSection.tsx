import { Plus } from "phosphor-react";
import { v4 as uuidv4 } from "uuid";
import { useCase, useSection } from "../contexts";
import { IndividualEntrySortingEntry, ISection } from "../types";
import { Button } from "./Button";

interface AddSectionProps {
  sectionIdAfter?: string;
}

export const AddSection: React.FC<AddSectionProps> = ({ sectionIdAfter }) => {
  const { sectionList, setSectionList, setIndividualSorting } = useSection();
  const { entries, setEntries } = useCase();
  const { setIndividualEntrySorting } = useCase();
  const { currentVersion } = useCase();

  const handleClick = () => {
    const section: ISection = {
      id: uuidv4(),
      num: sectionList.length,
      version: currentVersion,
      titlePlaintiff: "",
      titleDefendant: "",
    };
    if (sectionIdAfter) {
      const indexSection = sectionList.findIndex(
        (sect) => sect.id === sectionIdAfter
      );
      setSectionList((prevSectionList) => [
        ...prevSectionList.slice(0, indexSection),
        section,
        ...prevSectionList.slice(indexSection),
      ]);

      const sectionIdsAfter = sectionList
        .slice(indexSection)
        .map((sect) => sect.id);

      setEntries(
        entries.map((entr) => {
          if (sectionIdsAfter.includes(entr.sectionId)) {
            const newNum =
              parseInt(entr.entryCode.match(/(?<=-)\d*(?=-)/)![0]) + 1;
            entr.entryCode = entr.entryCode.replace(
              /(?<=-)\d*(?=-)/,
              newNum.toString()
            );
          }
          return entr;
        })
      );
    } else {
      setSectionList((prev) => [...prev, section]);
      setIndividualSorting((prev) => [...prev, section.id]);
    }

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
