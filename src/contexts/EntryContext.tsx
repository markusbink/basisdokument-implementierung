import { createContext, useContext, useState } from "react";
import { IEntry } from "../types";

interface IEntryContext {
  displayAsColumn: boolean;
  setDisplayAsColumn: (displayAsColumn: boolean) => void;
  entries: IEntry[];
  groupedEntries: { [key: string]: { [key: string]: IEntry[] } };
  updateEntry: (entry: IEntry) => void;
}

export const EntryContext = createContext<IEntryContext | null>(null);

interface EntryProviderProps {
  children: React.ReactNode;
}

/**
 * Groups entries by their respectve entry and parent id.
 * @param entries The entries to group.
 * @returns Object containing the grouped entries.
 */
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
      text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
    },
    {
      id: "257550a4-13fa-11ed-861d-0242ac120002",
      version: 2,
      text: "Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
      author: "Michael Bauer",
      role: "Beklagter",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
    },
    {
      id: "3e8773e8-a1f8-4983-bbc8-3a53e024062e",
      version: 2,
      text: "tet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
      author: "Michael Bauer",
      role: "Beklagter",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
    },
    {
      id: "727f8829-aef3-4053-bbe8-a08444a79d15",
      version: 3,
      text: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "1f1f2fa4-13fa-11ed-861d-0242ac120002",
    },
    {
      id: "190d567e-3971-4122-b658-31ec8e07650f",
      version: 3,
      text: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.",
      author: "Stefan Schneider",
      role: "Kläger",
      section_id: "d990191e-13fc-11ed-861d-0242ac120002",
      associated_entry: "3e8773e8-a1f8-4983-bbc8-3a53e024062e",
    },
  ]);
  const [displayAsColumn, setDisplayAsColumn] = useState<boolean>(false);
  const groupedEntries = groupEntriesBySectionAndParent(entries);

  const updateEntry = (entry: IEntry) => {
    setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
  };

  return (
    <EntryContext.Provider
      value={{
        entries,
        groupedEntries,
        updateEntry,
        displayAsColumn,
        setDisplayAsColumn,
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
