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
}

export const HintContext = createContext<IHintContext | null>(null);

interface hintProviderProps {
  children: React.ReactNode;
}

export const HintProvider: React.FC<hintProviderProps> = ({ children }) => {
  const [hints, setHints] = useState<IHint[]>([]);

  const updateHint = (hint: IHint) => {
    setHints(hints.map((e) => (e.id === hint.id ? hint : e)));
  };

  return (
    <HintContext.Provider
      value={{
        hints,
        setHints,
        updateHint,
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
