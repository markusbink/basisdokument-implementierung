export enum UserRole {
  Plaintiff = "Kläger",
  Defendant = "Beklagter",
  Judge = "Richter",
}

export enum Sorting {
  Privat,
  Original,
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

export interface BasisdokumentData {
  caseId: string;
}

export interface UserData {
  username: string;
  userParty: string;
}

export interface IHighlighter {
  id: string;
  label: string;
}

export interface IVersion {
  author: string;
  role: string;
  timestamp: string;
}

export interface Tool {
  id: string;
  title: string;
}

export interface IStateUserInput {
  usage: "open" | "create" | undefined;
  role: "Kläger" | "Beklagter" | "Richter" | undefined;
  prename: string;
  surname: string;
  caseId: string;
  basisdokumentFile: string;
  editFile: string;
  basisdokumentFilename: string;
  editFilename: string;
  errorText: string;
  newVersionMode: boolean;
}