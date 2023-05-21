import { IAttachment, IEntry, UserRole } from "../types";

export const getAttachments = (
  entries: IEntry[],
  currentInput: string,
  addedAttatchments: IAttachment[],
): IAttachment[] => {
    let atts = entries.map((e) => e.attachments).flat(1);
    if (currentInput) {
        atts = atts.filter((att) => att.name.startsWith(currentInput));
    }
    atts = atts.filter((att) => !addedAttatchments.includes(att));
    return Array.from(new Set(atts));
};

export const getAttatchmentId = (
    entries: IEntry[],
    role: UserRole,
): string => {
    let atts = Array.from(new Set(entries.map((e) => e.attachments).flat(1)));
    atts = atts.filter((a) => a.role && a.role === role);

    let index = 0
    if (atts.length > 0) {
        const lastElem = atts.at(atts.length-1);
        index = parseInt(lastElem?.attatchmentId?.slice(1)!) + 1;
    }
    return role === UserRole.Plaintiff ? "K" + (index + 1) : "B" + (index + 1)
};
