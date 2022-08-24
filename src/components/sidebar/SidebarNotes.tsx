import { CaretDown, CaretRight, Plus } from "phosphor-react";
import { useState } from "react";
import { Button } from "../Button";
import { Note, NoteProps } from "./Note";
import { NotePopup } from "../NotePopup";

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
  const [showModal, setShowModal] = useState(false);

  return (
    // TODO: Hide overflow here to make sure "Notizen" and the Add-Button are always visible...but now the buttom gets cut off...how to fix this?
    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
      <div className="flex justify-between items-center pt-4 px-4">
        <div className="font-bold text-darkGrey text-lg">Notizen</div>
        <Button
          key="createNote"
          onClick={() => setShowModal(true)}
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
          Notizen, die Sie zu Beiträgen verfassen, erscheinen in dieser Ansicht
          und sind nur für Sie sichtbar.
        </div>
      )}

      {notes.length > 0 && (
        <div className="flex flex-col p-4 text-mediumGrey font-extrabold text-sm overflow-y-scroll">
          <div
            className="cursor-pointer flex items-center"
            onClick={() =>
              setNotesWithoutReferenceOpen(!notesWithoutReferenceOpen)
            }
          >
            {notesWithoutReferenceOpen ? (
              <CaretDown size={14} className="inline mr-1" weight="bold" />
            ) : (
              <CaretRight size={14} className="inline mr-1" weight="bold" />
            )}
            OHNE BEZUG AUF BEITRAG
          </div>
          <div>
            {notesWithoutReferenceOpen &&
              notes.map(
                (note) =>
                  !note.referenceTo && <Note key={note.id} {...note}></Note>
              )}
          </div>

          <div
            className="cursor-pointer mt-7 flex items-center"
            onClick={() => setNotesWithReferenceOpen(!notesWithReferenceOpen)}
          >
            {notesWithReferenceOpen ? (
              <CaretDown size={14} className="inline mr-1" weight="bold" />
            ) : (
              <CaretRight size={14} className="inline mr-1" weight="bold" />
            )}
            MIT BEZUG AUF BEITRAG
          </div>
          <div>
            {notesWithReferenceOpen &&
              notes.map(
                (note) =>
                  note.referenceTo && <Note key={note.id} {...note}></Note>
              )}
          </div>
        </div>
      )}
      {showModal ? (
        <NotePopup isVisible={showModal} onClose={() => setShowModal(false)} />
      ) : null}
    </div>
  );
};