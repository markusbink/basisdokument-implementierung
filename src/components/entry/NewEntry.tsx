import cx from "classnames";
import { CornersIn, CornersOut } from "phosphor-react";
import React, { useState } from "react";
import { UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "./Action";

interface NewEntryProps {
  parentRole: "Kläger" | "Beklagter";
  viewedBy: UserRole;
  setIsNewEntryVisible: (isVisible: boolean) => void;
}

export const NewEntry: React.FC<NewEntryProps> = ({
  parentRole,
  viewedBy,
  setIsNewEntryVisible,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isPlaintiff = parentRole === UserRole.Plaintiff;

  return (
    <div
      className={cx("flex flex-col mt-4 bg-white transition-all", {
        "w-1/2": !isExpanded,
        "w-full": isExpanded,
      })}
    >
      {/* Toolbar */}
      <div className="p-4 flex">
        <Action
          onClick={() => setIsExpanded(!isExpanded)}
          isPlaintiff={isPlaintiff}
        >
          {isExpanded ? <CornersIn /> : <CornersOut />}
        </Action>
      </div>
      <textarea
        className={cx("p-6 bg-white rounded-lg border min-h-[140px]", {
          "border-lightPurple": !isPlaintiff,
          "border-lightPetrol": isPlaintiff,
        })}
        placeholder="Text eingeben"
      />
      <div className="flex justify-between">
        <Button
          onClick={() => setIsNewEntryVisible(false)}
          size="sm"
          bgColor="transparent"
          textColor={cx("font-bold", {
            "text-darkPurple": isPlaintiff,
            "text-darkPetrol": !isPlaintiff,
          })}
        >
          Abbrechen
        </Button>
        <Button
          onClick={() => setIsNewEntryVisible(false)}
          size="sm"
          bgColor="transparent"
          textColor={cx("font-bold", {
            "text-darkPurple": isPlaintiff,
            "text-darkPetrol": !isPlaintiff,
          })}
        >
          Speichern
        </Button>
      </div>
    </div>
  );
};
