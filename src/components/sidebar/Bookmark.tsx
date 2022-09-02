import { BookmarkSimple, Eye, Trash } from "phosphor-react";
import React, { useState } from "react";
import { useBookmarks, useCase } from "../../contexts";
import { IBookmark } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";

export interface BookmarkProps {
  bookmark: IBookmark;
}

export const Bookmark: React.FC<BookmarkProps> = ({ bookmark }) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(true);

  const { setBookmarks } = useBookmarks();
  const { entries } = useCase();
  const entryCode = getEntryCode(entries, bookmark.associatedEntry);

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
      <BookmarkSimple
        size={18}
        weight="fill"
        className="fill-darkGrey min-w-fit"
      />
      {doubleClicked ? (
        <input
          autoFocus={true}
          type="text"
          name="title"
          placeholder="Titel vergeben..."
          className="max-w-[55%] rounded-md focus:outline focus:outline-lightGrey"
          value={bookmark.title}
          onBlur={() => setDoubleClicked(false)}
          onChange={handleChange}
        />
      ) : (
        <div
          className="break-words grow max-w-[55%]"
          onDoubleClick={() => {
            setDoubleClicked(true);
          }}>
          {bookmark.title}
        </div>
      )}

      <div className="flex items-center gap-2">
        <a
          href={`#${entryCode}`}
          className="flex items-center gap-1 px-1.5 py-0.25 rounded-xl bg-darkGrey hover:bg-mediumGrey
          text-lightGrey text-[10px] font-semibold cursor-pointer min-w-fit">
          <Eye size={16} weight="bold" className="inline"></Eye>
          {`${entryCode}`}
        </a>

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
  );
};
