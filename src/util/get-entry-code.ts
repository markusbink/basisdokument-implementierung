import { IEntry, IEvidence } from "../types";

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

export const getEntryCodesForEvidence = (
  entries: IEntry[],
  evidence: IEvidence
): string[] => {
  const entriesWithEvidenceReference = entries
    // prefilter entries with no evidences
    .filter((entry) => entry.evidences !== undefined)
    // filter entries with evidence
    .filter((entry) => entry.evidences.some((ev) => ev.id === evidence.id));
  // return entry codes
  return entriesWithEvidenceReference.map((entry) =>
    getEntryCode(entries, entry.id)
  );
};
