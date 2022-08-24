export interface IBookmark {
  id: string;
  title: string;
  associatedEntry: string;
}

export interface IHint {
  id: string;
  version: number;
  title: string;
  text: string;
  author: string;
  associatedEntry?: string;
}

export interface INote {
  id: string;
  title: string;
  text: string;
  author: string;
  timestamp: Date;
  associatedEntry?: string;
}

export enum UserRole {
  Plaintiff = "Kläger",
  Defendant = "Beklagter",
  Judge = "Richter",
}

export enum Sorting {
  Privat,
  Original,
}

export interface ISection {
  id: string;
  version: number;
  titlePlaintiff: string;
  titleDefendant: string;
}

export interface IEntry {
  id: string;
  entryCode: string;
  version: number;
  text: string;
  author: string;
  role: "Kläger" | "Beklagter";
  sectionId: string;
  associatedEntry?: string;
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
  iconNode: string;
  germanTitle: string;
}

export interface IStateUserInput {
  usage: "open" | "create" | undefined;
  role: UserRole | undefined;
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
