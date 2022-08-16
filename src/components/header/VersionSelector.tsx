import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp } from "phosphor-react";


export const VersionSelector = ({}) => {

  const [showVersionMenu, setShowVersionMenu] = useState<Boolean>(false);
  
  return (
    <DropdownMenu.Root
      onOpenChange={() => {
        setShowVersionMenu(!showVersionMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row justify-between bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 pt-1 pb-1 hover:cursor-pointer font-bold">
        <p>Version 1 <span className="text-mediumGrey font-light">Markus Muster</span></p>
        {showVersionMenu ? <CaretUp size={12} className="text-darkGrey" /> : <CaretDown size={12} className="text-darkGrey" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2">
          {/* Iterate through list with this element */}
          <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer">
            <div className="text-darkGrey">Version 1 <span className="text-mediumGrey font-light ml-2">Markus Muster</span></div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
