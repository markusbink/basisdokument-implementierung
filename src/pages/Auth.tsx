import cx from "classnames";
import { Upload } from "phosphor-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AboutDevelopersMenu } from "../components/AboutDevelopersMenu";
import { Button } from "../components/Button";
import { useBookmarks, useCase, useHeaderContext, useHints, useNotes, useUser, useSection } from "../contexts";
import { createBasisdokument, createEditFile } from "../data-management/creation-handler";
import { jsonToObject, openBasisdokument, openEditFile, updateSortingsIfVersionIsDifferent } from "../data-management/opening-handler";
import { IStateUserInput, IUser, UsageMode, UserRole } from "../types";
import "react-toastify/dist/ReactToastify.css";

interface AuthProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const Auth: React.FC<AuthProps> = ({ setIsAuthenticated }) => {
  // States for the form
  const [usage, setUsage] = useState<IStateUserInput["usage"]>();
  const [caseId, setCaseId] = useState<IStateUserInput["caseId"]>("");
  const [role, setRole] = useState<IStateUserInput["role"]>();
  const [prename, setPrename] = useState<IStateUserInput["prename"]>("");
  const [surname, setSurname] = useState<IStateUserInput["surname"]>("");
  const [basisdokumentFile, setBasisdokumentFile] = useState<IStateUserInput["basisdokumentFile"]>();
  const [editFile, setEditFile] = useState<IStateUserInput["editFile"]>();
  const [basisdokumentFilename, setBasisdokumentFilename] = useState<IStateUserInput["basisdokumentFile"]>("");
  const [editFilename, setEditFilename] = useState<IStateUserInput["editFile"]>("");
  const [errorText, setErrorText] = useState<IStateUserInput["errorText"]>("");
  const [newVersionMode, setNewVersionMode] = useState<IStateUserInput["newVersionMode"]>(false);

  // Contexts to set the state globally
  const { setCaseId: setCaseIdContext, setEntries, setMetaData, setLitigiousChecks, setCurrentVersion } = useCase();
  const { setVersionHistory, setColorSelection, setCurrentColorSelection } = useHeaderContext();
  const { setSectionList, setIndividualSorting } = useSection();
  const { setNotes } = useNotes();
  const { setHints } = useHints();
  const { setBookmarks } = useBookmarks();
  const { setUser } = useUser();

  const onChangeGivenPrename = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrename(newValue);
  };

  const onChangeGivenSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSurname(newValue);
  };

  const onChangeGivenCaseId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCaseId(newValue);
  };

  // Source: https://stackoverflow.com/questions/71991961/how-to-read-content-of-uploaded-json-file-on-react-next-js
  const handleBasisdokumentFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    try {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      setBasisdokumentFilename(e.target.files[0].name);
      fileReader.onload = (e: any) => {
        let result = e.target.result;
        setBasisdokumentFile(result);
      };
    } catch (error) {}
  };

  const handleEditFileUploadChange = (e: any) => {
    const fileReader = new FileReader();
    try {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      setEditFilename(e.target.files[0].name);
      fileReader.onload = (e: any) => {
        let result = e.target.result;
        setEditFile(result);
      };
    } catch (error) {}
  };

  const validateUserInput = () => {
    // Before checking every user input we set the validation state to true.
    let inputIsValid: boolean = true;

    // check if file exists and validate
    if (usage === UsageMode.Open) {
      if ((!basisdokumentFilename.endsWith(".json") && typeof basisdokumentFile !== "string") || !basisdokumentFile) {
        setErrorText("Bitte laden Sie eine valide Basisdokumentdatei (.json) hoch!");
        inputIsValid = false;
      } else {
        if (jsonToObject(basisdokumentFile).fileType !== "basisdokument") {
          setErrorText("Bitte laden Sie eine valide Basisdokumentdatei (.json) hoch!");
          inputIsValid = false;
        }
      }
      if (editFile) {
        if (!editFilename.endsWith(".json") && typeof editFile !== "string") {
          setErrorText("Bitte laden Sie eine valide Bearbeitungsdatei (.json) hoch!");
          inputIsValid = false;
        } else {
          if (jsonToObject(editFile).fileType !== "editFile") {
            setErrorText("Bitte laden Sie eine valide Bearbeitungsdatei (.json) hoch!");
            inputIsValid = false;
          }
        }
      }
    }
    if (caseId === "" && usage === UsageMode.Create) {
      setErrorText("Bitte geben Sie ein gültiges Aktenzeichen an!");
      inputIsValid = false;
    }

    if (prename === "" || surname === "") {
      setErrorText("Bitte geben Sie sowohl Ihren Vornamen als auch einen Nachnamen an!");
      inputIsValid = false;
    }
    if (!role) {
      setErrorText("Bitte spezifizieren Sie, ob Sie das Basisdokument als Kläger, Beklagter oder Richter bearbeiten möchten!");
      inputIsValid = false;
    }

    if (usage !== UsageMode.Open && usage !== UsageMode.Create) {
      setErrorText("Bitte spezifizieren Sie, ob Sie ein Basisdokument öffnen oder erstellen möchten!");
      inputIsValid = false;
    }

    if (inputIsValid === true) {
      let basisdokumentObject, editFileObject;

      if (usage === UsageMode.Open && typeof basisdokumentFile == "string") {
        basisdokumentObject = openBasisdokument(basisdokumentFile, newVersionMode, prename, surname, role);
        if (editFile) {
          editFileObject = openEditFile(basisdokumentFile, editFile, newVersionMode);
        } else {
          editFileObject = createEditFile(prename, surname, role, basisdokumentObject.caseId, basisdokumentObject.currentVersion);
          editFileObject = updateSortingsIfVersionIsDifferent(basisdokumentObject, editFileObject);
        }
      }

      if (usage === UsageMode.Create) {
        basisdokumentObject = createBasisdokument(prename, surname, role, caseId);
        editFileObject = createEditFile(prename, surname, role, caseId, 1);
        toast("Ihr Basisdokument wurde erfolgreich erstellt!");
      }

      console.log(basisdokumentObject);
      console.log(editFileObject);

      const user: IUser = {
        name: `${prename} ${surname}`,
        role: role!,
      };

      setUser(user);
      setContextFromBasisdokument(basisdokumentObject);
      setContextFromEditFile(editFileObject);

      setIsAuthenticated(true);
    }
  };

  const setContextFromBasisdokument = (basisdokument: any) => {
    setVersionHistory(basisdokument.versions);
    setEntries(basisdokument.entries);
    setSectionList(basisdokument.sections);
    setHints(basisdokument.judgeHints);
    setMetaData(basisdokument.metadata);
    setLitigiousChecks(basisdokument.litigiousChecks);
    setCurrentVersion(basisdokument.currentVersion);
    setCaseIdContext(basisdokument.caseId);
  };

  const setContextFromEditFile = (editFile: any) => {
    setNotes(editFile.notes);
    setBookmarks(editFile.bookmarks);
    setColorSelection(editFile.highlighter);
    setCurrentColorSelection(editFile.highlighter[0]);
    setIndividualSorting(editFile.individualSorting);
  };

  return (
    <div className="overflow-scroll h-full">
      <div className="flex gap-4 max-w-[1080px] m-auto py-20 px-10 space-y-4 flex-col justify-center h-auto overflow-scroll no-scrollbar">
        <AboutDevelopersMenu />
        <h1 className="text-3xl font-bold">Das Basisdokument</h1>
        <p className="text-md text-mediumGrey text-justify">
          Diese Anwendung erlaubt Ihnen das Editieren und Erstellen eines Basisdokuments. Bitte laden Sie den aktuellen Stand des Basisdokuments in Form einer .json-Datei hoch, falls Sie an einer
          Version weiterarbeiten wollen. Um persönliche Daten wie Markierungen, Sortierungen und Lesezeichen zu laden, ist es notwendig, dass Sie auch Ihre persönliche Bearbeitungsdatei hochladen. Das
          Basisdokument verwendet keinen externen Server, um Daten zu speichern. Alle Daten, die Sie hochladen, bleiben <b>im Browser Ihres Computers</b>. Das Basisdokument kann schließlich als .json
          und .pdf exportiert werden und somit an Dritte weitergegeben werden.
        </p>
        <div>
          <p className="font-light">
            Ich möchte ein Basisdokument: <span className="text-darkRed">*</span>
          </p>
          <div className="flex flex-row w-auto mt-4 gap-4">
            <div
              onClick={() => {
                setUsage(UsageMode.Open);
              }}
              className={cx("flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
                "border-2 border-darkGrey": usage === UsageMode.Open,
              })}
            >
              Öffnen
            </div>
            <div
              onClick={() => {
                setUsage(UsageMode.Create);
              }}
              className={cx("flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
                "border-2 border-darkGrey": usage === UsageMode.Create,
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
                setRole(UserRole.Plaintiff);
              }}
              className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
                "border-2 border-darkGrey": role === "Kläger",
              })}
            >
              Kläger
            </div>
            <div
              onClick={() => {
                setRole(UserRole.Defendant);
              }}
              className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
                "border-2 border-darkGrey": role === "Beklagter",
              })}
            >
              Beklagter
            </div>
            <div
              onClick={() => {
                setRole(UserRole.Judge);
              }}
              className={cx("flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer", {
                "border-2 border-darkGrey": role === "Richter",
              })}
            >
              Richter
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
        {usage === UsageMode.Create ? (
          <div>
            <p className="font-light">
              Aktenzeichen diese Basisdokuments: <span className="text-darkRed">*</span>
            </p>
            <div className="flex flex-row w-auto mt-4 gap-4">
              <input className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none" type="text" placeholder="Aktenzeichen..." value={caseId} onChange={onChangeGivenCaseId} />
            </div>
          </div>
        ) : null}
        {usage === UsageMode.Open ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-light">
                Basisdokument-Dateien hochladen: <span className="text-darkRed">*</span>
              </p>
              <div className="flex flex-col items-start w-auto mt-8 mb-8 gap-4">
                <div className="flex flex-row items-center justify-center gap-4">
                  <span className="font-semibold">
                    Basisdokument: <span className="text-darkRed">*</span>
                  </span>
                  <label className="flex items-center justify-center gap-2 cursor-pointer">
                    <input type="file" onChange={handleBasisdokumentFileUploadChange} />
                    <div className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                      <Upload size={24} color={"white"} />
                    </div>
                    <p className="text-black">{basisdokumentFilename}</p>
                  </label>
                </div>
                <div className="flex flex-row items-center justify-center gap-4">
                  <span className="font-semibold">Bearbeitungsdatei:</span>
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

        <div>
          {errorText !== "" ? (
            <div className="flex bg-lightRed p-4 rounded-md">
              <p className="text-darkRed">
                <span className="font-bold">Fehler:</span> {errorText}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flew-row items-end justify-between space-y-2">
          <Button onClick={validateUserInput}>Basisdokument erstellen</Button>
          <p className="text-darkRed font-bold text-sm">* Pflichtfelder</p>
        </div>
      </div>
    </div>
  );
};
