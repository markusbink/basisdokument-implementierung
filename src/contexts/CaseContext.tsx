import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IEntry,
  IHighlightedEntry,
  IMetaData,
  IIntroduction,
  IndividualEntrySortingEntry,
  UserRole,
} from "../types";
import { useSection } from "./SectionContext";
import { v4 as uuidv4 } from "uuid";
interface ICaseContext {
  fileId: string;
  setFileId: Dispatch<SetStateAction<string>>;
  caseId: string;
  setCaseId: Dispatch<SetStateAction<string>>;
  metaData: IMetaData;
  setMetaData: Dispatch<SetStateAction<IMetaData>>;
  introduction: IIntroduction;
  setIntroduction: Dispatch<SetStateAction<IMetaData>>;
  entries: IEntry[];
  setEntries: Dispatch<SetStateAction<IEntry[]>>;
  groupedEntries: { [key: string]: { [key: string]: IEntry[] } };
  updateEntry: (entry: IEntry) => void;
  highlightedEntries: IHighlightedEntry[];
  setHighlightedEntries: Dispatch<SetStateAction<IHighlightedEntry[]>>;
  currentVersion: number;
  setCurrentVersion: Dispatch<SetStateAction<number>>;
  individualEntrySorting: { [key: string]: IndividualEntrySortingEntry[] };
  setIndividualEntrySorting: Dispatch<
    SetStateAction<{ [key: string]: IndividualEntrySortingEntry[] }>
  >;
}

export const CaseContext = createContext<ICaseContext | null>(null);

interface CaseProviderProps {
  children: React.ReactNode;
}

/**
 * Groups entries by their respectve entry and parent id.
 * @param entries The entries to group.
 * @returns Object containing the grouped entries.
 */
export const groupEntriesBySectionAndParent = (entries: IEntry[]) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    acc[entry.sectionId] ||= {};
    if (entry.associatedEntry) {
      acc[entry.sectionId][entry.associatedEntry] ||= [];
      acc[entry.sectionId][entry.associatedEntry].push(entry);
    } else {
      acc[entry.sectionId]["parent"] ||= [];
      acc[entry.sectionId]["parent"].push(entry);
    }
    return acc;
  }, {} as { [key: string]: { [key: string]: IEntry[] } });
  return groupedEntries;
};

export const getEntryById = (entries: IEntry[], id: string) => {
  return entries.find((entry) => entry.id === id);
};

export const CaseProvider: React.FC<CaseProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<IEntry[]>([]);
  const [fileId, setFileId] = useState<string>("");
  const [caseId, setCaseId] = useState<string>("");
  const [metaData, setMetaData] = useState<IMetaData>({
    plaintiff: "",
    defendant: "",
  });
  const [introduction, setIntroduction] = useState<IIntroduction>({
    plaintiff: "",
    defendant: "",
  });
  const [highlightedEntries, setHighlightedEntries] = useState<
    IHighlightedEntry[]
  >([]);
  const [groupedEntries, setGroupedEntries] = useState<{
    [key: string]: {
      [key: string]: IEntry[];
    };
  }>({});
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  const [individualEntrySorting, setIndividualEntrySorting] = useState<{
    [key: string]: IndividualEntrySortingEntry[];
  }>({});
  const { sectionList } = useSection();

  useEffect(() => {
    if (
      Object.keys(individualEntrySorting).length === 0 &&
      entries.length > 0
    ) {
      // set the initial sorting based on the entries
      const initialSorting = entries.reduce((acc, entry) => {
        // if the accumulator array already contains a section with the sectionId, add the entryId to the respective column
        // else create a new entry with the sectionId and add the entryId to the respective column
        acc[entry.sectionId] ||= [];

        const entrySorting: IndividualEntrySortingEntry = {
          rowId: uuidv4(),
          columns: [[], []],
        };

        if (entry.role === UserRole.Plaintiff) {
          entrySorting.columns[0].push(entry.id);
        } else {
          entrySorting.columns[1].push(entry.id);
        }

        acc[entry.sectionId].push(entrySorting);

        return acc;
      }, {} as { [key: string]: IndividualEntrySortingEntry[] });

      setIndividualEntrySorting(initialSorting);
    } else if (
      Object.keys(individualEntrySorting).length > 0 &&
      entries.length > 0
    ) {
      // 1. Get all entryIds that are in the sorting
      const entryIdsInSorting = getEntryIdsInSorting(individualEntrySorting);

      // 2. Check for each entry if it is in the entryIdsInSorting array
      const newEntries = entries.filter(
        (entry) => !entryIdsInSorting.includes(entry.id)
      );

      // 3. Check if there are entryIds in the sorting that are not in the entries array
      const entryIdsInEntries = entries.map((entry) => entry.id);
      const entriesToRemove = getEntriesToRemove(
        individualEntrySorting,
        entryIdsInEntries
      );

      if (newEntries.length === 0 && entriesToRemove.length === 0) {
        return;
      }

      let newIndividualEntrySorting: {
          [key: string]: IndividualEntrySortingEntry[];
        },
        newSorting: { [key: string]: IndividualEntrySortingEntry[] };

      // Remove the entries that are not in the entries array
      if (entriesToRemove.length > 0) {
        newIndividualEntrySorting = removeEntryIdsFromSorting(
          individualEntrySorting,
          entriesToRemove
        );
      }

      // Add new entries to the existing sorting array
      if (newEntries.length > 0) {
        newSorting = addEntryIdsToSorting(newEntries);
      }

      setIndividualEntrySorting((prev) => ({
        ...prev,
        ...newIndividualEntrySorting,
        ...newSorting,
      }));
    }
  }, [entries, individualEntrySorting]);

  useEffect(() => {
    setGroupedEntries(groupEntriesBySectionAndParent(entries));
  }, [entries, sectionList]);

  const updateEntry = (entry: IEntry) => {
    setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
  };

  return (
    <CaseContext.Provider
      value={{
        fileId,
        setFileId,
        caseId,
        setCaseId,
        currentVersion,
        setCurrentVersion,
        metaData,
        setMetaData,
        introduction,
        setIntroduction,
        entries,
        setEntries,
        groupedEntries,
        updateEntry,
        highlightedEntries,
        setHighlightedEntries,
        individualEntrySorting,
        setIndividualEntrySorting,
      }}>
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (context === null) {
    throw new Error("useCase must be used within an CaseProvider");
  }
  return context;
};

/**
 * Retrieves all entryIds that are in the sorting.
 * @param individualEntrySorting The sorting object.
 * @returns Array containing all entryIds.
 */
function getEntryIdsInSorting(individualEntrySorting: {
  [key: string]: IndividualEntrySortingEntry[];
}): string[] {
  return Object.values(individualEntrySorting).reduce((acc, sectionEntries) => {
    sectionEntries.forEach((entry) => {
      entry.columns.forEach((column) => {
        column.forEach((entryId) => {
          acc.push(entryId);
        });

        return acc;
      });
    });

    return acc;
  }, [] as string[]);
}

/**
 * Retrieves all entryIds that are in the sorting but not in the entries array.
 * @param individualEntrySorting The sorting object.
 * @param entryIdsInEntries Array containing all entryIds that are in the entries array.
 * @returns Array containing all entryIds that are in the sorting but not in the entries array.
 */
function getEntriesToRemove(
  individualEntrySorting: {
    [key: string]: IndividualEntrySortingEntry[];
  },
  entryIdsInEntries: string[]
): string[] {
  return Object.values(individualEntrySorting).reduce((acc, sectionEntries) => {
    sectionEntries.forEach((entry) => {
      entry.columns.forEach((column) => {
        column.forEach((entryId) => {
          if (!entryIdsInEntries.includes(entryId)) {
            acc.push(entryId);
          }
        });

        return acc;
      });
    });

    return acc;
  }, [] as string[]);
}

/**
 * Returns a new sorting object without the entryIds that are in the entriesToRemove array.
 * @param individualEntrySorting The sorting object.
 * @param entriesToRemove Array containing all entryIds that should be removed from the sorting.
 * @returns New sorting object without the entryIds that are in the entriesToRemove array.
 */
function removeEntryIdsFromSorting(
  individualEntrySorting: {
    [key: string]: IndividualEntrySortingEntry[];
  },
  entriesToRemove: string[]
) {
  return Object.entries(individualEntrySorting).reduce(
    (acc, [sectionId, sectionEntries]) => {
      acc[sectionId] = sectionEntries.map((entry) => {
        const newEntry = { ...entry };
        newEntry.columns = newEntry.columns.map((column) => {
          return column.filter((entryId) => !entriesToRemove.includes(entryId));
        });

        return newEntry;
      });

      return acc;
    },
    {} as { [key: string]: IndividualEntrySortingEntry[] }
  );
}

/**
 * Creates a new sorting object for the new entries.
 * @param newEntries Array containing all new entries.
 * @returns New sorting object for the new entries.
 */
function addEntryIdsToSorting(newEntries: IEntry[]) {
  return newEntries.reduce((acc, entry) => {
    // if the accumulator array already contains a section with the sectionId, add the entryId to the respective column
    // else create a new entry with the sectionId and add the entryId to the respective column
    acc[entry.sectionId] ||= [];

    const entrySorting: IndividualEntrySortingEntry = {
      rowId: uuidv4(),
      columns: [[], []],
    };

    const columnIndex = entry.role === UserRole.Plaintiff ? 0 : 1;
    entrySorting.columns[columnIndex].push(entry.id);

    acc[entry.sectionId].push(entrySorting);

    return acc;
  }, {} as { [key: string]: IndividualEntrySortingEntry[] });
}
