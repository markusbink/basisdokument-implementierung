import { useEffect, useState } from "react";
import { EntryProvider } from "./contexts";
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
        <EntryProvider>
          <Main />
        </EntryProvider>
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
};
