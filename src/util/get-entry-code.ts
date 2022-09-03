import { IEntry } from "../types";

export const getEntryCode = (
  entries: IEntry[],
  entryId: string = ""
): string => {
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) {
    throw new Error(`Entry ${entryId} not found`);
  }
  return entry.entryCode;
};
