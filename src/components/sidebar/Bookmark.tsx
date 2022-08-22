import { BookmarkSimple, Eye, Trash } from "phosphor-react";
import React from "react";
import { Button } from "../Button";
import { useState } from "react";

export interface BookmarkProps {
  id: string;
  title: string;
  referenceTo: string;
}

export const Bookmark: React.FC<BookmarkProps> = (bookmark) => {
  const [doubleClicked, setDoubleClicked] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(bookmark.title);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(bookmark.title);
    setTitle(e.target.value);
  };

  const saveTitle = () => {
    console.log("bookmark: ", bookmark.title);
    setDoubleClicked(false);
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
            name="title"
            className="w-4/5 px-1 rounded-md focus:outline focus:outline-lightGrey"
            value={title}
            onBlur={saveTitle}
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
