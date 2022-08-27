import { AddSection } from "./AddSection";
import { useCase, useHeaderContext, useSection } from "../contexts";
import { ISection, Sorting } from "../types";
import { AddEntryButtons } from "./AddEntryButtons";
import { EntryList } from "./entry";
import { SectionHeader } from "./section-header/SectionHeader";
import { getOriginalSortingPosition } from "../util/get-original-sorting-position";

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
        {getRequestedSorting(sectionList).map((section, index) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <div key={section.id}>
              <SectionHeader
                sectionId={getOriginalSortingPosition(sectionList, section.id)}
                section={section}
              />
              {sectionEntries === undefined ? (
                <AddEntryButtons />
              ) : (
                <div className="space-y-8">
                  <EntryList entries={sectionEntries?.parent || []} />
                </div>
              )}
            </div>
          );
        })}
        <AddSection />
      </div>
    </div>
  );
};
