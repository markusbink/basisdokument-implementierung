import cx from "classnames";
import { Pencil } from "phosphor-react";
import React, { Dispatch, SetStateAction, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useCase, useSection } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { IEntry, UserRole } from "../../types";
import { getOriginalSortingPosition } from "../../util/get-original-sorting-position";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";
import { Tooltip } from "../Tooltip";
import { EntryForm } from "./EntryForm";
import { EntryHeader } from "./EntryHeader";

interface NewEntryProps {
  roleForNewEntry: "Kläger" | "Beklagter";
  setIsNewEntryVisible: Dispatch<SetStateAction<boolean>>;
  sectionId: string;
  associatedEntry?: string;
}

export const NewEntry: React.FC<NewEntryProps> = ({
  roleForNewEntry,
  setIsNewEntryVisible,
  sectionId,
  associatedEntry,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const isPlaintiff = roleForNewEntry === UserRole.Plaintiff;
  const { user } = useUser();
  const { currentVersion, setEntries } = useCase();
  const { sectionList } = useSection();
  const { groupedEntries } = useCase();

  const entryCodePrefix = isPlaintiff ? "K" : "B";
  const sectionNumber = getOriginalSortingPosition(sectionList, sectionId);
  const sectionEntries = groupedEntries[sectionId];

  const createEntry = (plainText: string, rawHtml: string) => {
    if (plainText.length === 0) {
      toast("Bitte geben sie einen Text ein.", { type: "error" });
      return;
    }

    const newEntryCount = sectionEntries
      ? Object.keys(sectionEntries).length + 1
      : 1;

    const entry: IEntry = {
      id: uuidv4(),
      entryCode: `${entryCodePrefix}-${sectionNumber}-${newEntryCount}`,
      author: user!.name,
      role: roleForNewEntry,
      sectionId,
      text: rawHtml,
      version: currentVersion,
    };

    if (associatedEntry) {
      entry.associatedEntry = associatedEntry;
    }

    setEntries((prevEntries) => [...prevEntries, entry]);
    setIsNewEntryVisible(false);
    setIsExpanded(false);
  };

  const closeNewEntryForm = (plainText: string, rawHtml: string) => {
    if (plainText.length !== 0) {
      setIsErrorVisible(true);
      return;
    }
    setIsNewEntryVisible(false);
    setIsExpanded(false);
  };

  return (
    <>
      <div
        className={cx(
          "flex flex-col mt-4  transition-all rounded-lg bg-white shadow",
          {
            "w-1/2": !isExpanded,
            "w-full": isExpanded,
            "self-start": isPlaintiff,
            "self-end": !isPlaintiff,
          }
        )}
      >
        {/* NewEntry Header */}
        <EntryHeader
          className="rounded-b-none cursor-default"
          isPlaintiff={isPlaintiff}
        >
          <EditText
            inputClassName={cx(
              "font-bold h-[28px] p-0 my-0 focus:outline-none bg-transparent",
              {
                "border-darkPurple": isPlaintiff,
                "border-darkPetrol": !isPlaintiff,
              }
            )}
            className={cx("font-bold p-0 my-0 flex items-center mr-2", {
              "text-darkPurple": isPlaintiff,
              "text-darkPetrol": !isPlaintiff,
            })}
            defaultValue={user?.name}
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
          isPlaintiff={isPlaintiff}
          isExpanded={isExpanded}
          setIsExpanded={() => {
            setIsExpanded(!isExpanded);
          }}
          onAbort={(plainText, rawHtml) => {
            closeNewEntryForm(plainText, rawHtml);
          }}
          onSave={(plainText, rawHtml) => {
            createEntry(plainText, rawHtml);
          }}
        />
      </div>
      <ErrorPopup isVisible={isErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base">
            Sind Sie sicher, dass Sie den Eintrag verwerfen und somit{" "}
            <strong>nicht</strong> speichern möchten?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey"
              textColor="text-mediumGrey font-bold"
              onClick={() => {
                setIsErrorVisible(false);
              }}
            >
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsErrorVisible(false);
                setIsNewEntryVisible(false);
              }}
            >
              Verwerfen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </>
  );
};
