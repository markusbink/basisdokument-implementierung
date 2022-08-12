import cx from "classnames";
import { ArrowBendLeftUp } from "phosphor-react";
import React, { useState } from "react";
import { IEntry, UserRole } from "../../types";
import { Button } from "../Button";
import { EntryBody } from "./EntryBody";
import { EntryHeader } from "./EntryHeader";

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

  const isJudge = viewedBy === UserRole.Judge;
  const isPlaintiff = entry.role === UserRole.Plaintiff;
  const isOwnEntry =
    (viewedBy === UserRole.Plaintiff && entry.role === "Kläger") ||
    (viewedBy === UserRole.Defendant && entry.role === "Beklagter");

  const toggleBody = (e: React.MouseEvent) => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`flex flex-col ${isPlaintiff ? "" : "items-end"}`}>
      <div className="w-1/2">
        <div>
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
        {isJudge || !isOwnEntry ? (
          <Button
            icon={<ArrowBendLeftUp weight="bold" size={18} />}
            size="sm"
            bgColor="transparent"
            textColor={`font-bold ${
              isPlaintiff ? "text-darkPurple" : "text-darkPetrol"
            }`}
          >
            Text verfassen
          </Button>
        ) : null}
      </div>
    </div>
  );
};
