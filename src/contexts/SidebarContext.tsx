import {
  Notepad,
  Scales,
  Bookmarks,
  ListNumbers,
  Paperclip,
} from "phosphor-react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { SidebarBookmarks } from "../components/sidebar/SidebarBookmarks";
import { SidebarHints } from "../components/sidebar/SidebarHints";
import { SidebarNotes } from "../components/sidebar/SidebarNotes";
import { SidebarSorting } from "../components/sidebar/SidebarSorting";
import { ISidebar, SidebarState } from "../types";
import { SidebarEvidences } from "../components/sidebar/SidebarEvidences";

const sidebars: ISidebar[] = [
  {
    name: SidebarState.Sorting,
    jsxElem: (
      <SidebarSorting key={SidebarState.Sorting.toString()}></SidebarSorting>
    ),
    icon: <ListNumbers size={20} />,
  },
  {
    name: SidebarState.Notes,
    jsxElem: <SidebarNotes key={SidebarState.Notes.toString()}></SidebarNotes>,
    icon: <Notepad size={20} />,
  },
  {
    name: SidebarState.Hints,
    jsxElem: <SidebarHints key={SidebarState.Hints.toString()}></SidebarHints>,
    icon: <Scales size={20} />,
  },
  {
    name: SidebarState.Bookmarks,
    jsxElem: (
      <SidebarBookmarks
        key={SidebarState.Bookmarks.toString()}></SidebarBookmarks>
    ),
    icon: <Bookmarks size={20} />,
  },
  {
    name: SidebarState.Evidences,
    jsxElem: (
      <SidebarEvidences
        key={SidebarState.Evidences.toString()}></SidebarEvidences>
    ),
    icon: <Paperclip size={20} />,
  },
];

interface ISidebarContext {
  sidebars: ISidebar[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  activeSidebar: SidebarState;
  setActiveSidebar: Dispatch<SetStateAction<SidebarState>>;
}

export const SidebarContext = createContext<ISidebarContext | null>(null);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeSidebar, setActiveSidebar] = useState<SidebarState>(
    sidebars[0].name
  );
  return (
    <SidebarContext.Provider
      value={{
        sidebars,
        isSidebarOpen,
        setIsSidebarOpen,
        activeSidebar,
        setActiveSidebar,
      }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === null) {
    throw new Error("useContext must be used within an SidebarProvider");
  }
  return context;
};
