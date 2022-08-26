import { useCase, useHeaderContext, useSection, useUser } from "../contexts";
import { ISection, Sorting, UserRole } from "../types";
import { EntryList } from "./entry";

export const Discussion = () => {
  const { groupedEntries } = useCase();
  const { sectionList, individualSorting } = useSection();
  const { selectedSorting } = useHeaderContext();
  const { user } = useUser();

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
        {getRequestedSorting(sectionList).map((section) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <section key={section.id} className="space-y-8">
              <div className="text-xl font-bold">{user?.role === UserRole.Plaintiff ? section.titlePlaintiff : section.titleDefendant}</div>
              <div className="space-y-8">
                <EntryList entries={sectionEntries?.parent || []} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
