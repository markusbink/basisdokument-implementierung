import { Quotes } from "phosphor-react";
import { useState } from "react";
import { useCase, useNotes } from "../contexts";
import { IEntry } from "../types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const Dropdown = () => {
  const [showOptions, setShowOptions] = useState(false);
  const { setAssociatedEntryId } = useNotes();
  const { entries } = useCase();
  const handleClick = () => {
    setShowOptions(!showOptions);
  };
  return (
    <div className="bg-darkGrey rounded flex items-center p-1 m-1 ">
    <DropdownMenu.Root modal={false} 
            aria-expanded="true"
            aria-haspopup="true">
            <Quotes size={16} color="white" weight="regular"/>
      <DropdownMenu.Trigger>
        {<div className="relative inline-block text-left"/>}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content >
        {<div>{showOptions && (
          <div
            className="absolute flex flex-col w-max right-0 z-10 mt-4 p-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button">
            <div className="py-1" role="none">
              {entries &&
                entries.map((entry: IEntry) => (
                  <DropdownMenu.Item
                    key={entry.id}
                    onClick={() => {
                      console.log(entry.id);
                      setAssociatedEntryId(entry.id);
                    }}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full rounded-md"
                    role="menuitem"
                    id="menu-item-0">
                    {entry.entryCode}
                  </DropdownMenu.Item>
                ))}
            </div>
          </div>
        )}</div>}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    </div>
  );
};
