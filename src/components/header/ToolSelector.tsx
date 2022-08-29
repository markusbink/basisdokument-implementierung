import {
  CaretDown,
  CaretUp,
  Cursor,
  Eraser,
  PencilSimpleLine,
} from "phosphor-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { Tool } from "../../types";

const StaticToolList: any = {
  Cursor,
  PencilSimpleLine,
  Eraser,
};

const tools = [
  { id: Tool.Cursor, iconNode: "Cursor", germanTitle: "Maus" },
  {
    id: Tool.Highlighter,
    iconNode: "PencilSimpleLine",
    germanTitle: "Markieren",
  },
  { id: Tool.Eraser, iconNode: "Eraser", germanTitle: "Markierung löschen" },
];

export interface IState {
  tool: { id: Tool; iconNode: string; germanTitle: string };
}

interface IProps {
  getCurrentTool: IState["tool"];
  setCurrentTool: React.Dispatch<React.SetStateAction<IState["tool"]>>;
}

export const ToolSelector: React.FC<IProps> = ({
  getCurrentTool,
  setCurrentTool,
}) => {
  const [showToolSelectorMenu, setShowToolSelectorMenu] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setShowToolSelectorMenu(false));

  const CurrentToolComponent = StaticToolList[getCurrentTool.iconNode];

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => {
          setShowToolSelectorMenu(!showToolSelectorMenu);
        }}
        className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-12 h-8 cursor-pointer"
      >
        <div className={`flex flex-row items-center rounded-full gap-2`}>
          <CurrentToolComponent size={16} className="text-darkGrey" />
          {showToolSelectorMenu ? (
            <CaretUp size={12} className="text-darkGrey" weight="bold" />
          ) : (
            <CaretDown size={12} className="text-darkGrey" weight="bold" />
          )}
        </div>
      </div>
      {showToolSelectorMenu ? (
        <div className="absolute top-full right-0  w-[200px] flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 gap-2 z-50">
          {/* Iterate through list with this element */}
          {tools?.length > 0 &&
            tools.map((tool) => {
              const ToolComponent = StaticToolList[tool.iconNode];
              return (
                <div
                  key={tool.id}
                  className="flex flex-row items-center p-2 gap-4 hover:bg-offWhite rounded-md cursor-pointer"
                  onClick={() => {
                    setCurrentTool({
                      id: tool.id,
                      iconNode: tool.iconNode,
                      germanTitle: tool.germanTitle,
                    });
                    setShowToolSelectorMenu(false);
                  }}
                >
                  <ToolComponent size={16} />
                  <span className="text-sm font-medium">
                    {tool.germanTitle}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};
