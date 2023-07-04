import { useEffect, useState } from "react";
import { CustomToastContainer } from "./components/CustomToastContainer";
import "react-toastify/dist/ReactToastify.css";
import {
  BookmarkProvider,
  CaseProvider,
  ExportProvider,
  HeaderProvider,
  HintProvider,
  ImprintProvider,
  NoteProvider,
  PatchnotesProvider,
  SectionProvider,
  UserProvider,
} from "./contexts";
import { Auth } from "./pages/Auth";
import { Main } from "./pages/Main";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ViewProvider } from "./contexts/ViewContext";
import { EvidenceProvider } from "./contexts/EvidenceContext";

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
            <EvidenceProvider>
              <HeaderProvider>
                <CaseProvider>
                  <ViewProvider>
                    <SidebarProvider>
                      <NoteProvider>
                        <HintProvider>
                          <BookmarkProvider>
                            <ExportProvider>
                              <PatchnotesProvider>
                                <ImprintProvider>
                                  {isAuthenticated ? (
                                    <Main />
                                  ) : (
                                    <Auth
                                      setIsAuthenticated={setIsAuthenticated}
                                    />
                                  )}
                                </ImprintProvider>
                              </PatchnotesProvider>
                            </ExportProvider>
                          </BookmarkProvider>
                        </HintProvider>
                      </NoteProvider>
                    </SidebarProvider>
                  </ViewProvider>
                </CaseProvider>
              </HeaderProvider>
            </EvidenceProvider>
          </SectionProvider>
        </UserProvider>
      </OnboardingProvider>
      <CustomToastContainer />
    </div>
  );
};
