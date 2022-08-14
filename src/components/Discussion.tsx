import { useEntries } from "../contexts";
import { EntryList } from "./entry";

const mockSections: string[] = ["d990191e-13fc-11ed-861d-0242ac120002"];

export const Discussion = () => {
  const { groupedEntries } = useEntries();

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4">
      <div className="max-w-[1200px] m-auto">
        {mockSections.map((sectionId) => {
          const sectionEntries = groupedEntries[sectionId];
          return (
            <section key={sectionId} className="space-y-8">
              <div className="text-xl font-bold">
                <span>1.</span> Gliederungspunkt
              </div>
              <div className="space-y-8">
                <EntryList entries={sectionEntries["parent"]} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
