import { BookmarkSimple, DotsThree, Notepad } from "phosphor-react";
import { useEffect, useState } from "react";
import { IEntry, UserRole } from "../../types";
import { Action } from "./Action";
import cx from "classnames";

interface IAction {
  onClick?: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
}

interface EntryHeaderProps {
  actions?: IAction[];
  entry: IEntry;
  isExpanded: boolean;
  isBookmarked?: boolean;
  toggleBody: (e: React.MouseEvent) => void;
}

export const EntryHeader: React.FC<EntryHeaderProps> = ({
  entry,
  isExpanded,
  isBookmarked = false,
  toggleBody,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isPlaintiff = entry.role === UserRole.Plaintiff;

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

  const bookmarkEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("bookmark entry");
  };

  const addNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("add note");
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const editEntry = (e: React.MouseEvent) => {
    console.log("edit entry");
  };

  const deleteEntry = (e: React.MouseEvent) => {
    console.log("delete entry");
  };

  return (
    <div
      onClick={(e) => toggleBody(e)}
      className={cx(
        "flex items-center justify-between rounded-t-lg px-6 py-3 cursor-pointer  select-none",
        {
          "bg-lightPurple text-darkPurple": isPlaintiff,
          "bg-lightPetrol text-darkPetrol": !isPlaintiff,
          "rounded-b-lg": !isExpanded,
        }
      )}
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
