export interface ITheme {
  id: string;
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

export enum ViewMode {
  SideBySide = "SbS",
  Rows = "Row",
  Columns = "Col",
}

export enum UserRole {
  Plaintiff = "Klagepartei",
  Defendant = "Beklagtenpartei",
  Judge = "Richter:in",
  Client = "Mandant:in",
}

export enum Sorting {
  Privat,
  Original,
}

export enum UsageMode {
  Open,
  Create,
  Readonly,
}

export enum SidebarState {
  Sorting,
  Notes,
  Hints,
  Bookmarks,
  Evidences,
}

export interface ISection {
  id: string;
  num: number;
  version: number;
  titlePlaintiff: string;
  titlePlaintiffVersion?: number;
  titleDefendant: string;
  titleDefendantVersion?: number;
}

export interface IEntry {
  id: string;
  entryCode: string;
  version: number;
  text: string;
  author: string;
  role: UserRole.Plaintiff | UserRole.Defendant;
  sectionId: string;
  associatedEntry?: string;
  evidences: IEvidence[];
}

export enum IDragItemType {
  ENTRY = "entry",
}

export interface IndividualEntrySortingEntry {
  rowId: string;
  isLitigious?: boolean;
  columns: string[][]; // [0] = plaintiff, [1] = defendant
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
  Highlighter,
}

export interface ITool {
  id: Tool;
  iconNode: string;
  germanTitle: string;
}

export interface IStateUserInput {
  usage: UsageMode.Open | UsageMode.Create | UsageMode.Readonly | undefined;
  role: UserRole | undefined;
  prename: string;
  surname: string;
  caseId: string;
  basisdokumentFile: string;
  editFile: string;
  basisdokumentFilename: string;
  coverFilename: string;
  editFilename: string;
  errorText: string;
  newVersionMode: boolean | undefined;
}

export interface IEvidence {
  id: string;
  name: string;
  hasAttachment: boolean;
  version: number;
  isCurrentEntry: boolean;
  role: UserRole;
  tag?: string;
  attachmentId?: string;
  isInEditMode: boolean;
  hasImageFile: boolean;
  imageFile?: string;
  imageFilename?: string;
}
