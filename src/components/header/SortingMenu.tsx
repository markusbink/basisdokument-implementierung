import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, FileArrowDown, FileArrowUp, ListNumbers } from "phosphor-react";

export const SortingMenu = ({}) => {
  const [showSortingMenu, setShowDownloadMenu] = useState<Boolean>(false);
  const buttonColor:String = showSortingMenu ? "bg-[#565656]" : "bg-darkGrey"
  return (
    <DropdownMenu.Root
      onOpenChange={() => {
        setShowDownloadMenu(!showSortingMenu);
      }}
    >
      <DropdownMenu.Trigger className={`${buttonColor} flex flex-row justify-between bg-darkGrey items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer font-bold h-8`}>
        <ListNumbers size={24} className="text-white" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2">
          <p>Hier werden dann Dinge sortiert...</p>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
