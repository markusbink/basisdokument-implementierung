import { IEvidence, IEntry, UserRole } from "../types";

export const getEvidences = (
  entries: IEntry[],
  currentInput: string,
  addedEvidences: IEvidence[],
  currentEntryId: string | undefined
): IEvidence[] => {
  let evs = entries
    .filter((entry) => entry.id !== currentEntryId)
    .map((entry) => entry.evidences)
    .flat(1)
    .filter((ev) => ev !== undefined);
  if (currentInput) {
    evs = evs.filter((att) => att.name.startsWith(currentInput));
  }
  evs = evs.filter((att) => !addedEvidences.includes(att));
  return Array.from(new Set(evs));
};

export const getEvidencesForRole = (
  entries: IEntry[],
  role: UserRole
): IEvidence[] => {
  let evs = entries
    .map((entry) => entry.evidences)
    .flat(1)
    .filter((ev) => ev !== undefined);
  evs = evs.filter((ev) => ev.role === role);
  return Array.from(new Set(evs));
};
