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
        item.color === id ? { ...item, label: e.target.value } : item
      )
    );
  };

  const getColorCode = (color: string) => {
    switch (color) {
      case "yellow":
        return "marker-yellow";
      case "orange":
        return "marker-orange";
      case "red":
        return "marker-red";
      case "purple":
        return "marker-purple";
      case "blue":
        return "marker-blue";
      case "green":
        return "marker-green";
      default:
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setShowColorSelectorMenu(!showColorSelectorMenu)}
        className={`flex flex-row align-middle justify-center items-center gap-2 marker-icon-opacity ${getColorCode(
          currentColorSelection.color
        )} rounded-md w-12 h-8 cursor-pointer`}>
        <div
          className={`flex items-center justify-center w-5 h-5 shadow-inner shadow-2xl ${getColorCode(
            currentColorSelection.color
          )} rounded-full`}>
          <div className="border-white w-3 h-3 rounded-full bg-transparent border-[1px]"></div>
        </div>
      </div>
      {showColorSelectorMenu ? (
        <div className="absolute select-none top-full right-0 flex flex-col bg-white shadow-md mt-4 rounded-lg p-4 gap-1 z-20">
          {/* Iterate through list with this element */}
          {colorSelection &&
            colorSelection.length > 0 &&
            colorSelection.map((highlighter: any) => (
              <ColorSelectorListItem
                key={highlighter.color}
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
