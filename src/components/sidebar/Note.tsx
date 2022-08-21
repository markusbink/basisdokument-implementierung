export interface NoteProps {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: Date;
  referenceTo?: string;
}

export const Note: React.FC<NoteProps> = (note: NoteProps) => {
  return (
    <div className="font-normal">
      <div>{note.title}</div>
      <div>{note.content}</div>
      <div>{note.author}</div>
      <div>{note.timestamp.getDate()}</div>
      <div>{note.referenceTo}</div>
    </div>
  );
};
