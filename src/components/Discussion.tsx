import { useCase, useHeaderContext, useSection } from "../contexts";
import { ISection, Sorting, UserRole } from "../types";
import { getOriginalSortingPosition } from "../util/get-original-sorting-position";
import { AddEntryButtons } from "./AddEntryButtons";
import { AddSection } from "./AddSection";
import { EntryList } from "./entry";
import { MetaData } from "./metadata/MetaData";
import { SectionHeader } from "./section-header/SectionHeader";

export const Discussion = () => {
  const { groupedEntries } = useCase();
  const { sectionList, individualSorting } = useSection();
  const { selectedSorting } = useHeaderContext();

  const getRequestedSorting = (sectionList: ISection[]) => {
    if (selectedSorting === Sorting.Privat) {
      let privateSorting: ISection[] = [];
      individualSorting.forEach((id: string) => {
        let section: any = sectionList.find((section) => section.id === id);
        privateSorting.push(section);
      });
      return privateSorting;
    } else {
      return sectionList;
    }
  };

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4 scroll-smooth">
      <div className="max-w-[1200px] m-auto">
        <div className="grid grid-cols-2 gap-6 mb-16">
          <MetaData owner={UserRole.Plaintiff} />
          <MetaData owner={UserRole.Defendant} />
        </div>
        {getRequestedSorting(sectionList).map((section) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <div key={section.id}>
              <SectionHeader
                sectionId={getOriginalSortingPosition(sectionList, section.id)}
                section={section}
              />
              <div className="space-y-4">
                <EntryList entries={sectionEntries?.parent || []} />
                <AddEntryButtons sectionId={section.id} />
              </div>
            </div>
          );
        })}
        <AddSection />
      </div>
    </div>
  );
};
