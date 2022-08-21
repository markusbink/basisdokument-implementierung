import { BookmarkSimple, Eye, Trash } from "phosphor-react";
import React from "react";
import { Button } from "../Button";
import { useState } from "react";

export interface BookmarkProps {
  id: string;
  title: string;
  referenceTo: string;
}

export const Bookmark: React.FC<BookmarkProps> = (bookmark: BookmarkProps) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);

  const setTitle = () => {
    //TODO
    setDoubleClicked(false);
  };

  const handleChange = () => {
    //TODO
  };

  const showReference = (e: React.MouseEvent) => {
    //TODO
  };

  const deleteBookmark = () => {
    //TODO
  };

  return (
    <div className="flex justify-between gap-2 items-center bg-offWhite rounded-lg mb-2 p-2 font-medium">
      <div className="flex items-center gap-2">
        <BookmarkSimple size={18} weight="fill" className="fill-darkGrey" />
        {doubleClicked ? (
          <input
            autoFocus={true}
            type="text"
            className="w-4/5 px-1 focus:border-[1px] rounded-md focus:border-lightGrey"
            value={bookmark.title}
            onBlur={setTitle}
            onChange={handleChange}
          />
        ) : (
          <div
            onDoubleClick={() => {
              setDoubleClicked(true);
            }}
          >
            {bookmark.title}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1 px-1.5 py-0.25 rounded-xl bg-darkGrey hover:bg-mediumGrey
          text-lightGrey text-[10px] font-semibold "
          onClick={showReference}
        >
          <Eye size={16} weight="bold" className="inline"></Eye>
          {`${bookmark.referenceTo}`}
        </div>

        <Button
          key="createNote"
          bgColor="bg-marker-red"
          size="sm"
          textColor="text-darkRed"
          hasText={false}
          alternativePadding="p-1"
          onClick={deleteBookmark}
          icon={<Trash size={16} />}
        ></Button>
      </div>
    </div>
  );
};
