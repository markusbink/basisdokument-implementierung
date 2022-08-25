import { Check } from "phosphor-react";
import React from "react";
import cx from "classnames";
import { useHeaderContext } from "../../contexts";

export const HighlighterButton: React.FC<{ id: number }> = ({ id }) => {
  const { colorSelection, highlighterData, setHighlighterData } = useHeaderContext();
  const color: string = colorSelection[id].id;

  return (
    <div
      className={cx(`marker-${colorSelection[id].id} flex justify-center items-center text-white h-5 w-5 rounded-full hover:border-2 cursor-pointer hover:border-darkGrey`)}
      onClick={() => {
        setHighlighterData({
          ...highlighterData,
          [color]: !highlighterData[color],
        });
      }}
    >
      {highlighterData[color] ? (
        <div className="border-white w-3.5 h-3.5 rounded-full bg-transparent border-[3px]" />
      ) : <div className="border-white w-3.5 h-3.5 bg-white rounded-full" />}
    </div>
  );
};
