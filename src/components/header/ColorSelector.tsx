import { useRef, useState } from "react";
import "react-edit-text/dist/index.css";
import { useHeaderContext } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { ColorSelectorListItem } from "./ColorSelectorListItem";

export const ColorSelector = () => {
  const {
    setColorSelection,
    colorSelection,
    currentColorSelection,
    setCurrentColorSelection,
  } = useHeaderContext();
  const [showColorSelectorMenu, setShowColorSelectorMenu] =
    useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setShowColorSelectorMenu(false));

  const handleChange = (e: React.BaseSyntheticEvent, id: string) => {
    setColorSelection(
      colorSelection.map((item) =>
        item.id === id ? { ...item, label: e.target.value } : item
      )
    );
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
    <div ref={dropdownRef} className="relative z-10">
      <div
        onClick={() => setShowColorSelectorMenu(!showColorSelectorMenu)}
        className="flex flex-row align-middle justify-center items-center gap-2 bg-offWhite hover:bg-lightGrey rounded-md w-12 h-8 cursor-pointer"
      >
        <div
          className={`w-4 h-4 ${getColorCode(
            currentColorSelection.id
          )} rounded-full `}
        />
      </div>
      {showColorSelectorMenu ? (
        <div className="absolute select-none top-full right-0 flex flex-col bg-white shadow-md mt-4 rounded-lg p-4 gap-1">
          {/* Iterate through list with this element */}
          {colorSelection &&
            colorSelection.length > 0 &&
            colorSelection.map((highlighter: any) => (
              <ColorSelectorListItem
                key={highlighter.id}
                highlighter={highlighter}
                setCurrentColorSelection={setCurrentColorSelection}
                setShowColorSelectorMenu={setShowColorSelectorMenu}
                getColorCode={getColorCode}
                handleChange={handleChange}
              />
            ))}
        </div>
      ) : null}
    </div>
  );
};
