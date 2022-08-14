import { useEntries } from "../contexts/EntryContext";
import { EntryList } from "./entry/EntryList";

const mockSections: string[] = ["d990191e-13fc-11ed-861d-0242ac120002"];

export const Discussion = () => {
  const { groupedEntries, setDisplayAsColumn } = useEntries();

  return (
    <div className="bg-offWhite h-full overflow-y-scroll py-28 px-4 space-y-4">
      {/* Buttons to toggle displayAsColumn */}
      <div className="flex justify-between max-w-sm">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setDisplayAsColumn(false)}
        >
          Display as list
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setDisplayAsColumn(true)}
        >
          Display as column
        </button>
      </div>
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
