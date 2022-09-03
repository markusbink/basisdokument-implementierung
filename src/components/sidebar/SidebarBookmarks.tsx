import { BookmarkSimple } from "phosphor-react";
import { useBookmarks } from "../../contexts/BookmarkContext";
import { Bookmark } from "./Bookmark";

export const SidebarBookmarks = () => {
  const { bookmarks } = useBookmarks();

  return (
    <div className="flex flex-col gap-3 flex-1 h-[calc(100%_-_3.5rem)] overflow-auto">
      <div className="font-bold text-darkGrey text-lg pt-4 px-4">
        Lesezeichen
      </div>
      {bookmarks.length <= 0 && (
        <span className="mt-7 text-darkGrey opacity-40 text-center text-sm">
          Indem Sie auf das <BookmarkSimple size={14} className="inline" />
          -Icon bei einem Beitrag klicken, wird dieser unter Ihren Lesezeichen
          gespeichert. Ihre Lesezeichen erscheinen dann in dieser Ansicht und
          sind nur für Sie sichtbar.
        </span>
      )}
      <div className="text-mediumGrey font-bold text-sm p-4">
        {bookmarks.map((bookmark) => (
          <Bookmark key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};
