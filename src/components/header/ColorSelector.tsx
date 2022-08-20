import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import IPropsHeader from "../../types";

interface IProps {
  headerContext: IPropsHeader["headerContext"];
}

export const ColorSelector: React.FC<IProps> = ({ headerContext }) => {
  const [showColorSelectorMenu, setShowColorSelectorMenu] = useState<boolean>(false);

  const handleChange = (e: React.BaseSyntheticEvent, id: string) => {
    headerContext.setColorSelection(headerContext.colorSelection.map((item) => (item.id === id ? { ...item, label: e.target.value } : item)));
  };

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowColorSelectorMenu(!showColorSelectorMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-14 h-full cursor-pointer">
        <div className={`w-5 h-5 ${headerContext.currentColorSelection.colorCode} rounded-full `}></div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content side="left" align="start" className="flex flex-col bg-white shadow-md rounded-lg p-4 gap-1">
          {/* Iterate through list with this element */}
          {headerContext.colorSelection &&
            headerContext.colorSelection.length > 0 &&
            headerContext.colorSelection.map((highlighter) => (
              <div className="flex flex-row" key={highlighter.id}>
                <DropdownMenu.Item
                  className="flex flex-row items-center justify-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
                  onClick={() => {
                    headerContext.setCurrentColorSelection({ id: highlighter.id, colorCode: highlighter.colorCode });
                  }}
                >
                  <div className={`w-5 h-5 ${highlighter.colorCode} rounded-full `}></div>
                </DropdownMenu.Item>
                <EditText className="rounded-md pl-2 pr-2" value={highlighter.label} onChange={(e) => handleChange(e, highlighter.id)} />
              </div>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};