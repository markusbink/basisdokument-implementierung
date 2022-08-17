import { Check } from "phosphor-react";
import React from "react";
import cx from "classnames";

interface IProps {
  highlighterData: any;
  setHighlighterData: React.Dispatch<React.SetStateAction<any>>;
  highlighterColor: string;
}

export const HighlighterButton: React.FC<IProps> = ({ highlighterData, highlighterColor, setHighlighterData }) => {
  
  return (
    <div
      className={cx(`marker-${highlighterColor} flex justify-center items-center text-white h-6 w-6 rounded-full border-2 border-darkGrey`, {
        "opacity-50": !highlighterData[highlighterColor],
      })}
      onClick={() => {
        setHighlighterData({
          ...highlighterData,
          [highlighterColor]: !highlighterData[highlighterColor],
        });
      }}
    >
      {highlighterData[highlighterColor] ? <Check size={16} weight="bold" className="text-darkGrey" /> : null}
    </div>
  );
};
