import { IEntry } from "../types";

export const getEntryCode = (
  entries: IEntry[],
  entryId: string = ""
): string => {
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) {
    // TODO throw new Error(`Entry ${entryId} not found`);
    console.log("entry not found");
    return "no";
  }
  return entry.entryCode;
};
