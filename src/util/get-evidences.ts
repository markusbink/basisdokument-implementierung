import { IEvidence, IEntry } from "../types";

export const enum FilterTypes {
  Attchment = 1,
  File = 2,
  AttachmentNoFile = 3,
  NoAttchment = 4
}

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


export const getFilteredEvidences = (
  entries: IEntry[],
  filters: FilterTypes[],
): IEvidence[] => {
  let evs = entries
    .map((entry) => entry.evidences)
    .flat(1)
    .filter((ev) => ev !== undefined);
  let resultingEvidences: IEvidence[] = [];
  if (filters.length <= 0) {
    resultingEvidences = evs;
  } else {
    filters.forEach(filter => {
      switch (filter) {
        case FilterTypes.Attchment:
          resultingEvidences = resultingEvidences.concat(evs.filter((ev) => ev.hasAttachment));
          break;
        case FilterTypes.File:
          resultingEvidences = resultingEvidences.concat(evs.filter((ev) => ev.hasImageFile));
          break;
        case FilterTypes.AttachmentNoFile:
          resultingEvidences = resultingEvidences.concat(evs.filter((ev) => ev.hasAttachment && !ev.hasImageFile));
          break;
        case FilterTypes.NoAttchment:
          resultingEvidences = resultingEvidences.concat(evs.filter((ev) => !ev.hasAttachment));
          break;
      }    
    });
  }
  const uniqueEvs: IEvidence[] = resultingEvidences.filter(
    (ev, index) => resultingEvidences.findIndex((evidence) => evidence.id === ev.id) === index
  );
  return Array.from(new Set(uniqueEvs));
};
