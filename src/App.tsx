import { useEffect, useState } from "react";
import { EntryProvider } from "./contexts";
import { HeaderProvider } from "./contexts";
import { Auth } from "./pages/Auth";
import { Main } from "./pages/Main";

const registerKeyListener = (e: KeyboardEvent) => {
  if (e.key === "r" && e.metaKey) {
    e.preventDefault();
  }
};

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("keydown", registerKeyListener);
    return () => {
      window.removeEventListener("keydown", registerKeyListener);
    };
  }, []);

  return (
    <div className="App h-screen overflow-hidden">
      <HeaderProvider>
        <EntryProvider>
          {isAuthenticated ? (
            <Main />
          ) : (
            <Auth setIsAuthenticated={setIsAuthenticated} />
          )}
        </EntryProvider>
      </HeaderProvider>
    </div>
  );
};
