import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

interface IExportContext {
    isExportPopupOpen: boolean;
    setIsExportPopupOpen: Dispatch<SetStateAction<boolean>>;
    coverPDF: any;
    setCoverPDF: Dispatch<SetStateAction<any>>;
}

export const ExportContext = createContext<IExportContext | null>(null);

interface ExportProviderProps {
    children: React.ReactNode;
}

export const ExportProvider: React.FC<ExportProviderProps> = ({ children }) => {
    const [isExportPopupOpen, setIsExportPopupOpen] = useState<boolean>(false);
    const [coverPDF, setCoverPDF] = useState<any>();

    return (
        <ExportContext.Provider
            value={{isExportPopupOpen, setIsExportPopupOpen, coverPDF, setCoverPDF}}
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