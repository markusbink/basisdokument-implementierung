import { CaretDown, CaretRight, Plus } from "phosphor-react";
import { useState } from "react";
import { Button } from "../Button";
import { Note, NoteProps } from "./Note";

//TODO: remove this, this is for testing
const notes: NoteProps[] = [
  {
    id: "1",
    title: "Test Titel mit Bezug ganz ganz ganz lang",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
    referenceTo: "K-2-1",
  },
  {
    id: "3",
    title: "Test Titel mit Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
    referenceTo: "K-3-1",
  },
  {
    id: "2",
    title: "Test Titel ohne Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
  },
  {
    id: "4",
    title: "Test Titel ohne Bezug",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur dolorum earum dolores omnis odit, voluptas ratione? Praesentium reprehenderit perspiciatis repudiandae officia veniam qui facere at deserunt, harum ab pariatur beatae?",
    author: "Max Muster",
    timestamp: new Date(),
  },
];

// const notes: NoteProps[] = [];

export const SidebarNotes = () => {
  const [notesWithoutReferenceOpen, setNotesWithoutReferenceOpen] =
    useState<boolean>(true);
  const [notesWithReferenceOpen, setNotesWithReferenceOpen] =
    useState<boolean>(true);

  return (
    // TODO: Hide overflow here to make sure "Notizen" and the Add-Button are always visible...but now the buttom gets cut off...how to fix this?
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Notizen</div>
        <Button
          key="createNote"
          bgColor="bg-darkGrey hover:bg-mediumGrey"
          size="sm"
          textColor="text-white"
          hasText={false}
          alternativePadding="p-1"
          icon={<Plus size={18} weight="bold" />}
        ></Button>
      </div>

      {notes.length <= 0 && (
        <div className="mt-7 text-darkGrey opacity-40 text-center text-sm">
          Notizen, die Sie zu Beiträgen verfassen, erscheinen in dieser Ansicht.
        </div>
      )}

      {notes.length > 0 && (
        // Problem with overflow (see comment above)
        <div className="flex flex-col gap-7 p-4 text-mediumGrey font-extrabold text-sm overflow-y-scroll">
          <div>
            {notesWithoutReferenceOpen ? (
              <CaretDown
                size={14}
                className="inline mr-1"
                weight="bold"
                onClick={() =>
                  setNotesWithoutReferenceOpen(!notesWithoutReferenceOpen)
                }
              />
            ) : (
              <CaretRight
                size={14}
                className="inline mr-1"
                weight="bold"
                onClick={() =>
                  setNotesWithoutReferenceOpen(!notesWithoutReferenceOpen)
                }
              />
            )}
            OHNE BEZUG AUF BEITRAG
            {notesWithoutReferenceOpen &&
              notes.map(
                (note) =>
                  !note.referenceTo && <Note key={note.id} {...note}></Note>
              )}
          </div>
          <div>
            {notesWithReferenceOpen ? (
              <CaretDown
                size={14}
                className="inline mr-1"
                weight="bold"
                onClick={() =>
                  setNotesWithReferenceOpen(!notesWithReferenceOpen)
                }
              />
            ) : (
              <CaretRight
                size={14}
                className="inline mr-1"
                weight="bold"
                onClick={() =>
                  setNotesWithReferenceOpen(!notesWithReferenceOpen)
                }
              />
            )}
            MIT BEZUG AUF BEITRAG
            {notesWithReferenceOpen &&
              notes.map(
                (note) =>
                  note.referenceTo && <Note key={note.id} {...note}></Note>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
