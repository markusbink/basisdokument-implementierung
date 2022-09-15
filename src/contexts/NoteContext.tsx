import { ContentState, convertFromHTML, EditorState } from "draft-js";
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
  showNotePopup: boolean;
  setShowNotePopup: Dispatch<SetStateAction<boolean>>;
  editorState: any;
  setEditorState: any;
  contentState: any;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  openedNoteId: string;
  setOpenedNoteId: Dispatch<SetStateAction<string>>;
  showErrorText: boolean;
  setShowErrorText: Dispatch<SetStateAction<boolean>>;
  associatedEntryIdNote: string;
  setAssociatedEntryIdNote: Dispatch<SetStateAction<string>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export const NoteContext = createContext<INoteContext | null>(null);

interface NoteProviderProps {
  children: React.ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [showNotePopup, setShowNotePopup] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showErrorText, setShowErrorText] = useState<boolean>(false);
  const [associatedEntryIdNote, setAssociatedEntryIdNote] = useState<string>("");
  const [openedNoteId, setOpenedNoteId] = useState<string>("");

  const [editorState, setEditorState] = useState(() => {
    const blocksFromHTML = convertFromHTML("");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return EditorState.createWithContent(contentState);
  });
  const [title, setTitle] = useState<string>("");

  const contentState = editorState.getCurrentContent();

  const updateNote = (note: INote) => {
    setNotes(notes.map((e) => (e.id === note.id ? note : e)));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        setNotes,
        updateNote,
        showNotePopup,
        setShowNotePopup,
        editorState,
        setEditorState,
        contentState,
        title,
        setTitle,
        openedNoteId,
        setOpenedNoteId,
        showErrorText,
        setShowErrorText,
        associatedEntryIdNote,
        setAssociatedEntryIdNote,
        editMode,
        setEditMode
      }}>
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
