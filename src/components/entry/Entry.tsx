import cx from "classnames";
import { ArrowBendLeftUp } from "phosphor-react";
import React, { useState } from "react";
import { IEntry, UserRole } from "../../types";
import { Button } from "../Button";
import { EntryBody } from "./EntryBody";
import { EntryHeader } from "./EntryHeader";
import { NewEntry } from "./NewEntry";

interface EntryProps {
  entry: IEntry;
  isBookmarked?: boolean;
  viewedBy: UserRole;
}

export const Entry: React.FC<EntryProps> = ({
  entry,
  isBookmarked = false,
  viewedBy,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isNewEntryVisible, setIsNewEntryVisible] = useState<boolean>(false);

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;

  /**
   * Used to conditionally style the entries based on which user is viewing it.
   */
  const isOwnEntry =
    (viewedBy === UserRole.Plaintiff && entry.role === "Kläger") ||
    (viewedBy === UserRole.Defendant && entry.role === "Beklagter");

  const canAddEntry = isJudge || !isOwnEntry;

  const toggleBody = (e: React.MouseEvent) => {
    setIsExpanded(!isExpanded);
  };

  const showNewEntry = () => {
    setIsNewEntryVisible(true);
  };

  return (
    <div>
      <div
        className={cx("flex flex-col", {
          "items-end": !isPlaintiff,
        })}
      >
        <div className={cx("w-1/2")}>
          <EntryHeader
            entry={entry}
            isExpanded={isExpanded}
            toggleBody={toggleBody}
            isBookmarked={isBookmarked}
          />
          {isExpanded && (
            <EntryBody isPlaintiff={isPlaintiff}>{entry.text}</EntryBody>
          )}
        </div>
        {canAddEntry && !isNewEntryVisible && (
          <Button
            onClick={showNewEntry}
            icon={<ArrowBendLeftUp weight="bold" size={18} />}
            size="sm"
            bgColor="transparent"
            textColor={cx("font-bold", {
              "text-darkPurple": isPlaintiff,
              "text-darkPetrol": !isPlaintiff,
            })}
          >
            Text verfassen
          </Button>
        )}
        {isNewEntryVisible && (
          <NewEntry
            parentRole={entry.role}
            setIsNewEntryVisible={() => setIsNewEntryVisible(false)}
            viewedBy={viewedBy}
          />
        )}
      </div>
    </div>
  );
};
