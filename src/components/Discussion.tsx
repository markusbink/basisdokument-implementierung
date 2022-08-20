import { useEntries } from "../contexts";
import { EntryList } from "./entry";

const mockSections: string[] = ["d990191e-13fc-11ed-861d-0242ac120002"];

export const Discussion = () => {
  const { groupedEntries, displayAsColumn, setDisplayAsColumn } = useEntries();

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4">
      <div className="max-w-[1200px] m-auto">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none mb-4">
          <input
            id="default-checkbox"
            type="checkbox"
            value=""
            onChange={() => setDisplayAsColumn(!displayAsColumn)}
            className="w-4 h-4 "
          />
          View as Thread?
        </label>
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
