import { Discussion } from "../components/Discussion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/sidebar/Sidebar";

export const Main: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <main className="w-full flex flex-col">
        <Header />
        <Discussion />
      </main>
      <Sidebar />
    </div>
  );
};
