import { useEffect, useState } from "react";
import Note from "./components/note/Note";
import { Auth } from "./pages/Auth";
import { Main } from "./pages/Main";

const registerKeyListener = (e: KeyboardEvent) => {
  if (e.key === "r" && e.metaKey) {
    e.preventDefault();
  }
};

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);

  useEffect(() => {
    window.addEventListener("keydown", registerKeyListener);
    return () => {
      window.removeEventListener("keydown", registerKeyListener);
    };
  }, []);

  return (
    <div className="App h-screen">
      {isAuthenticated ? (
        <Main />
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      )}
      <Note />
    </div>
  );
};
