import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IBookmark } from "../types";

interface IBookmarkContext {
  bookmarks: IBookmark[];
  setBookmarks: Dispatch<SetStateAction<IBookmark[]>>;
  updateBookmark: (bookmark: IBookmark) => void;
  setBookmarkEditMode: (bookmark: IBookmark, value: boolean) => void;
}

export const BookmarkContext = createContext<IBookmarkContext | null>(null);

interface BookmarkProviderProps {
  children: React.ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  const updateBookmark = (bookmark: IBookmark) => {
    setBookmarks(bookmarks.map((e) => (e.id === bookmark.id ? bookmark : e)));
  };

  const setBookmarkEditMode = (bookmark: IBookmark, value: boolean) => {
    setBookmarks(
      bookmarks.map((e) =>
        e.id === bookmark.id
          ? { ...e, isInEditMode: value }
          : { ...e, isInEditMode: e.isInEditMode }
      )
    );
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        setBookmarks,
        updateBookmark,
        setBookmarkEditMode,
      }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === null) {
    throw new Error("useBookmarks must be used within an BookmarkProvider");
  }
  return context;
};
