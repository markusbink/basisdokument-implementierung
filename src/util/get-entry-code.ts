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
  let entriesWithEvidenceReference = entries.filter((entry) => entry.evidences.indexOf(evidence) !== -1);
  return entriesWithEvidenceReference.map((entry) => getEntryCode(entries, entry.id));
}
