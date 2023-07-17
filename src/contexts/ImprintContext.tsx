import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface IImprintContext {
  showImprintPopup: boolean;
  setShowImprintPopup: Dispatch<SetStateAction<boolean>>;
}

export const ImprintContext = createContext<IImprintContext | null>(null);

interface ImprintProviderProps {
  children: React.ReactNode;
}

export const ImprintProvider: React.FC<ImprintProviderProps> = ({
  children,
}) => {
  const [showImprintPopup, setShowImprintPopup] = useState<boolean>(false);

  return (
    <ImprintContext.Provider
      value={{
        showImprintPopup,
        setShowImprintPopup,
      }}>
      {children}
    </ImprintContext.Provider>
  );
};

export const useImprint = () => {
    const context = useContext(ImprintContext);
    if (context === null) {
      throw new Error("useImprint must be used within an ImprintProvider");
    }
    return context;
  };
