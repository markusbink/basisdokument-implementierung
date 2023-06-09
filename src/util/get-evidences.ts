import { IEvidence, IEntry, UserRole } from "../types";

export const getEvidences = (
  entries: IEntry[],
  currentInput: string,
  addedEvidences: IEvidence[],
): IEvidence[] => {
    let evs = entries.map((entry) => entry.evidences).flat(1);
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
    let evs = entries.map((entry) => entry.evidences).flat(1);
    evs = evs.filter((ev) => ev.role === role);
    return Array.from(new Set(evs));
}

export const getEvidenceAttachmentId = (
    entries: IEntry[],
    role: UserRole,
): string => {
    let evs = Array.from(new Set(entries.map((e) => e.evidences).flat(1)));
    evs = evs.filter((ev) => ev.role && ev.role === role);

    let index = 0
    if (evs.length > 0) {
        const lastElem = evs.at(evs.length-1);
        index = parseInt(lastElem?.attachmentId?.slice(1)!) + 1;
    }
    return role === UserRole.Plaintiff ? "K" + (index + 1) : "B" + (index + 1)
};
