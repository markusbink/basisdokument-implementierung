import { IEvidence, UserRole } from "../types";

export const enum FilterTypes {
  Attchment = 1,
  File = 2,
  AttachmentNoFile = 3,
  NoAttchment = 4,
}

// get evidence via id from evidencelist
export const getEvidenceById = (
  evidenceList: IEvidence[],
  evidenceId: string
): IEvidence | undefined => {
  return evidenceList.find((e) => e.id === evidenceId);
};

export const getEvidences = (
  evidenceList: IEvidence[],
  evidenceIds: string[]
): IEvidence[] => {
  let evs = evidenceList
    .filter((ev) => evidenceIds?.some((evidenceId) => evidenceId === ev.id))
    .flat(1)
    .filter((ev) => ev !== undefined);
  return Array.from(new Set(evs));
};

export const getFilteredEvidencesSuggestions = (
  evidenceList: IEvidence[],
  currentInput: string,
  addedEvidences: IEvidence[]
): IEvidence[] => {
  let evs = evidenceList
    //filters/excludes current to entry added evidences
    .filter((ev) => !addedEvidences.some((evidence) => evidence.id === ev.id))
    .filter((ev) => ev !== undefined);
  //filters current input for clarity in suggestions
  if (currentInput) {
    evs = evs.filter((att) => att.name.startsWith(currentInput));
  }
  return Array.from(new Set(evs));
};

export const getFilteredEvidences = (
  evidenceList: IEvidence[],
  filters: FilterTypes[],
  role?: UserRole
): IEvidence[] => {
  let resultingEvidences: IEvidence[] = [];
  if (filters.length <= 0) {
    resultingEvidences = evidenceList;
  } else {
    filters.forEach((filter) => {
      switch (filter) {
        case FilterTypes.Attchment:
          resultingEvidences = resultingEvidences.concat(
            evidenceList.filter((ev) => ev.hasAttachment)
          );
          break;
        case FilterTypes.File:
          resultingEvidences = resultingEvidences.concat(
            evidenceList.filter((ev) => ev.hasImageFile)
          );
          break;
        case FilterTypes.AttachmentNoFile:
          resultingEvidences = resultingEvidences.concat(
            evidenceList.filter((ev) => ev.hasAttachment && !ev.hasImageFile)
          );
          break;
        case FilterTypes.NoAttchment:
          resultingEvidences = resultingEvidences.concat(
            evidenceList.filter((ev) => !ev.hasAttachment)
          );
          break;
      }
    });
  }
  const uniqueEvs: IEvidence[] = resultingEvidences.filter(
    (ev, index) =>
      resultingEvidences.findIndex((evidence) => evidence.id === ev.id) ===
      index
  );
  if (role) {
    return uniqueEvs.filter((ev) => ev.role === role);
  } else {
    return Array.from(new Set(uniqueEvs));
  }
};

export const getEvidencesForRole = (
  evidenceList: IEvidence[],
  role: UserRole
): IEvidence[] => {
  let evs = evidenceList.filter((ev) => ev.role === role);
  const uniqueEvs: IEvidence[] = evs.filter(
    (ev, index) => evs.findIndex((evidence) => evidence.id === ev.id) === index
  );
  return Array.from(new Set(uniqueEvs));
};

export const getEvidenceIds = (evidences: IEvidence[]): string[] => {
  let evidenceIds = [];
  for (let i = 0; i < evidences.length; i++) {
    evidenceIds.push(evidences[i].id);
  }
  return evidenceIds;
};
