import { useEntries, useHeaderContext } from "../contexts";
import { useUser } from "../contexts/UserContext";
import { UserRole } from "../types";
import { EntryList } from "./entry";

export const Discussion = () => {
  const { groupedEntries } = useEntries();
  const { sectionList } = useHeaderContext();
  const { user } = useUser();

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4 scroll-smooth">
      <div className="max-w-[1200px] m-auto">
        {sectionList.map((section) => {
          const sectionEntries = groupedEntries[section.id];
          return (
            <section key={section.id} className="space-y-8">
              <div className="text-xl font-bold">
                {user?.role === UserRole.Plaintiff
                  ? section.titlePlaintiff
                  : section.titleDefendant}
              </div>
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
