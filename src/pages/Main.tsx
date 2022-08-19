import { Discussion } from "../components/Discussion";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Popup } from "../components/Popup";

export const Main: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <main className="w-full flex flex-col">
        <Header />
        <Discussion />
        <Popup />
      </main>
      <Sidebar />
    </div>
  );
};
