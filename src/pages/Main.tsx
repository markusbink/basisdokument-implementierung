import { Discussion } from "../components/Discussion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Onboarding } from "../components/Onboarding";
import { useBeforeunload } from "react-beforeunload";
import { useHints, useNotes, useUser } from "../contexts";
import { JudgeHintPopup } from "../components/JudgeHintPopup";
import { NotePopup } from "../components/NotePopup";
import { UserRole } from "../types";

export const Main: React.FC = () => {
  useBeforeunload(
    () =>
      "Änderungen am Basisdokument können verloren gehen. Bitte speichern Sie das Basisdokument, bevor Sie den Browser-Tab schließen."
  );
  const { showJudgeHintPopup } = useHints();
  const { showNotePopup } = useNotes();

  return (
    <div className="flex w-full h-full">
      <Onboarding />
      {showJudgeHintPopup ? <JudgeHintPopup /> : null}
      {showNotePopup ? <NotePopup /> : null}
      <main className="w-full flex flex-col">
        <Header />
        <Discussion />
      </main>
      <Sidebar />
    </div>
  );
};
