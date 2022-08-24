import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { INote } from "../types";

interface INoteContext {
  notes: INote[];
  setNotes: Dispatch<SetStateAction<INote[]>>;
  updateNote: (note: INote) => void;
}

export const NoteContext = createContext<INoteContext | null>(null);

interface NoteProviderProps {
  children: React.ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<INote[]>([]);

  const updateNote = (note: INote) => {
    setNotes(notes.map((e) => (e.id === note.id ? note : e)));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        updateNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (context === null) {
    throw new Error("useNotes must be used within an NoteProvider");
  }
  return context;
};
