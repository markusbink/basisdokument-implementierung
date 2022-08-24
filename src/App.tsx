import { useEffect, useState } from "react";
import { EntryProvider } from "./contexts";
import { HeaderProvider } from "./contexts";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { HintProvider } from "./contexts/HintContext";
import { NoteProvider } from "./contexts/NoteContext";
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
          <NoteProvider>
            <HintProvider>
              <BookmarkProvider>
                {isAuthenticated ? (
                  <Main />
                ) : (
                  <Auth setIsAuthenticated={setIsAuthenticated} />
                )}
              </BookmarkProvider>
            </HintProvider>
          </NoteProvider>
        </EntryProvider>
      </HeaderProvider>
    </div>
  );
};
