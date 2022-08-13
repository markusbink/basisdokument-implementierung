import cx from "classnames";
import { CornersIn, CornersOut, FloppyDisk, X, Pencil } from "phosphor-react";
import React, { useState } from "react";
import { UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "./Action";
import { EntryHeader } from "./EntryHeader";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";

interface NewEntryProps {
  parentRole: "Kläger" | "Beklagter";
  setIsNewEntryVisible: (isVisible: boolean) => void;
}

export const NewEntry: React.FC<NewEntryProps> = ({
  parentRole,
  setIsNewEntryVisible,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isPlaintiff = parentRole === UserRole.Plaintiff;

  return (
    <div
      className={cx(
        "flex flex-col mt-4  transition-all rounded-lg overflow-hidden bg-white",
        {
          "w-1/2": !isExpanded,
          "w-full": isExpanded,
          "self-start": !isPlaintiff,
          "self-end": isPlaintiff,
        }
      )}
    >
      {/* NewEntry Header */}
      <EntryHeader
        className="rounded-b-none cursor-default"
        isPlaintiff={!isPlaintiff}
      >
        <EditText
          inputClassName={cx("font-bold focus:outline-none bg-transparent", {
            "border-darkPurple": !isPlaintiff,
            "border-darkPetrol": isPlaintiff,
          })}
          className={cx("font-bold", {
            "text-darkPurple": !isPlaintiff,
            "text-darkPetrol": isPlaintiff,
          })}
          defaultValue="Stefan Schneider"
          showEditButton
          editButtonContent={<Pencil size={18} />}
          editButtonProps={{ className: cx("bg-transparent") }}
        />
      </EntryHeader>
      {/* Toolbar */}
      <div
        className={cx("border overflow-hidden rounded-b-lg", {
          "border-lightPurple": !isPlaintiff,
          "border-lightPetrol": isPlaintiff,
        })}
      >
        <div className="px-4 py-2 flex justify-end">
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
            icon={<X size={20} />}
            onClick={() => setIsNewEntryVisible(false)}
            size="sm"
            bgColor="bg-lightRed"
            textColor="font-bold text-darkRed"
          >
            Abbrechen
          </Button>
          <Button
            icon={<FloppyDisk size={20} />}
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
