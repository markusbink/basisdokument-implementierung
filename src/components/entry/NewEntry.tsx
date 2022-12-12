import cx from "classnames";
import { Pencil } from "phosphor-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useCase, useHeaderContext, useSection } from "../../contexts";
import { useUser } from "../../contexts/UserContext";
import { getTheme } from "../../themes/getTheme";
import { IEntry, IndividualEntrySortingEntry, UserRole } from "../../types";
import { getOriginalSortingPosition } from "../../util/get-original-sorting-position";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";
import { Tooltip } from "../Tooltip";
import { EntryForm } from "./EntryForm";
import { EntryHeader } from "./EntryHeader";

interface NewEntryProps {
  roleForNewEntry: "Klagepartei" | "Beklagtenpartei";
  setIsNewEntryVisible: Dispatch<SetStateAction<boolean>>;
  sectionId: string;
  index: number;
  associatedEntry?: string;
}

export const NewEntry: React.FC<NewEntryProps> = ({
  roleForNewEntry,
  setIsNewEntryVisible,
  sectionId,
  index,
  associatedEntry,
}) => {
  const { selectedTheme } = useHeaderContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("");
  const { user } = useUser();
  const { currentVersion, entries, setEntries, setIndividualEntrySorting } =
    useCase();
  const { sectionList } = useSection();

  const isPlaintiff = roleForNewEntry === UserRole.Plaintiff;
  const entryCodePrefix = isPlaintiff ? "K" : "B";
  const sectionNumber = getOriginalSortingPosition(sectionList, sectionId);

  const createEntry = (plainText: string, rawHtml: string) => {
    if (plainText.length === 0) {
      toast("Bitte geben sie einen Text ein.", { type: "error" });
      return;
    }

    const newEntryCount =
      entries.filter((entry) => entry.sectionId === sectionId).length + 1;

    const entry: IEntry = {
      id: uuidv4(),
      entryCode: `${entryCodePrefix}-${sectionNumber}-${newEntryCount}`,
      author: authorName || user!.name,
      role: roleForNewEntry,
      sectionId,
      text: rawHtml,
      version: currentVersion,
    };

    if (associatedEntry) {
      entry.associatedEntry = associatedEntry;
    }

    const individualEntrySortingEntry: IndividualEntrySortingEntry = {
      rowId: uuidv4(),
      columns: [[], []],
    };
    const columnIndex = isPlaintiff ? 0 : 1;
    individualEntrySortingEntry.columns[columnIndex].push(entry.id);

    // TODO: index not working
    // setEntries((prevEntries) => [...prevEntries, entry]);
    console.log(index);
    setEntries((prevEntries) => [
      ...prevEntries.slice(0, index),
      entry,
      ...prevEntries.slice(index),
    ]);

    setIndividualEntrySorting((prevEntrySorting) => {
      const newEntrySorting = { ...prevEntrySorting };
      newEntrySorting[sectionId]?.push(individualEntrySortingEntry);
      return newEntrySorting;
    });

    setIsNewEntryVisible(false);
    setIsExpanded(false);
  };

  const closeNewEntryForm = (plainText: string, _: string) => {
    if (plainText.length !== 0) {
      setIsErrorVisible(true);
      return;
    }
    setIsNewEntryVisible(false);
    setIsExpanded(false);
  };

  useEffect(() => {
    setAuthorName(user!.name);
  }, [user]);

  return (
    <>
      <div
        className={cx(
          "flex flex-col mt-4 transition-all rounded-lg bg-white shadow",
          {
            "w-[calc(50%_-_12px)]": !isExpanded,
            "w-full": isExpanded,
            "self-start": isPlaintiff,
            "self-end": !isPlaintiff,
          }
        )}>
        {/* NewEntry Header */}
        <EntryHeader
          className="rounded-b-none cursor-default"
          isPlaintiff={isPlaintiff}>
          <EditText
            inputClassName={cx(
              "font-bold h-[28px] p-0 my-0 focus:outline-none bg-transparent",
              {
                [`border-${getTheme(selectedTheme)?.primaryPlaintiff}`]:
                  isPlaintiff,
                [`border-${getTheme(selectedTheme)?.primaryDefendant}`]:
                  !isPlaintiff,
              }
            )}
            className={cx("font-bold p-0 my-0 flex items-center mr-2", {
              [`text-${getTheme(selectedTheme)?.primaryPlaintiff}`]:
                isPlaintiff,
              [`text-${getTheme(selectedTheme)?.primaryDefendant}`]:
                !isPlaintiff,
            })}
            value={authorName}
            onChange={(e) => {
              setAuthorName(e.target.value);
            }}
            showEditButton
            editButtonContent={
              <Tooltip asChild text="Name bearbeiten">
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
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsErrorVisible(false);
                setIsNewEntryVisible(false);
              }}>
              Verwerfen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </>
  );
};
