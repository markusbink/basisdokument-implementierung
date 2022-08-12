import cx from "classnames";
import { CornersIn, CornersOut } from "phosphor-react";
import React, { useState } from "react";
import { UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "./Action";
import { EntryHeader } from "./EntryHeader";

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
      className={cx(
        "flex flex-col mt-4  transition-all rounded-lg overflow-hidden bg-white",
        {
          "w-1/2": !isExpanded,
          "w-full": isExpanded,
        }
      )}
    >
      {/* NewEntry Header */}
      <EntryHeader
        className="rounded-b-none cursor-default"
        isPlaintiff={!isPlaintiff}
      >
        <span className="font-bold">Stefan Schneider</span>
      </EntryHeader>
      {/* Toolbar */}
      <div
        className={cx("border overflow-hidden rounded-b-lg", {
          "border-lightPurple": !isPlaintiff,
          "border-lightPetrol": isPlaintiff,
        })}
      >
        <div className="p-4 flex justify-end">
          <Action
            onClick={() => setIsExpanded(!isExpanded)}
            isPlaintiff={!isPlaintiff}
          >
            {isExpanded ? <CornersIn /> : <CornersOut />}
          </Action>
        </div>
        <textarea
          className={cx(
            "p-6 min-h-[140px] w-full border-y focus:outline-none",
            {
              "border-lightPurple": !isPlaintiff,
              "border-lightPetrol": isPlaintiff,
            }
          )}
          placeholder="Text eingeben"
        />
        <div className="flex justify-end gap-2 p-3 pt-2">
          <Button
            onClick={() => setIsNewEntryVisible(false)}
            size="sm"
            bgColor="bg-lightRed"
            textColor="font-bold text-darkRed"
          >
            Abbrechen
          </Button>
          <Button
            onClick={() => setIsNewEntryVisible(false)}
            size="sm"
            bgColor="bg-lightGreen"
            textColor="font-bold text-darkGreen"
          >
            Speichern
          </Button>
        </div>
      </div>
    </div>
  );
};
