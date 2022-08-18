import { Check } from "phosphor-react";
import React from "react";
import cx from "classnames";


export const HighlighterButton: React.FC<any> = ({ headerContext, id })=> {

  const color = headerContext.colorSelection[id].id
  
  return (
    <div
      className={cx(`marker-${headerContext.colorSelection[id].id} flex justify-center items-center text-white h-6 w-6 rounded-full hover:border-2 hover:border-darkGrey`, {
        "opacity-50": !headerContext.highlighterData[color],
      })}
      onClick={() => {
        headerContext.setHighlighterData({
          ...headerContext.highlighterData,
          [color]: !headerContext.highlighterData[color],
        });
      }}
    >
      {headerContext.highlighterData[color] ? <Check size={16} weight="bold" className="text-darkGrey" /> : null}
    </div>
  );
};
