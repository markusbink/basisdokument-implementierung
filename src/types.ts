export interface ITheme {
  id: string,
  title: string;
  primaryPlaintiff: string;
  secondaryPlaintiff: string;
  primaryDefendant: string;
  secondaryDefendant: string;
}

export interface IBookmark {
  id: string;
  title: string;
  associatedEntry: string;
  isInEditMode?: boolean;
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

export interface ISidebar {
  name: SidebarState;
  jsxElem: JSX.Element;
  icon: JSX.Element;
}

export interface IUser {
  name: string;
  role: UserRole;
}

export enum UserRole {
  Plaintiff = "Klagepartei",
  Defendant = "Beklagtenpartei",
  Judge = "Richter:in",
}

export enum Sorting {
  Privat,
  Original,
}

export enum UsageMode {
  Open,
  Create
}

export enum SidebarState {
  Notes,
  Hints,
  Bookmarks
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
  role: "Klagepartei" | "Beklagtenpartei";
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
  color: string;
  label: string;
}

export interface IMetaData {
  plaintiff: string;
  defendant: string;
}

export interface ILitigiousCheck {
  entryId: string;
  isLitigious: boolean;
}

export interface IHighlightedEntry {
  entryId: string;
  highlightedText: string;
}

export interface IVersion {
  author: string;
  role: string;
  timestamp: string;
}

export enum Tool {
  Eraser,
  Cursor,
  Highlighter
}

export interface ITool {
  id: Tool;
  iconNode: string;
  germanTitle: string;
}

export interface IStateUserInput {
  usage: UsageMode.Open | UsageMode.Create | undefined;
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
