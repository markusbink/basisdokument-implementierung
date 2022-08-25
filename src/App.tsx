import { useEffect, useState } from "react";
import {
  BookmarkProvider,
  CaseProvider,
  HeaderProvider,
  HintProvider,
  NoteProvider,
  UserProvider,
} from "./contexts";
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
      <UserProvider>
        <HeaderProvider>
          <CaseProvider>
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
          </CaseProvider>
        </HeaderProvider>
      </UserProvider>
    </div>
  );
};
