import { Check } from "phosphor-react";
import React from "react";
import cx from "classnames";
import { useHeaderContext } from "../../contexts/HeaderContext";

export const HighlighterButton: React.FC<{ id: number }> = ({ id }) => {
  const { colorSelection, highlighterData, setHighlighterData} = useHeaderContext();
  const color = colorSelection[id].id;

  return (
    <div
      className={cx(`marker-${colorSelection[id].id} flex justify-center items-center text-white h-6 w-6 rounded-full hover:border-2 hover:border-darkGrey`, {
        "opacity-50": !highlighterData[color],
      })}
      onClick={() => {
        setHighlighterData({
          ...highlighterData,
          [color]: !highlighterData[color],
        });
      }}
    >
      {highlighterData[color] ? <Check size={16} weight="bold" className="text-darkGrey" /> : null}
    </div>
  );
};
