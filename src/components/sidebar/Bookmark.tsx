import { BookmarkSimple, Eye, Trash } from "phosphor-react";
import React, { useState } from "react";
import { useBookmarks, useCase, useHeaderContext } from "../../contexts";
import { IBookmark } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";
import { Tooltip } from "../Tooltip";
import cx from "classnames";
import { ErrorPopup } from "../ErrorPopup";
import { getTheme } from "../../themes/getTheme";

export interface BookmarkProps {
  bookmark: IBookmark;
}

export const Bookmark: React.FC<BookmarkProps> = ({ bookmark }) => {
  const { setBookmarks, setBookmarkEditMode } = useBookmarks();
  const { entries } = useCase();
  const { selectedTheme } = useHeaderContext();
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);

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
      <div>
        <BookmarkSimple
          size={20}
          weight="fill"
          className="text-darkGrey w-fit"
        />
      </div>
      <div className="flex flex-grow w-auto overflow-hidden">
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
          <Tooltip className="w-full" text="Doppelklick, um zu Editieren">
            <div
              className="break-words w-full text-left"
              onDoubleClick={() => {
                setBookmarkEditMode(bookmark, true);
              }}>
              {bookmark.title}
            </div>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap">
        {entryCode ? (
          <a
            href={`#${entryCode}`}
            className={cx(
              "flex items-center gap-1 px-1.5 py-0.25 rounded-xl text-[10px] font-semibold cursor-pointer min-w-fit grow",
              {
                "bg-darkGrey text-offWhite hover:bg-mediumGrey": !entryCode,
                [`bg-${getTheme(selectedTheme)?.secondaryLeft} text-${
                  getTheme(selectedTheme)?.primaryLeft
                } hover-bg-${getTheme(selectedTheme)?.primaryLeft} hover-text-${
                  getTheme(selectedTheme)?.secondaryLeft
                }`]: entryCode?.charAt(0) === "K",
                [`bg-${getTheme(selectedTheme)?.secondaryRight} text-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-bg-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-text-${getTheme(selectedTheme)?.secondaryRight}`]:
                  entryCode?.charAt(0) === "B",
              }
            )}>
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${entryCode}`}
          </a>
        ) : (
          <div
            className="flex items-center gap-1 px-1.5 py-0.25 rounded-xl bg-darkGrey
          text-lightGrey text-[9px] font-semibold min-w-fit grow">
            <Eye size={12} weight="bold" className="inline"></Eye>
            {`fehlend`}
          </div>
        )}

        <Button
          key="deleteNote"
          bgColor="bg-lightRed hover:bg-marker-red relative"
          size="sm"
          textColor="text-darkRed"
          hasText={false}
          alternativePadding="p-1"
          onClick={() => setIsDeleteErrorVisible(true)}
          icon={<Trash size={16} />}
        />
      </div>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie das Lesezeichen <b>{bookmark.title}</b>{" "}
            löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsDeleteErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
                deleteBookmark();
              }}>
              Lesezeichen löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </div>
  );
};
