import { useState } from "react";

export const Header = () => {
  const [showFoldOutMenu, setShowFoldOutMenu] = useState<Boolean>(false);

  return (
    <header>
      {/* main part of the header */}
      <div className="flex p-4">
        <h1>Header mit Aktionen und Filter</h1>
        <button
          className="bg-lightGrey"
          onClick={() => {
            setShowFoldOutMenu(!showFoldOutMenu);
          }}
        >
          Ausklappen
        </button>
      </div>
      {/* fold-out part of the header */}
      {showFoldOutMenu ? (
        <div className="p-4 bg-offWhite">
          <h1>Ausgeklappter Header mit Aktionen und Filter</h1>
        </div>
      ) : null}
    </header>
  );
};
