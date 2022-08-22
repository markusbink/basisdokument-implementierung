import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, Cursor, Eraser, PencilSimpleLine } from "phosphor-react";

const StaticToolList: any = {
  Cursor,
  PencilSimpleLine,
  Eraser,
};

export interface IState {
  tool: { id: string; title: string };
}

interface IProps {
  getCurrentTool: IState["tool"];
  setCurrentTool: React.Dispatch<React.SetStateAction<IState["tool"]>>;
}

export const ToolSelector: React.FC<IProps> = ({ getCurrentTool, setCurrentTool }) => {
  const tools = [
    { id: "cursor", title: "Cursor" },
    { id: "highlighter", title: "PencilSimpleLine" },
    { id: "eraser", title: "Eraser" },
  ];

  const [showToolSelectorMenu, setShowToolSelectorMenu] = useState<boolean>(false);
  const CurrentToolComponent = StaticToolList[getCurrentTool.title];

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowToolSelectorMenu(!showToolSelectorMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-14 h-10 cursor-pointer">
        <div className={`flex flex-row items-center rounded-full gap-2`}>
          <CurrentToolComponent size={20} weight="bold" className="text-darkGrey" />
          {showToolSelectorMenu ? <CaretUp size={12} className="text-darkGrey" weight="fill" /> : <CaretDown size={12} className="text-darkGrey" weight="fill" />}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg w-14 p-2 gap-2">
          {/* Iterate through list with this element */}
          {tools?.length > 0 &&
            tools.map((tool) => {
              const ToolComponent = StaticToolList[tool.title];
              return (
                <DropdownMenu.Item
                  key={tool.id}
                  className="flex flex-row items-center justify-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer w-10"
                  onClick={() => {
                    setCurrentTool({ id: tool.id, title: tool.title });
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
