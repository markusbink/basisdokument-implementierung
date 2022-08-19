import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { Button } from "../components/Button";
import cx from "classnames";
import { Upload } from "phosphor-react";

interface AuthProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface IStateUserInput {
  usage: "open" | "create" | undefined;
  party: "defendant" | "plaintiff" | "judge" | undefined;
  prename: string | undefined;
  surname: string | undefined;
  basisdokumentFile: string;
  editFile: string;
  basisdokumentFilename: string;
  editFilename: string;
}

export const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [usage, setUsage] = useState<IStateUserInput["usage"]>();
  const [party, setParty] = useState<IStateUserInput["party"]>();
  const [prename, setPrename] = useState<IStateUserInput["prename"]>();
  const [surname, setSurname] = useState<IStateUserInput["surname"]>();
  const [basisdokumentFile, setBasisdokumentFile] = useState<IStateUserInput["basisdokumentFile"]>();
  const [editFile, setEditFile] = useState<IStateUserInput["editFile"]>();
  const [basisdokumentFilename, setBasisdokumentFilename] = useState<IStateUserInput["basisdokumentFile"]>("");
  const [editFilename, setEditFilename] = useState<IStateUserInput["editFile"]>();

  const onChangePrename = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrename(newValue);
  };

  const onChangeSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSurname(newValue);
  };

  // Source: https://stackoverflow.com/questions/71991961/how-to-read-content-of-uploaded-json-file-on-react-next-js
  const handleBasisdokumentFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    setBasisdokumentFilename(e.target.files[0].name);
    fileReader.onload = (e: any) => {
      const result = e.target.result;
      setBasisdokumentFile(e.target.result);
    };
  };

  const handleEditFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    setEditFilename(e.target.files[0].name);
    fileReader.onload = (e: any) => {
      const result = e.target.result;
      setEditFile(e.target.result);
    };
  };

  return (
    <div className="flex gap-4 max-w-[1080px] m-auto py-20 px-10 space-y-4 flex flex-col justify-center h-full">
      <h1 className="text-3xl font-bold">Das Basisdokument</h1>
      <p className="text-md text-mediumGrey">
        Diese Anwendung erlaubt Ihnen das Editieren des Basisdokuments. Bitte laden Sie den aktuellen Stand des Basisdokuments in Form einer .json-Datei hoch, falls Sie an einer Version weiterarbeiten
        wollen. Um persönliche Daten wie Markierungen, Sortierungen und Lesezeichen zu speichern, ist es notwendig, dass Sie auch Ihre persönliche Bearbeitungsdatei hochladen.
      </p>
      <div>
        <p className="font-light">
          Ich möchte ein Basisdokument: <span className="text-darkRed">*</span>
        </p>
        <div className="flex flex-row w-auto mt-4 gap-4">
          <div
            onClick={() => {
              setUsage("open");
            }}
            className={cx("flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2": usage === "open",
            })}
          >
            Öffnen
          </div>
          <div
            onClick={() => {
              setUsage("create");
            }}
            className={cx("flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2": usage === "create",
            })}
          >
            Erstellen
          </div>
        </div>
      </div>
      <div>
        <p className="font-light">
          Ich möchte das Basisdokument bearbeiten in der Funktion: <span className="text-darkRed">*</span>
        </p>
        <div className="flex flex-row w-auto mt-4 gap-4">
          <div
            onClick={() => {
              setParty("plaintiff");
            }}
            className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2": party === "plaintiff",
            })}
          >
            Klagepartei
          </div>
          <div
            onClick={() => {
              setParty("defendant");
            }}
            className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2": party === "defendant",
            })}
          >
            Beklatenpartei
          </div>
          <div
            onClick={() => {
              setParty("judge");
            }}
            className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2": party === "judge",
            })}
          >
            Richter:in
          </div>
        </div>
      </div>
      <div>
        <p className="font-light">
          Ich möchte das Basisdokument bearbeiten als: <span className="text-darkRed">*</span>
        </p>
        <div className="flex flex-row w-auto mt-4 gap-4">
          <input className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none" type="text" placeholder="Vorname..." value={prename} onChange={onChangePrename} />
          <input className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none" type="text" placeholder="Nachname..." value={surname} onChange={onChangeSurname} />
        </div>
      </div>
      <div>
        <p className="font-light">
          Basisdokument-Dateien hochladen: <span className="text-darkRed">*</span>
        </p>
        <div className="flex flex-col items-start w-auto mt-4 gap-4">
          <div className="flex flex-row items-center justify-center gap-4">
            <p className="font-semibold">Basisdokument:</p>
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <input type="file" onChange={handleBasisdokumentFileUploadChange} />
              <div className="bg-darkGrey rounded-md pl-2 pr-2 p-1">
                <Upload size={24} color={"white"} />
              </div>
              <p className="text-black">{basisdokumentFilename}</p>
            </label>
          </div>
          <div className="flex flex-row items-center justify-center gap-4">
            <p className="font-semibold">Bearbeitungsdatei:</p>
            <label className="flex items-center justify-center gap-2 cursor-pointer">
              <input type="file" onChange={handleEditFileUploadChange} />
              <div className="bg-darkGrey rounded-md pl-2 pr-2 p-1">
                <Upload size={24} color={"white"} />
              </div>
              <p className="text-black">{editFilename}</p>
            </label>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Button onClick={() => setIsAuthenticated(true)}>Basisdokument erstellen</Button>
      </div>
    </div>
  );
};
