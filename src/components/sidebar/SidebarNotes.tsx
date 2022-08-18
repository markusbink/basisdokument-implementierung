import { Plus } from "phosphor-react";
import { Button } from "../Button";
import { Note, NoteProps } from "./Note";

//TODO: remove this, this is for testing
const notes: NoteProps[] = [
  {
    id: "1",
    title: "Test Titel mit Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
    referenceTo: "12345",
  },
  {
    id: "2",
    title: "Test Titel ohne Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
  },
];

export const SidebarNotes = () => {
  return (
    <div className="flex flex-col gap-7 p-4 h-full overflow-auto">
      <div className="flex justify-between items-center">
        <div className="text-base font-bold text-darkGrey text-lg">Notizen</div>
        <Button
          key="createNote"
          bgColor="bg-darkGrey"
          size="sm"
          textColor="text-white"
          hasText={false}
          alternativePadding="p-1"
          icon={<Plus size={18} />}
        ></Button>
      </div>
      {notes.length <= 0 && (
        <div className="mt-7 text-darkGrey opacity-40 text-center text-sm">
          Notizen, die Sie zu Beiträgen verfassen, erscheinen in dieser Ansicht.
        </div>
      )}
      <div className="text-mediumGrey font-bold text-sm">
        OHNE BEZUG AUF BEITRAG
        {notes
          .filter((note) => {
            return !note.referenceTo;
          })
          .map((note) => (
            <Note key={note.id} {...note}></Note>
          ))}
      </div>
      <div className="text-mediumGrey font-bold text-sm">
        MIT BEZUG AUF BEITRAG
        {notes
          .filter((note) => {
            return note.referenceTo;
          })
          .map((note) => (
            <Note key={note.id} {...note}></Note>
          ))}
      </div>
    </div>
  );
};
