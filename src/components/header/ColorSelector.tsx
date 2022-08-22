import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { useHeaderContext } from "../../contexts/HeaderContext";

export const ColorSelector = () => {
  const { setColorSelection, colorSelection, currentColorSelection, setCurrentColorSelection } = useHeaderContext();
  const [showColorSelectorMenu, setShowColorSelectorMenu] = useState<boolean>(false);

  const handleChange = (e: React.BaseSyntheticEvent, id: string) => {
    setColorSelection(colorSelection.map((item) => (item.id === id ? { ...item, label: e.target.value } : item)));
  };

  const getColorCode = (id: string) => {
    switch (id) {
      case "red":
        return "bg-marker-red";
      case "orange":
        return "bg-marker-orange";
      case "yellow":
        return "bg-marker-yellow";
      case "green":
        return "bg-marker-green";
      case "blue":
        return "bg-marker-blue";
      case "purple":
        return "bg-marker-purple";
      default:
        break;
    }
  };

  return (
    <DropdownMenu.Root
      modal={false}
      onOpenChange={() => {
        setShowColorSelectorMenu(!showColorSelectorMenu);
      }}
    >
      <DropdownMenu.Trigger className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-14 h-full cursor-pointer">
        <div className={`w-5 h-5 ${getColorCode(currentColorSelection.id)} rounded-full `}></div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-4 gap-1">
          {/* Iterate through list with this element */}
          {colorSelection &&
            colorSelection.length > 0 &&
            colorSelection.map((highlighter) => (
              <div className="flex flex-row" key={highlighter.id}>
                <DropdownMenu.Item
                  className="flex flex-row items-center justify-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
                  onClick={() => {
                    setCurrentColorSelection({ id: highlighter.id, label: highlighter.label });
                  }}
                >
                  <div className={`w-5 h-5 ${getColorCode(highlighter.id)} rounded-full `} />
                </DropdownMenu.Item>
                <EditText className="rounded-md pl-2 pr-2" value={highlighter.label} onChange={(e) => handleChange(e, highlighter.id)} />
              </div>
            ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
