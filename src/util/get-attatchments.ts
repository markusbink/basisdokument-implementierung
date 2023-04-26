import { IEntry, UserRole } from "../types";

export const getAttatchments = (
  entries: IEntry[],
  entryRole: UserRole | undefined,
  currentTag: string,
  tags: string[],
): string[] => {
    if (!entryRole || entryRole === UserRole.Client) return [];
    
    let atts = [];
    if (entryRole === UserRole.Judge) {
        atts = entries.map((e) => e.attatchments).flat(1);
    } else {
        atts = (entries.map((e) => {
            if (e.role === entryRole) return e.attatchments;
            return [];
        })).flat(1);
    }

    if (currentTag) {
        atts = atts.filter((att) => att.startsWith(currentTag));
    }
    atts = atts.filter((att) => !tags.includes(att));
    return Array.from(new Set(atts));
};