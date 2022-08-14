import cx from "classnames";
import { Pencil } from "phosphor-react";
import React, { useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { UserRole } from "../../types";
import { Tooltip } from "../Tooltip";
import { EntryForm } from "./EntryForm";
import { EntryHeader } from "./EntryHeader";

interface NewEntryProps {
  parentRole: "Kläger" | "Beklagter";
  setIsNewEntryVisible: () => void;
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
        "flex flex-col mt-4  transition-all rounded-lg bg-white shadow",
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
          inputClassName={cx(
            "font-bold h-[28px] p-0 my-0 focus:outline-none bg-transparent",
            {
              "border-darkPurple": !isPlaintiff,
              "border-darkPetrol": isPlaintiff,
            }
          )}
          className={cx("font-bold p-0 my-0 flex items-center mr-2", {
            "text-darkPurple": !isPlaintiff,
            "text-darkPetrol": isPlaintiff,
          })}
          defaultValue="Stefan Schneider"
          showEditButton
          editButtonContent={
            <Tooltip text="Name bearbeiten">
              <Pencil />
            </Tooltip>
          }
          editButtonProps={{
            className: cx("bg-transparent flex items-center"),
          }}
        />
      </EntryHeader>
      {/* Toolbar */}
      <EntryForm
        isPlaintiff={!isPlaintiff}
        isExpanded={isExpanded}
        setIsExpanded={() => {
          setIsExpanded(!isExpanded);
        }}
        onAbort={() => {
          setIsNewEntryVisible();
          setIsExpanded(false);
        }}
        onSave={() => {
          setIsNewEntryVisible();
          setIsExpanded(false);
        }}
      />
    </div>
  );
};
