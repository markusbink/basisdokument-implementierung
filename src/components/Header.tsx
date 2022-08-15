import { useState } from "react";
import { MainHeader } from "./header/MainHeader";
import { DropdownHeader } from "./header/DropdownHeader";

export const Header = () => {
  const [showFoldOutMenu, setShowFoldOutMenu] = useState<Boolean>(false);
  const [showColumnView, setShowColumnView] = useState<Boolean>(false);

  return (
    <header className="text-darkGrey">
      {/* main part of the header */}
      <MainHeader showFoldOutMenu={showFoldOutMenu} setShowFoldOutMenu={setShowFoldOutMenu} />
      {/* fold-out part of the header */}
      {showFoldOutMenu ? (
        <DropdownHeader showFoldOutMenu={showFoldOutMenu} setShowFoldOutMenu={setShowFoldOutMenu} showColumnView={showColumnView} setShowColumnView={setShowColumnView} />
      ) : null}
    </header>
  );
};
