import { Check } from "phosphor-react";
import React from "react";
import cx from "classnames";
import { useHeaderContext } from "../../contexts";

export const HighlighterButton: React.FC<{ id: number }> = ({ id }) => {
  const { colorSelection, highlighterData, setHighlighterData } = useHeaderContext();
  const color: string = colorSelection[id].id;

  return (
    <div
      className={cx(`marker-${colorSelection[id].id} flex justify-center items-center text-white h-5 w-5 rounded-full hover:border-2 cursor-pointer hover:border-darkGrey`, {
        "opacity-40": !highlighterData[color],
      })}
      onClick={() => {
        setHighlighterData({
          ...highlighterData,
          [color]: !highlighterData[color],
        });
      }}
    >
      {highlighterData[color] ? (
        <div className="border-white w-4 h-4 bg-transparent rounded-full bg-transparent border-[2px]" />
      ) : null}
    </div>
  );
};
