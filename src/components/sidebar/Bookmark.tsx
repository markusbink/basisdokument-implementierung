import { BookmarkSimple, Eye, Trash } from "phosphor-react";
import React from "react";
import { useBookmarks, useCase } from "../../contexts";
import { IBookmark } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";

export interface BookmarkProps {
  bookmark: IBookmark;
}

export const Bookmark: React.FC<BookmarkProps> = ({ bookmark }) => {
  const { setBookmarks, setBookmarkEditMode } = useBookmarks();
  const { entries } = useCase();

  let entryCode;
  try {
    entryCode = getEntryCode(entries, bookmark.associatedEntry);
  } catch {}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBookmarks((bookmarks) => {
      const updatedBoomarks = bookmarks.map((oldBoomark) => {
        if (oldBoomark.id === bookmark.id) {
          return { ...oldBoomark, title: value };
        }
        return oldBoomark;
      });
      return updatedBoomarks;
    });
  };

  const deleteBookmark = () => {
    setBookmarks((bookmarks) => {
      return bookmarks.filter((oldBoomark) => oldBoomark.id !== bookmark.id);
    });
  };

  return (
    <div className="flex justify-between gap-2 items-center bg-offWhite rounded-lg mb-2 p-2 font-medium">
      <div className="flex flex-row items-center gap-2">
        <div>
          <BookmarkSimple size={20} weight="fill" className="text-darkGrey" />
        </div>
        <div className="flex flex-row justify-start w-full gap-2">
          {bookmark.isInEditMode ? (
            <input
              autoFocus={true}
              type="text"
              name="title"
              placeholder="Titel vergeben..."
              maxLength={40}
              className="focus:outline focus:outline-offWhite focus:bg-offWhite p-0 m-0"
              value={bookmark.title}
              onBlur={() => setBookmarkEditMode(bookmark, false)}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setBookmarkEditMode(bookmark, false);
                }
              }}
            />
          ) : (
           
            <Tooltip text="Doppelklick, um zu Editieren">
            <div
              className="break-words text-left"
              onDoubleClick={() => {
                setBookmarkEditMode(bookmark, true);
              }}>
              {bookmark.title}
            </div>
          </Tooltip>
     
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2">
          {entryCode ? (
            <a
              href={`#${entryCode}`}
              className="flex items-center gap-1 px-1.5 py-0.25 rounded-xl bg-darkGrey hover:bg-mediumGrey
          text-lightGrey text-[10px] font-semibold cursor-pointer min-w-fit">
              <Eye size={16} weight="bold" className="inline"></Eye>
              {`${entryCode}`}
            </a>
          ) : (
            <div
              className="flex items-center gap-1 px-1.5 py-0.25 rounded-xl bg-darkGrey
          text-lightGrey text-[9px] font-semibold min-w-fit">
              <Eye size={12} weight="bold" className="inline"></Eye>
              {`fehlend`}
            </div>
          )}


          <Button
            key="createNote"
            bgColor="bg-lightRed hover:bg-marker-red"
            size="sm"
            textColor="text-darkRed"
            hasText={false}
            alternativePadding="p-1"
            onClick={deleteBookmark}
            icon={<Trash size={16} />}></Button>
        </div>
      </div>
    </div>
  );
};
