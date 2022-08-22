import { useState } from "react";
import { Button } from "../components/Button";
import cx from "classnames";
import { Upload } from "phosphor-react";

interface AuthProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface IStateUserInput {
  usage: "open" | "create" | undefined;
  party: "defendant" | "plaintiff" | "judge" | undefined;
  prename: string;
  surname: string;
  basisdokumentFile: string;
  editFile: string;
  basisdokumentFilename: string;
  editFilename: string;
  errorText: string;
  newVersionMode: boolean;
}

export const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  const [usage, setUsage] = useState<IStateUserInput["usage"]>();
  const [party, setParty] = useState<IStateUserInput["party"]>();
  const [prename, setPrename] = useState<IStateUserInput["prename"]>("");
  const [surname, setSurname] = useState<IStateUserInput["surname"]>("");
  const [basisdokumentFile, setBasisdokumentFile] = useState<IStateUserInput["basisdokumentFile"]>();
  const [editFile, setEditFile] = useState<IStateUserInput["editFile"]>();
  const [basisdokumentFilename, setBasisdokumentFilename] = useState<IStateUserInput["basisdokumentFile"]>("");
  const [editFilename, setEditFilename] = useState<IStateUserInput["editFile"]>("");
  const [errorText, setErrorText] = useState<IStateUserInput["errorText"]>("");
  const [newVersionMode, setNewVersionMode] = useState<IStateUserInput["newVersionMode"]>(false);

  const onChangeGivenPrename = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrename(newValue);
  };

  const onChangeGivenSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setBasisdokumentFile(result);
    };
  };

  const handleEditFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    setEditFilename(e.target.files[0].name);
    fileReader.onload = (e: any) => {
      const result = e.target.result;
      setEditFile(result);
    };
  };

  const validateUserInput = () => {
    // Before checking every user input we set the validation state to true.
    var inputIsValid: boolean = true;

    // check if file exists and validate
    if (!basisdokumentFilename.endsWith(".json")) {
      setErrorText("Bitte laden Sie eine valide Bearbeitungs-Datei (.json) hoch!");
      inputIsValid = false;
    }
    if (!editFilename.endsWith(".json")) {
      setErrorText("Bitte laden Sie eine valide Basisdokument-Datei (.json) hoch!");
      inputIsValid = false;
    }
    if (prename === "" && surname === "") {
      setErrorText("Bitte geben Sie sowohl Ihren Vornamen als auch einen Nachnamen an!");
      inputIsValid = false;
    }
    if (party === undefined) {
      setErrorText("Bitte spezifizieren Sie, ob Sie das Basidokument als Klagepartei, Beklagtenpartei, Richter:in bearbeiten möchten!");
      inputIsValid = false;
    }
    if (usage === undefined) {
      setErrorText("Bitte spezifizieren Sie, ob Sie ein Basisdokument öffnen oder schließen möchten!");
      inputIsValid = false;
    }

    if (inputIsValid === true) {
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="flex gap-4 max-w-[1080px] m-auto py-20 px-10 space-y-4 flex flex-col justify-center h-auto overflow-scroll no-scrollbar">
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
              "border-2 border-darkGrey": usage === "open",
            })}
          >
            Öffnen
          </div>
          <div
            onClick={() => {
              setUsage("create");
            }}
            className={cx("flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2 border-darkGrey": usage === "create",
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
              "border-2 border-darkGrey": party === "plaintiff",
            })}
          >
            Klagepartei
          </div>
          <div
            onClick={() => {
              setParty("defendant");
            }}
            className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2 border-darkGrey": party === "defendant",
            })}
          >
            Beklatenpartei
          </div>
          <div
            onClick={() => {
              setParty("judge");
            }}
            className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
              "border-2 border-darkGrey": party === "judge",
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
          <input className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none" type="text" placeholder="Vorname..." value={prename} onChange={onChangeGivenPrename} />
          <input className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none" type="text" placeholder="Nachname..." value={surname} onChange={onChangeGivenSurname} />
        </div>
      </div>
      {usage === "open" ? (
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-light">
              Basisdokument-Dateien hochladen: <span className="text-darkRed">*</span>
            </p>
            <div className="flex flex-col items-start w-auto mt-8 mb-8 gap-4">
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="font-semibold">Basisdokument:</p>
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input type="file" onChange={handleBasisdokumentFileUploadChange} />
                  <div className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                    <Upload size={24} color={"white"} />
                  </div>
                  <p className="text-black">{basisdokumentFilename}</p>
                </label>
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                <p className="font-semibold">Bearbeitungsdatei:</p>
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <input type="file" onChange={handleEditFileUploadChange} />
                  <div className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                    <Upload size={24} color={"white"} />
                  </div>
                  <p className="text-black">{editFilename}</p>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <input className="w-20 accent-darkGrey" type="checkbox" defaultChecked={newVersionMode} onChange={() => setNewVersionMode(!newVersionMode)} />
            <div>
              <p className="font-extrabold">
                Ich möchte eine neue Version auf Basis der hochgeladenen Version erstellen. <span className="text-darkRed">*</span>
              </p>
              <p className="font-light text-mediumGrey">
                Setzen Sie hier einen Haken, wenn Sie die Version des Basisdokuments, die Sie hochladen, zuvor von einer anderen Partei erhalten und noch nicht editiert haben.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {errorText !== "" ? (
        <div className="flex bg-lightRed p-4 rounded-md">
          <p className="text-darkRed">
            <span className="font-bold">Fehler:</span> {errorText}
          </p>
        </div>
      ) : null}
      <div className="space-y-2">
        <Button onClick={validateUserInput}>Basisdokument erstellen</Button>
      </div>
    </div>
  );
};
