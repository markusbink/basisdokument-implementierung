import cx from "classnames";
import { Trash, Upload, Info } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AboutDevelopersMenu } from "../components/AboutDevelopersMenu";
import { Button } from "../components/Button";
import { Tooltip } from "../components/Tooltip";
import {
  useBookmarks,
  useCase,
  useHeaderContext,
  useHints,
  useNotes,
  useUser,
  useSection,
} from "../contexts";
import {
  createBasisdokument,
  createEditFile,
} from "../data-management/creation-handler";
import {
  jsonToObject,
  openBasisdokument,
  openEditFile,
  updateSortingsIfVersionIsDifferent,
} from "../data-management/opening-handler";
import {
  IStateUserInput,
  IUser,
  SidebarState,
  UsageMode,
  UserRole,
} from "../types";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useOnboarding } from "../contexts/OnboardingContext";
import { VersionPopup } from "../components/VersionPopup";
import { useSidebar } from "../contexts/SidebarContext";

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
  const [basisdokumentFile, setBasisdokumentFile] =
    useState<IStateUserInput["basisdokumentFile"]>();
  const [editFile, setEditFile] = useState<IStateUserInput["editFile"]>();
  const [basisdokumentFilename, setBasisdokumentFilename] =
    useState<IStateUserInput["basisdokumentFile"]>("");
  const [editFilename, setEditFilename] =
    useState<IStateUserInput["editFile"]>("");
  const [errorText, setErrorText] = useState<IStateUserInput["errorText"]>("");
  const [newVersionMode, setNewVersionMode] =
    useState<IStateUserInput["newVersionMode"]>(undefined);
  const [showVersionPopup, setShowVersionPopup] = useState<boolean>(false);
  const [isReadonly] = useState<boolean>(
    window.location.hostname.includes("localhost")
  );

  // Refs
  const basisdokumentFileUploadRef = useRef<HTMLInputElement>(null);
  const editFileUploadRef = useRef<HTMLInputElement>(null);

  // Contexts to set the state globally
  const {
    setCaseId: setCaseIdContext,
    setEntries,
    setMetaData,
    setCurrentVersion,
    setHighlightedEntries,
    setIndividualEntrySorting,
  } = useCase();
  const { setVersionHistory, setColorSelection, setCurrentColorSelection } =
    useHeaderContext();
  const { setSectionList, setIndividualSorting } = useSection();
  const { setNotes } = useNotes();
  const { setHints } = useHints();
  const { setBookmarks } = useBookmarks();
  const { setUser } = useUser();
  const { setIsOnboardingVisible } = useOnboarding();
  const { setActiveSidebar } = useSidebar();

  // Set React states when user enters/changes text input fields
  const onChangeGivenPrename = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPrename(newValue);
  };

  const onChangeGivenSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSurname(newValue);
  };

  const onChangeGivenCaseId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = e.target.value;
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
      e.target.value = "";
      setShowVersionPopup(true);
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
      e.target.value = "";
    } catch (error) {}
  };

  // The onboarding should only be displayed when if the user opens a basisdokument for the first time.
  // It is still possible to access the onboarding via the ?-icon in the header.
  const checkOnboardingShownBefore = () => {
    if (Cookies.get("onboarding") === undefined) {
      Cookies.set("onboarding", "true");
      setIsOnboardingVisible(true);
    }
  };

  const validateUserInput = () => {
    // Before checking every user input we set the validation state to true.
    let inputIsValid: boolean = true;

    // check if file exists and validate
    if (usage === UsageMode.Open || usage === UsageMode.Readonly) {
      if (
        !basisdokumentFilename.endsWith(".txt") ||
        typeof basisdokumentFile !== "string" ||
        !basisdokumentFile
      ) {
        setErrorText(
          "Bitte laden Sie eine valide Basisdokumentdatei (.txt) hoch!"
        );
        inputIsValid = false;
      } else {
        if (jsonToObject(basisdokumentFile).fileType !== "basisdokument") {
          setErrorText(
            "Bitte laden Sie eine valide Basisdokumentdatei (.txt) hoch!"
          );
          inputIsValid = false;
        }
      }
      if (editFile) {
        if (!editFilename.endsWith(".txt") || typeof editFile !== "string") {
          setErrorText(
            "Bitte laden Sie eine valide Bearbeitungsdatei (.txt) hoch!"
          );
          inputIsValid = false;
        } else {
          if (jsonToObject(editFile).fileType !== "editFile") {
            setErrorText(
              "Bitte laden Sie eine valide Bearbeitungsdatei (.txt) hoch!"
            );
            inputIsValid = false;
          }
        }
      }
    }

    if ((prename === "" || surname === "") && usage !== UsageMode.Readonly) {
      setErrorText(
        "Bitte geben Sie sowohl Ihren Vornamen als auch einen Nachnamen an!"
      );
      inputIsValid = false;
    }
    if (!role) {
      setErrorText(
        "Bitte spezifizieren Sie, ob Sie das Basisdokument als Klagepartei, Beklagtenpartei oder Richter:in bearbeiten möchten!"
      );
      inputIsValid = false;
    }

    if (
      usage !== UsageMode.Open &&
      usage !== UsageMode.Create &&
      usage !== UsageMode.Readonly
    ) {
      setErrorText(
        "Bitte spezifizieren Sie, ob Sie ein Basisdokument öffnen, erstellen oder einsehen möchten!"
      );
      inputIsValid = false;
    }

    if (inputIsValid === true) {
      let basisdokumentObject, editFileObject;

      if (
        (usage === UsageMode.Open || usage === UsageMode.Readonly) &&
        typeof basisdokumentFile == "string"
      ) {
        basisdokumentObject = openBasisdokument(
          basisdokumentFile,
          newVersionMode,
          prename,
          surname,
          role
        );
        if (editFile) {
          editFileObject = openEditFile(
            basisdokumentFile,
            editFile,
            newVersionMode
          );
        } else {
          editFileObject = createEditFile(
            prename,
            surname,
            role,
            basisdokumentObject.caseId,
            basisdokumentObject.currentVersion
          );

          editFileObject = updateSortingsIfVersionIsDifferent(
            basisdokumentObject,
            editFileObject
          );
        }
      }

      if (usage === UsageMode.Create) {
        basisdokumentObject = createBasisdokument(
          prename,
          surname,
          role,
          caseId
        );
        editFileObject = createEditFile(prename, surname, role, caseId, 1);
        toast("Ihr Basisdokument wurde erfolgreich erstellt!");
      }

      const user: IUser = {
        name: `${prename} ${surname}`,
        role: role!,
      };

      setUser(user);
      setContextFromBasisdokument(basisdokumentObject);
      setContextFromEditFile(editFileObject);
      checkOnboardingShownBefore();
      setIsAuthenticated(true);
    }
  };

  // The imported data from the files is then merged into a React state (context provider).
  const setContextFromBasisdokument = (basisdokument: any) => {
    setVersionHistory(basisdokument.versions);
    setEntries(basisdokument.entries);
    setSectionList(basisdokument.sections);
    setHints(basisdokument.judgeHints);
    setMetaData(basisdokument.metaData);
    setCurrentVersion(basisdokument.currentVersion);
    setCaseIdContext(basisdokument.caseId);
  };

  const setContextFromEditFile = (editFile: any) => {
    setNotes(editFile.notes);
    setBookmarks(editFile.bookmarks);
    setColorSelection(editFile.highlighter);
    setCurrentColorSelection(editFile.highlighter[0]);
    setIndividualSorting(editFile.individualSorting);
    setHighlightedEntries(editFile.highlightedEntries);
    setIndividualEntrySorting(editFile.individualEntrySorting);
  };

  const setReadonly = () => {
    if (usage !== UsageMode.Readonly) {
      setErrorText("");
    }
    setUsage(UsageMode.Readonly);
    setRole(UserRole.Client);
    setNewVersionMode(false);
    setActiveSidebar(SidebarState.Sorting);
  };

  useEffect(() => {
    if (isReadonly) {
      setReadonly();
    }
  });

  return (
    <div className="overflow-scroll h-full">
      <div className="flex gap-4 max-w-[1080px] m-auto py-20 px-10 space-y-4 flex-col justify-center h-auto overflow-scroll no-scrollbar">
        <AboutDevelopersMenu />
        <h1 className="text-3xl font-bold">Das Basisdokument</h1>
        {isReadonly ? (
          <p className="text-md text-mediumGrey text-justify">
            Diese Anwendung erlaubt Ihnen als Mandant:in das Einsehen eines
            Basisdokuments. Dafür laden Sie bitte die .txt-Datei hoch, die Ihnen
            Ihr Anwältin oder Ihr Anwalt zugesendet hat.
          </p>
        ) : (
          <p className="text-md text-mediumGrey text-justify">
            Diese Anwendung erlaubt Ihnen das Editieren und Erstellen eines
            Basisdokuments. Bitte laden Sie den aktuellen Stand des
            Basisdokuments in Form einer .txt-Datei hoch, falls Sie an einer
            Version weiterarbeiten wollen. Um persönliche Daten wie
            Markierungen, Sortierungen und Lesezeichen zu laden, ist es
            notwendig, dass Sie auch Ihre persönliche Bearbeitungsdatei
            hochladen. Das Basisdokument verwendet keinen externen Server, um
            Daten zu speichern. Alle Daten, die Sie hochladen, bleiben{" "}
            <b>im Browser Ihres Computers</b>. Das Basisdokument kann
            schließlich als .txt und .pdf exportiert werden und somit an Dritte
            weitergegeben werden.
          </p>
        )}
        <div>
          <p className="font-light">
            Ich möchte ein Basisdokument:{" "}
            <span className="text-darkRed">*</span>
          </p>
          <div className="flex flex-row w-auto mt-4 gap-4">
            {!isReadonly && (
              <>
                <button
                  onClick={() => {
                    if (usage !== UsageMode.Open) {
                      setErrorText("");
                    }
                    setUsage(UsageMode.Open);
                  }}
                  className={cx(
                    "flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                    {
                      "border-2 border-darkGrey": usage === UsageMode.Open,
                    }
                  )}>
                  Öffnen
                </button>
                <button
                  onClick={() => {
                    if (usage !== UsageMode.Create) {
                      setErrorText("");
                    }
                    setUsage(UsageMode.Create);
                  }}
                  className={cx(
                    "flex items-center justify-center w-[100px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                    {
                      "border-2 border-darkGrey": usage === UsageMode.Create,
                    }
                  )}>
                  Erstellen
                </button>
              </>
            )}
            <button
              onClick={() => {
                setReadonly();
              }}
              className={cx(
                "flex items-center justify-center w-fit px-5 h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                {
                  "border-2 border-darkGrey": usage === UsageMode.Readonly,
                }
              )}>
              Einsehen (als Mandant:in)
            </button>
          </div>
        </div>

        {usage !== UsageMode.Readonly && (
          <div className="flex gap-8 flex-col">
            <div>
              <p className="font-light">
                Ich möchte das Basisdokument bearbeiten in der Funktion:{" "}
                <span className="text-darkRed">*</span>
              </p>
              <div className="flex flex-row w-auto mt-4 gap-4">
                <button
                  onClick={() => {
                    setRole(UserRole.Plaintiff);
                  }}
                  className={cx(
                    "flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                    {
                      "border-2 border-darkGrey": role === UserRole.Plaintiff,
                    }
                  )}>
                  {UserRole.Plaintiff}
                </button>
                <button
                  onClick={() => {
                    setRole(UserRole.Defendant);
                  }}
                  className={cx(
                    "flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                    {
                      "border-2 border-darkGrey": role === UserRole.Defendant,
                    }
                  )}>
                  {UserRole.Defendant}
                </button>
                <button
                  onClick={() => {
                    setRole(UserRole.Judge);
                  }}
                  className={cx(
                    "flex items-center justify-center w-[150px] h-[50px] font-bold rounded-md bg-offWhite hover:bg-lightGrey hover:cursor-pointer",
                    {
                      "border-2 border-darkGrey": role === UserRole.Judge,
                    }
                  )}>
                  {UserRole.Judge}
                </button>
              </div>
            </div>
            <div>
              <p className="font-light">
                Ich möchte das Basisdokument bearbeiten als:{" "}
                <span className="text-darkRed">*</span>
              </p>
              <div className="flex flex-row w-auto mt-4 gap-4">
                <input
                  className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none"
                  type="text"
                  placeholder="Vorname..."
                  value={prename}
                  onChange={onChangeGivenPrename}
                />
                <input
                  className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none"
                  type="text"
                  placeholder="Nachname..."
                  value={surname}
                  onChange={onChangeGivenSurname}
                />
              </div>
            </div>
          </div>
        )}
        {usage === UsageMode.Create ? (
          <div>
            <p className="font-light">Aktenzeichen dieses Basisdokuments: </p>
            <div className="flex flex-row w-auto mt-4 gap-4">
              <input
                className="p-2 pl-3 pr-3 h-[50px] bg-offWhite rounded-md outline-none"
                type="text"
                placeholder="Aktenzeichen..."
                value={caseId}
                onChange={onChangeGivenCaseId}
              />
            </div>
          </div>
        ) : null}
        {usage === UsageMode.Open || usage === UsageMode.Readonly ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-light">
                Basisdokument-Dateien hochladen:{" "}
                <span className="text-darkRed">*</span>
              </p>
              <div className="flex flex-col items-start w-auto mt-8 mb-8 gap-4">
                <div className="flex flex-row items-center justify-center gap-2">
                  <div className="flex flex-row gap-0.5">
                    <span className="font-semibold">
                      Basisdokument: <span className="text-darkRed">*</span>
                    </span>
                    <Tooltip
                      text="Bitte Basisdokument txt-Datei hochladen, z.B. basisdokument_version_1_az_... .txt"
                      position="top"
                      delayDuration={0}
                      disabled={true}>
                      <Info size={18} color={"slateGray"} />
                    </Tooltip>
                  </div>
                  <div className="bg-offWhite rounded-md pl-3 pr-3 p-2 flex flex-row gap-2">
                    <label
                      role="button"
                      className="flex items-center justify-center gap-2 cursor-pointer">
                      <input
                        ref={basisdokumentFileUploadRef}
                        type="file"
                        onChange={handleBasisdokumentFileUploadChange}
                      />
                      {basisdokumentFilename}
                      <button
                        onClick={() => {
                          basisdokumentFileUploadRef?.current?.click();
                        }}
                        className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                        <Upload size={24} color={"white"} />
                      </button>
                    </label>
                    {basisdokumentFilename && (
                      <button
                        onClick={() => {
                          setBasisdokumentFilename("");
                          setBasisdokumentFile(undefined);
                        }}
                        className="bg-lightRed hover:bg-marker-red rounded-md p-1">
                        <Trash size={24} color={"darkRed"} />
                      </button>
                    )}
                  </div>
                </div>
                {usage === UsageMode.Open && (
                  <div className="flex flex-row items-center justify-center gap-3">
                    <div className="flex flex-row gap-0.5">
                      <span className="font-semibold">Bearbeitungsdatei:</span>
                      <Tooltip
                        text="Bitte Bearbeitungsdatei.txt hochladen, z.B. bearbeitungsdatei_version_1_az_... .txt"
                        position="bottom"
                        delayDuration={0}
                        disabled={true}>
                        <Info
                          className="pointer-events-none"
                          size={18}
                          color={"slateGray"}
                        />
                      </Tooltip>
                    </div>
                    <div className="bg-offWhite rounded-md pl-3 pr-3 p-2 flex flex-row gap-2">
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          ref={editFileUploadRef}
                          type="file"
                          onChange={handleEditFileUploadChange}
                        />
                        {editFilename}
                        <button
                          onClick={() => {
                            editFileUploadRef?.current?.click();
                          }}
                          className="bg-darkGrey hover:bg-mediumGrey rounded-md pl-2 pr-2 p-1">
                          <Upload size={24} color={"white"} />
                        </button>
                      </label>
                      {editFilename && (
                        <button
                          onClick={() => {
                            setEditFilename("");
                            setEditFile(undefined);
                          }}
                          className="bg-lightRed hover:bg-marker-red rounded-md p-1">
                          <Trash size={24} color={"darkRed"} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {usage === UsageMode.Open && (
              <div className="flex flex-row items-center gap-4">
                <VersionPopup
                  isVisible={showVersionPopup}
                  children={
                    <>
                      <Button
                        bgColor="bg-offWhite hover:bg-lightGrey"
                        textColor="text-black font-bold"
                        onClick={() => {
                          setShowVersionPopup(!showVersionPopup);
                          setNewVersionMode(false);
                        }}>
                        Die hochgeladene Datei stammt von meiner Partei
                      </Button>
                      <Button
                        bgColor="bg-offWhite hover:bg-lightGrey"
                        textColor="text-black font-bold"
                        onClick={() => {
                          setShowVersionPopup(!showVersionPopup);
                          setNewVersionMode(true);
                        }}>
                        Die hochgeladene Datei stammt von einer anderen Partei
                      </Button>
                    </>
                  }
                />

                {newVersionMode && (
                  <span className="text-base text-black">
                    Mit dem Öffnen wird eine neue Version erstellt, da Sie das
                    hochgeladene Dokument von einer anderen Partei erhalten und
                    noch nicht editiert haben.{" "}
                    <u
                      className="hover:font-bold hover:cursor-pointer"
                      onClick={() => {
                        setShowVersionPopup(true);
                      }}>
                      Ändern.
                    </u>
                  </span>
                )}
                {newVersionMode === false && (
                  <span className="text-base text-black">
                    Mit dem Öffnen wird keine neue Version erstellt, da das
                    hochgeladene Dokument von Ihrer Partei stammt. Sie editieren
                    weiterhin die aktuelle Version.{" "}
                    <u
                      className="hover:font-bold hover:cursor-pointer"
                      onClick={() => {
                        setShowVersionPopup(true);
                      }}>
                      Ändern.
                    </u>
                  </span>
                )}
              </div>
            )}
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
          <Button onClick={validateUserInput}>
            Basisdokument{" "}
            {usage === UsageMode.Open
              ? "öffnen"
              : usage === UsageMode.Create
              ? "erstellen"
              : "einsehen"}
          </Button>
          <p className="text-darkRed font-bold text-sm">* Pflichtfelder</p>
        </div>
      </div>
    </div>
  );
};
