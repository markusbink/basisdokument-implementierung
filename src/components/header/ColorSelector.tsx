import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface IState {
  color: { id: string; colorCode: string };
}

interface IProps {
  currentColorSelection: IState["color"];
  setCurrentColorSelection: React.Dispatch<React.SetStateAction<IState["color"]>>;
}

export const ColorSelector: React.FC<IProps> = ({currentColorSelection, setCurrentColorSelection}) => {
  const [showColorSelectorMenu, setShowColorSelectorMenu] = useState<Boolean>(false);

  const highlighter_colors = [
    { id: "red", colorCode: "bg-marker-red" },
    { id: "ornage", colorCode: "bg-marker-orange" },
    { id: "yellow", colorCode: "bg-marker-yellow" },
    { id: "green", colorCode: "bg-marker-green" },
    { id: "blue", colorCode: "bg-marker-blue" },
    { id: "pruple", colorCode: "bg-marker-purple" },
  ];
  return (
    <DropdownMenu.Root
      onOpenChange={() => {
        setShowColorSelectorMenu(!showColorSelectorMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite rounded-md w-14 h-full cursor-pointer">
        <div className={`w-5 h-5 ${currentColorSelection.colorCode} rounded-full border-darkGrey border-2`}></div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg w-14 p-2 gap-1">
          {/* Iterate through list with this element */}
          {highlighter_colors &&
            highlighter_colors.length > 0 &&
            highlighter_colors.map((highlighter) => (
              <DropdownMenu.Item
                key={highlighter.id}
                className="flex flex-row items-center justify-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer w-10"
                onClick={() => {
                  setCurrentColorSelection({ id: highlighter.id, colorCode: highlighter.colorCode });
                }}
              >
                <div className={`w-5 h-5 ${highlighter.colorCode} rounded-full border-darkGrey border-2`}></div>
              </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
