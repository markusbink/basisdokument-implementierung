import { ContentState, convertFromHTML, EditorState } from "draft-js";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IHint } from "../types";

interface IHintContext {
  hints: IHint[];
  setHints: Dispatch<SetStateAction<IHint[]>>;
  updateHint: (hint: IHint) => void;
  showJudgeHintPopup: boolean;
  setShowJudgeHintPopup: Dispatch<SetStateAction<boolean>>;
  editorState: any;
  setEditorState: any;
  contentState: any;
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  openedHintId: string;
  setOpenedHintId: Dispatch<SetStateAction<string>>;
  showErrorText: boolean;
  setShowErrorText: Dispatch<SetStateAction<boolean>>;
  associatedEntryIdHint: string;
  setAssociatedEntryIdHint: Dispatch<SetStateAction<string>>;
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}

export const HintContext = createContext<IHintContext | null>(null);

interface HintProviderProps {
  children: React.ReactNode;
}

export const HintProvider: React.FC<HintProviderProps> = ({ children }) => {
  const [hints, setHints] = useState<IHint[]>([]);
  const [showJudgeHintPopup, setShowJudgeHintPopup] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showErrorText, setShowErrorText] = useState<boolean>(false);
  const [associatedEntryIdHint, setAssociatedEntryIdHint] = useState<string>("");
  const [openedHintId, setOpenedHintId] = useState<string>("");

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

  const updateHint = (hint: IHint) => {
    setHints(hints.map((e) => (e.id === hint.id ? hint : e)));
  };

  return (
    <HintContext.Provider
      value={{
        hints,
        setHints,
        updateHint,
        showJudgeHintPopup,
        setShowJudgeHintPopup,
        contentState,
        editorState,
        setEditorState,
        title,
        setTitle,
        showErrorText,
        setShowErrorText,
        setOpenedHintId,
        openedHintId,
        associatedEntryIdHint,
        setAssociatedEntryIdHint,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </HintContext.Provider>
  );
};

export const useHints = () => {
  const context = useContext(HintContext);
  if (context === null) {
    throw new Error("useHints must be used within an HintProvider");
  }
  return context;
};
