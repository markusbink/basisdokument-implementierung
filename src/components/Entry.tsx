import cx from "classnames";
import {
  ArrowBendLeftUp,
  BookmarkSimple,
  DotsThree,
  Notepad,
} from "phosphor-react";
import React, { useState } from "react";
import { IEntry, UserRole } from "../types";
import { Button } from "./Button";

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
          className={`rounded-lg border ${
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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const editEntry = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("edit entry");
  };

  const deleteEntry = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("delete entry");
  };

  return (
    <div
      onClick={(e) => toggleHeader(e)}
      className={`flex items-center justify-between rounded-t-lg px-6 py-3 cursor-pointer  select-none${
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
        <Action
          className="relative"
          onClick={toggleMenu}
          isPlaintiff={isPlaintiff}
        >
          <DotsThree size={20} />
          {isMenuOpen ? (
            <ul className="absolute p-2 bg-white text-darkGrey rounded-xl w-[200px] shadow-lg">
              <li
                onClick={editEntry}
                className="p-2 hover:bg-offWhite rounded-lg"
              >
                Bearbeiten
              </li>
              <li
                onClick={deleteEntry}
                className="p-2 hover:bg-offWhite rounded-lg"
              >
                Löschen
              </li>
            </ul>
          ) : null}
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

interface ActionProps extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: (e: React.MouseEvent) => void;
  isPlaintiff: boolean;
  children: React.ReactNode;
}

export const Action: React.FC<ActionProps> = ({
  onClick,
  isPlaintiff,
  children,
  className,
  ...restProps
}) => {
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-md p-1 cursor-pointer",
        {
          "hover:bg-darkPurple hover:text-lightPurple": isPlaintiff,
          "hover:bg-darkPetrol hover:text-lightPetrol": !isPlaintiff,
        },
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};
