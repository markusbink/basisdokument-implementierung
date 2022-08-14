export enum UserRole {
  Plaintiff = "Kläger",
  Defendant = "Beklagter",
  Judge = "Richter",
}

export interface IEntry {
  id: string;
  version: number;
  text: string;
  author: string;
  role: "Kläger" | "Beklagter";
  section_id: string;
  associated_entry?: string;
}