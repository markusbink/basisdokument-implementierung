import { Discussion } from "../components/Discussion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Onboarding } from "../components/Onboarding";
import { useBeforeunload } from 'react-beforeunload';

export const Main: React.FC = () => {
  useBeforeunload(() => "Änderungen am Basisdokument können verloren gehen. Bitte speichern Sie das Basisdokument, bevor Sie den Browser-Tab schließen.");
  return (
    <div className="flex w-full h-full">
      <Onboarding />
      <main className="w-full flex flex-col">
        <Header />
        <Discussion />
      </main>
      <Sidebar />
    </div>
  );
};
