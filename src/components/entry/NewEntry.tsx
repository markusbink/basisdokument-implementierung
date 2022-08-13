import cx from "classnames";
import { CornersIn, CornersOut, FloppyDisk, Pencil, X } from "phosphor-react";
import React, { useState } from "react";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { UserRole } from "../../types";
import { Button } from "../Button";
import { Action } from "./Action";
import { EntryHeader } from "./EntryHeader";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
          editButtonContent={<Pencil />}
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
        <Editor
          wrapperClassName={cx(
            "min-h-[140px] w-full border-y focus:outline-none",
            {
              "border-lightPurple": !isPlaintiff,
              "border-lightPetrol": isPlaintiff,
            }
          )}
          editorClassName="p-6 "
          placeholder="Text eingeben..."
          toolbarClassName="p-2 relative"
          toolbar={{
            options: ["inline", "list"],
            inline: {
              className: ["!mb-0"],
              options: ["bold", "italic", "underline", "strikethrough"],
            },
            list: {
              className: ["!mb-0"],
              options: ["unordered", "ordered"],
            },
          }}
          toolbarCustomButtons={[
            <Action
              className="text-base absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setIsExpanded(!isExpanded)}
              isPlaintiff={!isPlaintiff}
            >
              {isExpanded ? <CornersIn /> : <CornersOut />}
            </Action>,
          ]}
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
