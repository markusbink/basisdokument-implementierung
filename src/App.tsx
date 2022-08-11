import { Sidebar } from "./components/Sidebar";
import { Main } from "./pages/Main";

export const App = () => {
  return (
    <div className="App">
      <Main>
        <Sidebar />
      </Main>
    </div>
  );
};
