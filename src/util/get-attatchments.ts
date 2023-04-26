import { IEntry, UserRole } from "../types";

export const getAttatchments = (
  entries: IEntry[],
  entryRole: UserRole | undefined,
  currentTag: string,
  tags: string[],
): string[] => {
    let atts = [];
    if (!entryRole || entryRole === UserRole.Client) return [];
    if (entryRole === UserRole.Judge) {
        atts = entries.map((e) => e.attatchments).flat(1);
        if (currentTag) {
            return atts.filter((att) => att.startsWith(currentTag) && !tags.includes(att));
        }
        return atts;
    }
    const attatchments = entries.map((e) => {
        if (e.role === entryRole) return e.attatchments;
        return [];
    });
    atts = attatchments.flat(1);
    if (currentTag) {
        return atts.filter((att) => att.startsWith(currentTag) && !tags.includes(att));
    }
    return atts;
};