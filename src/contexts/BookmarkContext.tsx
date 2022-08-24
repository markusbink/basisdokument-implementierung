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
}

export const BookmarkContext = createContext<IBookmarkContext | null>(null);

interface bookmarkProviderProps {
  children: React.ReactNode;
}

export const BookmarkProvider: React.FC<bookmarkProviderProps> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);

  const updateBookmark = (bookmark: IBookmark) => {
    setBookmarks(bookmarks.map((e) => (e.id === bookmark.id ? bookmark : e)));
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        setBookmarks,
        updateBookmark,
      }}
    >
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
