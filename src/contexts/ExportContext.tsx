import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface IExportContext {
    isExportPopupOpen: boolean;
    setIsExportPopupOpen: Dispatch<SetStateAction<boolean>>;
}

export const ExportContext = createContext<IExportContext | null>(null);

interface ExportProviderProps {
    children: React.ReactNode;
}

export const ExportProvider: React.FC<ExportProviderProps> = ({ children }) => {
    const [isExportPopupOpen, setIsExportPopupOpen] = useState<boolean>(false);

    return (
        <ExportContext.Provider
            value={{isExportPopupOpen, setIsExportPopupOpen}}
        >
            {children}
        </ExportContext.Provider>
    )
};

export const useExport = () => {
    const context = useContext(ExportContext);
    if (context === null) {
        throw new Error("useExport must be used within an ExportProvider");
      }
      return context;
};