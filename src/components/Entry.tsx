import { IEntry, UserRole } from "../types";
import {
  BookmarkSimple,
  Notepad,
  DotsThree,
  ArrowBendLeftUp,
} from "phosphor-react";
import { Button } from "./Button";
import React, { useState } from "react";

interface EntryProps {
  entry: IEntry;
  viewedBy: UserRole;
}

export const Entry: React.FC<EntryProps> = ({ entry, viewedBy }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;
  const isOwnEntry =
    (viewedBy === UserRole.Plaintiff && entry.role === "Kläger") ||
    (viewedBy === UserRole.Defendant && entry.role === "Beklagter");

  const toggleHeader = (e: React.MouseEvent) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`flex flex-col ${isPlaintiff ? "" : "items-end"}`}>
      <div className="w-1/2">
        <div
          className={`rounded-lg border overflow-hidden ${
            isPlaintiff ? "border-lightPurple" : "border-lightPetrol"
          }`}
        >
          <EntryHeader entry={entry} toggleHeader={toggleHeader} />
          {isExpanded && <EntryBody>{entry.text}</EntryBody>}
        </div>
        {isJudge || !isOwnEntry ? (
          <Button
            icon={<ArrowBendLeftUp weight="bold" size={18} />}
            size="sm"
            bgColor="transparent"
            textColor={`font-bold ${
              isPlaintiff ? "text-darkPurple" : "text-darkPetrol"
            }`}
          >
            Text verfassen
          </Button>
        ) : null}
      </div>
    </div>
  );
};

interface EntryHeaderProps {
  entry: IEntry;
  toggleHeader: (e: React.MouseEvent) => void;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  entry,
  toggleHeader,
}) => {
  const isPlaintiff = entry.role === UserRole.Plaintiff;

  const bookmarkEntry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("bookmark entry");
  };

  const addNote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("add note");
  };
  return (
    <div
      onClick={(e) => toggleHeader(e)}
      className={`flex items-center justify-between px-6 py-3 cursor-pointer  select-none${
        isPlaintiff
          ? " bg-lightPurple text-darkPurple"
          : " bg-lightPetrol text-darkPetrol"
      }`}
    >
      {/* Meta-Data */}
      <div className="flex gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isPlaintiff
              ? "bg-darkPurple text-lightPurple"
              : "bg-darkPetrol text-lightPetrol"
          }`}
        >
          K-1-1
        </span>
        <span className="font-bold">{entry.author}</span>
        <span>25.05.2022</span>
      </div>
      {/* Actions */}
      <div className="flex gap-2">
        <Action onClick={bookmarkEntry} isPlaintiff={isPlaintiff}>
          <BookmarkSimple size={20} />
        </Action>
        <Action onClick={addNote} isPlaintiff={isPlaintiff}>
          <Notepad size={20} />
        </Action>
        <Action isPlaintiff={isPlaintiff}>
          <DotsThree size={20} />
        </Action>
      </div>
    </div>
  );
};

interface EntryBodyProps {
  children: React.ReactNode;
}

export const EntryBody: React.FC<EntryBodyProps> = ({ children }) => {
  return (
    <p
      className="p-6"
      dangerouslySetInnerHTML={{ __html: children as string }}
    ></p>
  );
};

interface ActionProps {
  onClick?: (e: React.MouseEvent) => void;
  isPlaintiff: boolean;
  children: React.ReactNode;
}

export const Action: React.FC<ActionProps> = ({
  onClick,
  isPlaintiff,
  children,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-md p-1 cursor-pointer ${
        isPlaintiff
          ? "hover:bg-darkPurple hover:text-lightPurple"
          : "hover:bg-darkPetrol hover:text-lightPetrol"
      }`}
    >
      {children}
    </div>
  );
};
