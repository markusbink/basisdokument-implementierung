import { useEffect, useState } from "react";
import { CustomToastContainer } from "./components/CustomToastContainer";
import "react-toastify/dist/ReactToastify.css";
import {
  BookmarkProvider,
  CaseProvider,
  HeaderProvider,
  HintProvider,
  NoteProvider,
  SectionProvider,
  UserProvider,
} from "./contexts";
import { Auth } from "./pages/Auth";
import { Main } from "./pages/Main";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { SidebarProvider } from "./contexts/SidebarContext";

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
      <OnboardingProvider>
        <UserProvider>
          <SectionProvider>
            <HeaderProvider>
              <CaseProvider>
                <SidebarProvider>
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
                </SidebarProvider>
              </CaseProvider>
            </HeaderProvider>
          </SectionProvider>
        </UserProvider>
      </OnboardingProvider>
      <CustomToastContainer />
    </div>
  );
};
