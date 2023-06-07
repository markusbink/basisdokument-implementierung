import { X } from "phosphor-react";
import { usePatchnotes } from "../contexts/PatchnotesContext";
import cx from "classnames";
import { useState } from "react";

export const PatchnotesPopup = () => {
  const { setShowPatchnotesPopup } = usePatchnotes();
  var [currentPatchnote, setCurrentPatchnote] = useState<string>("2.0.1");
  var [patchnoteContent, setPatchnoteContent] = useState<string>(
    `<h5 className="opacity-70">09. Mai 2023</h5>
    <h3>Basisdokument Version 2.0.1</h3>
    <div className="flex flex-col gap-2 mt-3">
      <div>
        <h4 className="font-semibold">Neue Funktionen:</h4>
        <ul>
        <li>Aktualisiertes Onboarding mit allen neuen Funktionen</li>
        <li>Neues Basisdokument <a href="https://www.uni-regensburg.de/forschung/reallabor-informationen/wiki/index.html" target="_blank">Wiki</a> mit allen Funktionen</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">Funktionen in Arbeit:</h4>
        <ul>
        <li>Eigener Bereich für Beweise</li>
        <li>Übersichtliche Darstellung von bezugnehmenden Beiträgen</li>
        <li>Erweiterte Exportfunktionen</li>
        </ul>
      </div>
    </div>`
  );

  function switchPatchnoteContent(contentKey: string) {
    switch (true) {
      case /1.0.0/.test(contentKey):
        setPatchnoteContent(
          `<h5 className="opacity-70">20. Februar 2023</h5>
           <h3>Basisdokument Version 1.0.0</h3>
           <div className="flex flex-col gap-2 mt-2">
             <div>
               <h4 className="font-semibold">Neue Funktionen:</h4>
               <ul>
                 <li>Basisdokument erstellen</li>
                 <li>Basisdokument öffnen</li>
                 <li>Basisdokument herunterladen</li>
                 <li>Gliederungspunkte hinzufügen, umbenennen, löschen</li>
                 <li>Sortierung: Original/Privat</li>
                 <li>Versionierung</li>
                 <li>Beiträge hinzufügen, bearbeiten, löschen</li>
                 <li>Beiträge mit Bezug hinzufügen, bearbeiten, löschen</li>
                 <li>Darstellungen: Side-by-Side, Spalten, Zeilen</li>
                 <li>Strittigkeitsansicht für Richter</li>
                 <li>Hinweise erstellen, bearbeiten, löschen</li>
                 <li>Notizen erstellen, bearbeiten, löschen</li>
                 <li>Lesezeichen erstellen, bearbeiten, löschen</li>
                 <li>Markierungen: Farben auswählen und benennen</li>
                 <li>Markierungen: Im Fließtext markieren und Markierungen löschen</li>
                 <li>Markierungen: Nach Markierungen filtern</li>
                 <li>Suchfunktion</li>
                 <li>Hilfe/Onboarding</li>
                 <li>Erscheinungsbild anpassen</li>
               </ul>
             </div>
           </div>`
        );
        setCurrentPatchnote("1.0.0");
        break;
      case /1.0.1/.test(contentKey):
        setPatchnoteContent(
          `<h5 className="opacity-70">25. Februar 2023</h5>
            <h3>Basisdokument Version 1.0.1</h3>
            <div className="flex flex-col gap-2 mt-2">
              <div>
                <h4 className="font-semibold">Behobene Fehler:</h4>
                <ul>
                  <li>Speicherung der Daten als txt statt json</li>
                  <li>Hinweis für Versionierung umformuliert</li>
                </ul>
              </div>
            </div>`
        );
        setCurrentPatchnote("1.0.1");
        break;
      case /1.0.2/.test(contentKey):
        setPatchnoteContent(
          `<h5 className="opacity-70">02. März 2023</h5>
            <h3>Basisdokument Version 1.0.2</h3>
            <div className="flex flex-col gap-2 mt-2">
              <div>
                <h4 className="font-semibold">Behobene Fehler:</h4>
                <ul>
                  <li>Angepasste Benennung der Exportdateien</li>
                </ul>
              </div>
            </div>`
        );
        setCurrentPatchnote("1.0.2");
        break;
      case /2.0.0/.test(contentKey):
        setPatchnoteContent(
          `<h5 className="opacity-70">05. Mai 2023</h5>
           <h3>Basisdokument Version 2.0.0</h3>
           <div className="flex flex-col gap-2 mt-3">
             <div>
               <h4 className="font-semibold">Neue Funktionen:</h4>
               <ul>
                <li>Verbessertes PDF</li>
                <li>Gliederungs-Sidebar</li>
                <li>Mandantenansicht</li>
                <li>Standardüberschriften</li>
                <li>Bezugnehmende Beiträge in einem Popup</li>
                <li>Markierungstools in einem Menü</li>
               </ul>
             </div>
           </div>`
        );
        setCurrentPatchnote("2.0.0");
        break;
      case /2.0.1/.test(contentKey):
        setPatchnoteContent(
          `<h5 className="opacity-70">09. Mai 2023</h5>
           <h3>Basisdokument Version 2.0.1</h3>
           <div className="flex flex-col gap-2 mt-3">
             <div>
               <h4 className="font-semibold">Neue Funktionen:</h4>
               <ul>
                <li>Aktualisiertes Onboarding mit allen neuen Funktionen</li>
                <li>Neues Basisdokument <a href="https://www.uni-regensburg.de/forschung/reallabor-informationen/wiki/index.html" target="_blank">Wiki</a> mit allen Funktionen</li>
               </ul>
             </div>
             <div>
               <h4 className="font-semibold">Funktionen in Arbeit:</h4>
               <ul>
                <li>Eigener Bereich für Beweise</li>
                <li>Übersichtliche Darstellung von bezugnehmenden Beiträgen</li>
                <li>Erweiterte Exportfunktionen</li>
               </ul>
             </div>
           </div>`
        );
        setCurrentPatchnote("2.0.1");
        break;
    }
  }

  return (
    <>
      <div
        className={cx(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        )}>
        <div className="w-auto my-6 mx-auto w-[700px]">
          {/*content*/}
          <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg ">
              <h3 className="text-xl font-bold text-darkGrey">Patchnotes</h3>
              <div>
                <button
                  onClick={() => {
                    setShowPatchnotesPopup(false);
                  }}
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            {/*body*/}
            <div className="space-y-4 border rounded-md">
              <div className="flex flex-row">
                {/*tabs*/}
                <div className="flex flex-col">
                  <div
                    className={`w-36 flex-grow h-full grid place-items-center p-2 border-b hover:bg-gray-200 cursor-pointer ${
                      currentPatchnote === "2.0.1" ? "" : "border-r opacity-30"
                    }`}
                    onClick={() => {
                      switchPatchnoteContent("2.0.1");
                    }}>
                    <div className="flex flex-col">
                      <div className="font-semibold self-center">
                        Version 2.0.1
                      </div>
                      <div className="opacity-75">09. Mai 2023</div>
                    </div>
                  </div>
                  <div
                    className={`w-36 flex-grow h-full grid place-items-center p-2 hover:bg-gray-200 cursor-pointer ${
                      currentPatchnote === "2.0.0" ? "" : "border-r opacity-30"
                    }`}
                    onClick={() => {
                      switchPatchnoteContent("2.0.0");
                    }}>
                    <div className="flex flex-col">
                      <div className="font-semibold self-center">
                        Version 2.0.0
                      </div>
                      <div className="opacity-75">05. Mai 2023</div>
                    </div>
                  </div>
                  <div
                    className={`w-36 flex-grow h-full grid place-items-center p-2 border-t hover:bg-gray-200 cursor-pointer ${
                      currentPatchnote === "1.0.2" ? "" : "border-r opacity-30"
                    }`}
                    onClick={() => {
                      switchPatchnoteContent("1.0.2");
                    }}>
                    <div className="flex flex-col">
                      <div className="font-semibold self-center">
                        Version 1.0.2
                      </div>
                      <div className="opacity-75">02. März 2023</div>
                    </div>
                  </div>
                  <div
                    className={`w-36 flex-grow h-full grid place-items-center p-2 border-t hover:bg-gray-200 cursor-pointer ${
                      currentPatchnote === "1.0.1" ? "" : "border-r opacity-30"
                    }`}
                    onClick={() => {
                      switchPatchnoteContent("1.0.1");
                    }}>
                    <div className="flex flex-col">
                      <div className="font-semibold self-center">
                        Version 1.0.1
                      </div>
                      <div className="opacity-75">25. Februar 2023</div>
                    </div>
                  </div>
                  <div
                    className={`w-36 flex-grow h-full grid place-items-center p-2 border-t hover:bg-gray-200 cursor-pointer ${
                      currentPatchnote === "1.0.0" ? "" : "border-r opacity-30"
                    }`}
                    onClick={() => {
                      switchPatchnoteContent("1.0.0");
                    }}>
                    <div className="flex flex-col">
                      <div className="font-semibold self-center">
                        Version 1.0.0
                      </div>
                      <div className="opacity-75">20. Februar 2023</div>
                    </div>
                  </div>
                </div>
                {/*content*/}
                <div
                  className="flex flex-col p-4 h-[380px] overflow-auto"
                  dangerouslySetInnerHTML={{ __html: patchnoteContent }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
