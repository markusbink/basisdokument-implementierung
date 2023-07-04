import { Discussion } from "../components/Discussion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Onboarding } from "../components/Onboarding";
import { useBeforeunload } from "react-beforeunload";
import {
  useBookmarks,
  useCase,
  useExport,
  useHeaderContext,
  useHints,
  useNotes,
  useSection,
} from "../contexts";
import { JudgeHintPopup } from "../components/JudgeHintPopup";
import { NotePopup } from "../components/NotePopup";
import { ExportPopup } from "../components/ExportPopup";

export const Main: React.FC = () => {
  useBeforeunload(
    () =>
      "Änderungen am Basisdokument können verloren gehen. Bitte speichern Sie das Basisdokument, bevor Sie den Browser-Tab schließen."
  );
  const { showJudgeHintPopup, hints } = useHints();
  const { showNotePopup, notes } = useNotes();
  const { isExportPopupOpen } = useExport();
  const { caseId, currentVersion, metaData, entries, highlightedEntries } =
    useCase();
  const { sectionList, individualSorting } = useSection();
  const { versionHistory, colorSelection } = useHeaderContext();
  const { bookmarks } = useBookmarks();

  return (
    <div className="flex w-full h-full">
      <Onboarding />
      {showJudgeHintPopup ? <JudgeHintPopup /> : null}
      {showNotePopup ? <NotePopup /> : null}
      {isExportPopupOpen ? (
        <ExportPopup
          caseId={caseId}
          currentVersion={currentVersion}
          versionHistory={versionHistory}
          metaData={metaData}
          entries={entries}
          sectionList={sectionList}
          hints={hints}
          highlightedEntries={highlightedEntries}
          colorSelection={colorSelection}
          notes={notes}
          bookmarks={bookmarks}
          individualSorting={individualSorting}></ExportPopup>
      ) : null}
      <main className="w-full flex flex-col">
        <Header />
        <Discussion />
      </main>
      <Sidebar />
    </div>
  );
};
