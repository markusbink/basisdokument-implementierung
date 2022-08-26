import { useCase, useHeaderContext } from "../contexts";
import { EntryList } from "./entry";
import { SectionHeader } from "./section-header/SectionHeader";

export const Discussion = () => {
  const { groupedEntries } = useCase();
  const { sectionList } = useHeaderContext();

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4 scroll-smooth">
      <div className="max-w-[1200px] m-auto">
        {sectionList.map((section, index) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <div key={section.id}>
              <SectionHeader
                sectionId={index + 1}
                titlePlaintiff={section.titlePlaintiff}
                titleDefendant={section.titleDefendant}
              />
              <div className="space-y-8">
                <EntryList entries={sectionEntries?.parent || []} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
