import { MouseEventHandler } from "react";

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
  sectionI: string;
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
