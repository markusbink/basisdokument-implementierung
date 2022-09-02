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

interface ISidebar {
  name: string;
  jsxElem: JSX.Element;
}

const sidebars: ISidebar[] = [
  {
    name: "Notes",
    jsxElem: <SidebarNotes key="Notes"></SidebarNotes>,
  },
  {
    name: "Hints",
    jsxElem: <SidebarHints key="Hints"></SidebarHints>,
  },
  {
    name: "Bookmarks",
    jsxElem: <SidebarBookmarks key="Bookmarks"></SidebarBookmarks>,
  },
];

interface ISidebarContext {
  sidebars: ISidebar[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  activeSidebar: string;
  setActiveSidebar: Dispatch<SetStateAction<string>>;
}

export const SidebarContext = createContext<ISidebarContext | null>(null);

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeSidebar, setActiveSidebar] = useState<string>(sidebars[0].name);
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
