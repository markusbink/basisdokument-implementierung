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
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(true);

  useEffect(() => {
    window.addEventListener("keydown", registerKeyListener);
    return () => {
      window.removeEventListener("keydown", registerKeyListener);
    };
  }, []);

  return (
    <div className="App h-screen">
      {isAuthenticated ? (
        <HeaderProvider>
          <EntryProvider>
            <Main />
          </EntryProvider>
        </HeaderProvider>
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
};
