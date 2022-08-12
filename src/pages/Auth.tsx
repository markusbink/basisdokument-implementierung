import { Button } from "../components/Button";

interface AuthProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  return (
    <div className="max-w-[1080px] m-auto py-20 px-10 space-y-4 flex flex-col justify-center h-full">
      <h1 className="text-xl font-bold">Das Basisdokument</h1>
      <p>
        Diese Anwendung erlaubt Ihnen das Editieren des Basisdokuments. Bitte
        laden Sie den aktuellen Stand des Basisdokuments in Form einer
        .json-Datei hoch, falls Sie an einer Version weiterarbeiten wollen. Um
        persönliche Daten wie Markierungen, Sortierungen und Lesezeichen zu
        speichern, ist es notwendig, dass Sie auch Ihre persönliche
        Bearbeitungsdatei hochladen.
      </p>
      <div className="space-y-2">
        <Button onClick={() => setIsAuthenticated(true)}>
          Basisdokument erstellen
        </Button>
      </div>
    </div>
  );
};
