import cx from "classnames";
import { DotsThree, Eye, PencilSimple, Trash } from "phosphor-react";
import React, { useRef, useState } from "react";
import { useEntries } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IEntry, INote } from "../../types";
import { Button } from "../Button";

export interface NoteProps {
  note: INote;
}

const getEntryCodeFromEntryId = (entries: IEntry[], entryId: string = "") => {
  const entry = entries.find((entry) => entry.id === entryId);
  return entry ? entry.entryCode : "";
};

export const Note: React.FC<NoteProps> = ({ note }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));
  const { entries } = useEntries();
  const entryCode = getEntryCodeFromEntryId(entries, note.associatedEntry);

  const editNote = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    //TODO open popup
  };

  const deleteNote = (e: React.MouseEvent) => {
    //TODO
  };

  return (
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {note.associatedEntry && (
          <a
            href={`#${entryCode}`}
            className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit cursor-pointer
              bg-darkGrey hover:bg-mediumGrey text-lightGrey text-[10px] font-semibold rounded-xl"
          >
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${entryCode}`}
          </a>
        )}

        <div className={cx("mx-3", { "mt-3": !note.associatedEntry })}>
          <h3 className="mb-2 text-sm font-bold">{note.title}</h3>
          <p className="mb-2" dangerouslySetInnerHTML={{ __html: note.text }} />

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{note.author}</div>
              <div className="opacity-40">
                {/* {`${String(note.timestamp.getDate()).padStart(2, "0")}.
            ${String(note.timestamp.getMonth()).padStart(2, "0")}.
            ${note.timestamp.getFullYear()}`} */}
                {"Timestamp"}
              </div>
            </div>

            <div ref={ref} className="self-end relative">
              <Button
                key="createNote"
                bgColor={
                  isMenuOpen ? "bg-lightGrey" : "bg-offWhite hover:bg-lightGrey"
                }
                size="sm"
                textColor="text-darkGrey"
                hasText={false}
                alternativePadding="p-1"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                icon={<DotsThree size={20} weight="bold" />}
              ></Button>{" "}
              {isMenuOpen ? (
                <ul className="absolute right-0 bottom-8 p-2 bg-white text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                  <li
                    tabIndex={0}
                    onClick={editNote}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none  cursor-pointer"
                  >
                    <PencilSimple size={16} />
                    Bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={deleteNote}
                    className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none  cursor-pointer"
                  >
                    <Trash size={16} />
                    Löschen
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
