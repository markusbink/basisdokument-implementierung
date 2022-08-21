export interface BookmarkProps {
  id: string;
  title: string;
  referenceTo?: string;
}

export const Bookmark: React.FC<BookmarkProps> = (bookmark: BookmarkProps) => {
  return (
    <div className="font-normal">
      <div>{bookmark.title}</div>
      <div>{bookmark.referenceTo}</div>
    </div>
  );
};
