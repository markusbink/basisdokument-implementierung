import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, FileArrowDown, FileArrowUp, ListNumbers } from "phosphor-react";

export const SortingMenu = ({}) => {
  const [showSortingMenu, setShowDownloadMenu] = useState<Boolean>(false);
  const buttonColor: String = showSortingMenu ? "bg-[#565656]" : "bg-darkGrey";

  const sections = [
    { id: "27b78210-1d32-11ed-861d-0242ac120002", title_plaintiff: "Beschreibung zum Unfall" },
    { id: "2b835162-1d32-11ed-861d-0242ac120002", title_plaintiff: "Klärung der Unfallbeteiligten" },
  ];

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
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-5">
          <div className="flex flex-row gap-4 items-center">
            <p className="font-bold text-xl">Beiträge sortieren</p>
            <div className="bg-darkGrey text-white p-0.5 pl-3 pr-3 rounded-full">Privat</div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
