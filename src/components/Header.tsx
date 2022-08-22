import { MainHeader } from "./header/MainHeader";
import { DropdownHeader } from "./header/DropdownHeader";
import { useHeaderContext } from "../contexts/HeaderContext";

export const Header = () => {
  const { showDropdownHeader } = useHeaderContext();
  return (
    <header className="text-darkGrey border-b border-offWhite">
      {/* main part of the header */}
      <MainHeader />
      {/* fold-out part of the header */}
      {showDropdownHeader ? <DropdownHeader /> : null}
    </header>
  );
};
