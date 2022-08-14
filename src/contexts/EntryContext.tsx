import { createContext, useContext, useState } from "react";
import { IEntry } from "../types";

interface IEntryContext {
  entries: IEntry[];
  groupedEntries: { [key: string]: { [key: string]: IEntry[] } };
  updateEntry: (entry: IEntry) => void;
}

export const EntryContext = createContext<IEntryContext | null>(null);

interface EntryProviderProps {
  children: React.ReactNode;
}

// Function to create object to group entries by sectionid and then inside it by parentid

const groupEntriesBySectionAndParent = (entries: IEntry[]) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    acc[entry.section_id] ||= {};
    if (entry.associated_entry) {
      acc[entry.section_id][entry.associated_entry] ||= [];
      acc[entry.section_id][entry.associated_entry].push(entry);
    } else {
      acc[entry.section_id]["parent"] ||= [];
      acc[entry.section_id]["parent"].push(entry);
    }
    return acc;
  }, {} as { [key: string]: { [key: string]: IEntry[] } });
  return groupedEntries;
};

export const EntryProvider: React.FC<EntryProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<IEntry[]>([
    {
      id: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
      version: 1,
      text: "Entry from Version 1 | Original",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
    },
    {
      id: "257550a4-13fa-11ed-861d-0242ac120002",
      version: 2,
      text: "Entry from Version 2 | Replying to Entry from Version 1",
      author: "Michael Bauer",
      role: "Beklagter",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
    },
    {
      id: "3e8773e8-a1f8-4983-bbc8-3a53e024062e",
      version: 2,
      text: "Entry from Version 2 | Original",
      author: "Michael Bauer",
      role: "Beklagter",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
    },
    {
      id: "727f8829-aef3-4053-bbe8-a08444a79d15",
      version: 3,
      text: "Entry from Version 3 | Replying to Entry from Version 1",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
    },
    {
      id: "190d567e-3971-4122-b658-31ec8e07650f",
      version: 3,
      text: "Entry from Version 3 | Replying to Entry from Version 2",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "3e8773e8-a1f8-4983-bbc8-3a53e024062e",
    },
  ]);

  const groupedEntries = groupEntriesBySectionAndParent(entries);

  const updateEntry = (entry: IEntry) => {
    setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
  };

  // const groupEntriesBySectionId = (entries: IEntry[]) => {
  //   const entriesBySectionId: { [key: string]: IEntry[] } = {};
  //   entries.forEach((entry) => {
  //     entriesBySectionId[entry.section_id] ||= [];
  //     entriesBySectionId[entry.section_id].push(entry);
  //   });
  //   return entriesBySectionId;
  // };

  // const groupEntriesByParentId = (entries: IEntry[]) => {
  //   const entriesByParentId: { [key: string]: IEntry[] } = {};
  //   entries.forEach((entry) => {
  //     if (entry.associated_entry) {
  //       entriesByParentId[entry.associated_entry] ||= [];
  //       entriesByParentId[entry.associated_entry].push(entry);
  //     } else {
  //       entriesByParentId["parent"] ||= [];
  //       entriesByParentId["parent"].push(entry);
  //     }
  //   });
  //   return entriesByParentId;
  // };

  return (
    <EntryContext.Provider
      value={{
        entries,
        groupedEntries,
        updateEntry,
      }}
    >
      {children}
    </EntryContext.Provider>
  );
};

export const useEntries = () => {
  const context = useContext(EntryContext);
  if (context === null) {
    throw new Error("useEntries must be used within an EntryProvider");
  }
  return context;
};
