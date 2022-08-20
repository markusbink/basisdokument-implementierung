import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp } from "phosphor-react";
import { Sorting } from "../../types";

interface IProps {
  selectedSorting: Sorting;
  setSelectedSorting: React.Dispatch<React.SetStateAction<Sorting>>;
}

export const SortingSelector: React.FC<IProps> = ({ selectedSorting, setSelectedSorting }) => {
  const [showSelectMenu, setShowDownloadMenu] = useState<boolean>(false);
  return (
    <DropdownMenu.Root
      onOpenChange={() => {
        setShowDownloadMenu(!showSelectMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 pl-2 pr-2 pt-1 pb-1 hover:cursor-pointer w-[100px] font-bold">
        {selectedSorting === Sorting.Original ? <p>Original</p> : <p>Privat</p>}
        {showSelectMenu ? <CaretUp size={12} className="text-darkGrey" /> : <CaretDown size={12} className="text-darkGrey" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2">
          <DropdownMenu.Item
            className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            onClick={() => {
              setSelectedSorting(Sorting.Original);
            }}
          >
            <div className="text-darkGrey">Original</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            onClick={() => {
              setSelectedSorting(Sorting.Privat);
            }}
          >
            <div className="text-darkGrey">Privat</div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
