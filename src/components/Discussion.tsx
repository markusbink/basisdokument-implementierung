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
  const {
    selectedSorting,
    selectedVersion,
    versionHistory,
    highlightElementsWithSpecificVersion,
  } = useHeaderContext();

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
        {highlightElementsWithSpecificVersion ? (
          <div className="flex justify-center items-center">
            <div className="flex flex-row items-center justify-center gap-4 bg-blue-600 text-white p-4 rounded-md">
              <div>
                <div className="w-6 h-6 border-blue-200 border-2 rounded-full"></div>
              </div>
              <span>
                Beiträge, die in{" "}
                <b>
                  Version {selectedVersion + 1} (
                  {versionHistory[selectedVersion].author})
                </b>{" "}
                hinzugefügt wurden, werden mit einem blauen Rahmen hervorgehoben
              </span>
            </div>
          </div>
        ) : null}
        {getRequestedSorting(sectionList).map((section, index) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <div key={section.id}>
              <SectionHeader
                sectionId={getOriginalSortingPosition(sectionList, section.id)}
                section={section}
                position={index}
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
