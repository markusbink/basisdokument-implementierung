import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface IPatchnotesContext {
  showPatchnotesPopup: boolean;
  setShowPatchnotesPopup: Dispatch<SetStateAction<boolean>>;
}

export const PatchnotesContext = createContext<IPatchnotesContext | null>(null);

interface PatchnotesProviderProps {
  children: React.ReactNode;
}

export const PatchnotesProvider: React.FC<PatchnotesProviderProps> = ({
  children,
}) => {
  const [showPatchnotesPopup, setShowPatchnotesPopup] =
    useState<boolean>(false);

  return (
    <PatchnotesContext.Provider
      value={{
        showPatchnotesPopup,
        setShowPatchnotesPopup,
      }}>
      {children}
    </PatchnotesContext.Provider>
  );
};

export const usePatchnotes = () => {
  const context = useContext(PatchnotesContext);
  if (context === null) {
    throw new Error("usePatchnotes must be used within an PatchnotesProvider");
  }
  return context;
};
