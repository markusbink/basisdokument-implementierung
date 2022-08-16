import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, Cursor, Eraser, FileArrowDown, FileArrowUp, PencilSimpleLine } from "phosphor-react";
import { IconProps } from "react-toastify";

const StaticToolList: any = {
  Cursor,
  PencilSimpleLine,
  Eraser,
};

export interface IState {
  tool: { id: string; title: string };
}

export const ToolSelector = () => {
  const tools = [
    { id: "cursor", title: "Cursor" },
    { id: "highlighter", title: "PencilSimpleLine" },
    { id: "eraser", title: "Eraser" },
  ];

  const [showToolSelectorMenu, setShowToolSelectorMenu] = useState<Boolean>(false);
  const [currentIconSelection, setCurrentIconSelection] = useState<IState["tool"]>(tools[0]);

  const CurrentToolComponent = StaticToolList[currentIconSelection.title];


  return (
    <DropdownMenu.Root
      onOpenChange={() => {
        setShowToolSelectorMenu(!showToolSelectorMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite rounded-md w-14 h-full cursor-pointer">
        <CurrentToolComponent size={20} weight="bold" className="text-darkGrey" />
        {showToolSelectorMenu ? <CaretUp size={12} className="text-darkGrey" weight="fill" /> : <CaretDown size={12} className="text-darkGrey" weight="fill" />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg w-14 p-2 gap-2">
          {/* Iterate through list with this element */}
          {tools &&
            tools.length > 0 &&
            tools.map((tool) => {
              const ToolComponent = StaticToolList[tool.title];
              return (
                <DropdownMenu.Item
                  key={tool.id}
                  className="flex flex-row items-center justify-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer w-10"
                  onClick={() => {
                    setCurrentIconSelection({ id: tool.id, title: tool.title });
                  }}
                >
                  <ToolComponent size={20} weight="bold" />
                </DropdownMenu.Item>
              );
            })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
