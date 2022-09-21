import { CornersIn, CornersOut } from "phosphor-react";
import { Tooltip } from "../Tooltip";
import { Action } from "./Action";

interface ExpandButtonProps {
  isPlaintiff: boolean;
  isExpanded: boolean;
  setIsExpanded: () => void;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  isPlaintiff,
  isExpanded,
  setIsExpanded,
}) => {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 leading-[0]">
      <Tooltip position="top" text={isExpanded ? "Minimieren" : "Maximieren"}>
        <Action
          className="text-base"
          onClick={() => setIsExpanded()}
          isPlaintiff={isPlaintiff}>
          {isExpanded ? <CornersIn /> : <CornersOut />}
        </Action>
      </Tooltip>
    </div>
  );
};
