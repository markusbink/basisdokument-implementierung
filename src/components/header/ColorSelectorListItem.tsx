import { Check, Pencil } from "phosphor-react";
import { useState } from "react";
import "react-edit-text/dist/index.css";
import { Tooltip } from "../Tooltip";

interface IProps {
  highlighter: any;
  setCurrentColorSelection: any;
  setShowColorSelectorMenu: any;
  getColorCode: any;
  handleChange: any;
}

export const ColorSelectorListItem: React.FC<IProps> = ({ highlighter, setCurrentColorSelection, setShowColorSelectorMenu, getColorCode, handleChange }) => {
  const [inputSelected, setInputSelected] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center gap-2">
      <div
        className="flex flex-row items-center gap-1 hover:bg-offWhite rounded-md cursor-pointer"
        onClick={(e) => {
          if (!inputSelected) {
            setCurrentColorSelection({
              id: highlighter.id,
              label: highlighter.label,
            });
            setShowColorSelectorMenu(false);
          }
        }}
      >
        {/*Color Circle*/}
        <div className="flex flex-row items-center justify-center p-2 gap-2">
          <div className={`flex items-center justify-center w-5 h-5 shadow-inner shadow-2xl ${getColorCode(highlighter.id)} rounded-full `}>
            <div className="border-white w-4 h-4 bg-transparent rounded-full bg-transparent border-[1px]"></div>
          </div>
        </div>
        {/*Name of Marker*/}
        {inputSelected ? (
          <input
            autoFocus={true}
            type="text"
            name="title"
            className="rounded-md focus:outline-0 w-[150px] text-clip bg-transparent text-sm font-medium"
            value={highlighter.label}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setInputSelected(false);
              }
            }}
            onChange={(e) => {
              e.preventDefault();
              handleChange(e, highlighter.id);
            }}
          />
        ) : (
          <span className="w-[150px] text-sm font-medium text-clip overflow-hidden whitespace-nowrap">{highlighter.label}</span>
        )}
      </div>
      <Tooltip text="Markierung umbenennen">
        {inputSelected ? (
          <Check onClick={() => setInputSelected(false)} weight="bold" />
        ) : (
          <Pencil
            onClick={() => {
              setInputSelected(true);
            }}
          />
        )}
      </Tooltip>
    </div>
  );
};
