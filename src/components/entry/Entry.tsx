import cx from "classnames";
import {
  ArrowBendLeftUp,
  BookmarkSimple,
  DotsThree,
  Notepad,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { IEntry, UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "./Action";
import { EntryBody } from "./EntryBody";
import { EntryHeader } from "./EntryHeader";
import { NewEntry } from "./NewEntry";

interface EntryProps {
  entry: IEntry;
  isBookmarked?: boolean;
  viewedBy: UserRole;
  isHidden?: boolean;
}

export const Entry: React.FC<EntryProps> = ({
  entry,
  isBookmarked = false,
  viewedBy,
  isHidden = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;

  /**
   * Used to conditionally style the entries based on which user is viewing it.
   */
  const isOwnEntry =
    (viewedBy === UserRole.Plaintiff && entry.role === "Kläger") ||
    (viewedBy === UserRole.Defendant && entry.role === "Beklagter");

  const canAddEntry = isJudge || !isOwnEntry;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [isMenuOpen]);

  const toggleBody = (e: React.MouseEvent) => {
    setIsExpanded(!isExpanded);
  };

  const showNewEntry = () => {
    setIsNewEntryVisible(true);
  };

  const bookmarkEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`bookmark entry ${entry.id}`);
  };

  const addNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`add note to entry ${entry.id}`);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const editEntry = (e: React.MouseEvent) => {
    console.log(`edit entry ${entry.id}`);
  };

  const deleteEntry = (e: React.MouseEvent) => {
    console.log(`delete entry ${entry.id}`);
  };

  return (
    <div
      className={cx({
        "opacity-50": isHidden,
        "pointer-events-none": isHidden,
      })}
    >
      <div
        className={cx("flex flex-col", {
          "items-end": !isPlaintiff,
        })}
      >
        <div className={cx("w-1/2")}>
          <EntryHeader
            isPlaintiff={isPlaintiff}
            isExpanded={isExpanded}
            toggleBody={toggleBody}
          >
            {/* Meta-Data */}
            <div className="flex gap-2">
              <span
                className={cx("rounded-full px-3 py-1 text-xs font-semibold", {
                  "bg-darkPurple text-lightPurple": isPlaintiff,
                  "bg-darkPetrol text-lightPetrol": !isPlaintiff,
                })}
              >
                K-1-1
              </span>
              <span className="font-bold">{entry.author}</span>
              <span>25.05.2022</span>
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              <Action onClick={bookmarkEntry} isPlaintiff={isPlaintiff}>
                <BookmarkSimple
                  size={20}
                  weight={isBookmarked ? "fill" : "regular"}
                />
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
                  <ul className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl w-[200px] shadow-lg">
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
          </EntryHeader>
          {isExpanded && (
            <EntryBody isPlaintiff={isPlaintiff}>{entry.text}</EntryBody>
          )}
        </div>
        {canAddEntry && !isNewEntryVisible && (
          <Button
            onClick={showNewEntry}
            icon={<ArrowBendLeftUp weight="bold" size={18} />}
            size="sm"
            bgColor="transparent"
            textColor={cx("font-bold", {
              "text-darkPurple": isPlaintiff,
              "text-darkPetrol": !isPlaintiff,
            })}
          >
            Text verfassen
          </Button>
        )}
        {isNewEntryVisible && (
          <NewEntry
            parentRole={entry.role}
            setIsNewEntryVisible={() => setIsNewEntryVisible(false)}
          />
        )}
      </div>
    </div>
  );
};
