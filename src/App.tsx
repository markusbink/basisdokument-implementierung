import { useState } from "react";
import { Auth } from "./pages/Auth";
import { Main } from "./pages/Main";

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="App h-screen">
      {isAuthenticated ? (
        <Main />
      ) : (
        <Auth setIsAuthenticated={setIsAuthenticated} />
      )}
    </div>
  );
};
