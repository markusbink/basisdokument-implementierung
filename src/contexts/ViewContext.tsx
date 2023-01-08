import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { ViewMode } from "../types";

interface IViewContext {
  view: ViewMode;
  setView: Dispatch<SetStateAction<ViewMode>>;
}

export const ViewContext = createContext<IViewContext | null>(null);

interface ViewProviderProps {
  children: React.ReactNode;
}

export const ViewProvider: React.FC<ViewProviderProps> = ({ children }) => {
  const [view, setView] = useState<ViewMode>(ViewMode.Columns);

  return (
    <ViewContext.Provider
      value={{
        view,
        setView,
      }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (context === null) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};
