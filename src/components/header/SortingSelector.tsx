import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp } from "phosphor-react";
import { useHeaderContext } from "../../contexts";

enum Sorting {
  Privat,
  Original,
}

interface IProps {
  selectedSorting: Sorting;
  setSelectedSorting: React.Dispatch<React.SetStateAction<Sorting>>;
}

export const SortingSelector: React.FC<IProps> = ({
  selectedSorting,
  setSelectedSorting,
}) => {
  const [showSelectMenu, setShowDownloadMenu] = useState<boolean>(false);
  const { setShowEntrySorting } = useHeaderContext();

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowDownloadMenu(!showSelectMenu);
      }}>
      <DropdownMenu.Trigger className="flex flex-row justify-between bg-offWhite hover:bg-lightGrey items-center rounded-md gap-2 px-2 h-8 hover:cursor-pointer w-[100px] font-bold">
        <span className="text-sm">
          {selectedSorting === Sorting.Original ? "Original" : "Privat"}
        </span>
        {showSelectMenu ? (
          <CaretUp size={12} className="text-darkGrey" weight="bold" />
        ) : (
          <CaretDown size={12} className="text-darkGrey" weight="bold" />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="bottom"
          align="start"
          className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 w-[100px] z-20">
          <DropdownMenu.Item
            className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            onClick={() => {
              setSelectedSorting(Sorting.Original);
              setShowEntrySorting(false);
            }}>
            <div className="text-darkGrey text-sm font-medium">Original</div>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            onClick={() => {
              setSelectedSorting(Sorting.Privat);
            }}>
            <div className="text-darkGrey text-sm font-medium">Privat</div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
