import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { DotsThree, Eye, PencilSimple, Trash } from "phosphor-react";
import React, { useRef, useState } from "react";
import { useCase, useHints } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { IHint } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";

export interface HintProps {
  hint: IHint;
}

export const Hint: React.FC<HintProps> = ({ hint }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));
  const { entries } = useCase();
  const { hints, setHints } = useHints();
  const {
    setShowJudgeHintPopup,
    setTitle,
    setEditorState,
    setOpenedHintId,
    setAssociatedEntryId,
    setEditMode,
  } = useHints();

  let entryCode;
  if (hint.associatedEntry) {
    try {
      entryCode = getEntryCode(entries, hint.associatedEntry);
    } catch {}
  }

  const editHint = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    setShowJudgeHintPopup(true);
    setTitle(hint.title);
    setOpenedHintId(hint.id);
    setEditMode(true);
    if (hint.associatedEntry) {
      setAssociatedEntryId(hint.associatedEntry);
    }
    const blocksFromHTML = convertFromHTML(hint.text);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  };

  const deleteHint = (e: React.MouseEvent) => {
    setHints(hints.filter(item => item.id !== hint.id));
  };

  return (
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {hint.associatedEntry && (
          <a
            href={`#${entryCode}`}
            className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit cursor-pointer
              bg-darkGrey hover:bg-mediumGrey text-lightGrey text-[10px] font-semibold rounded-xl"
          >
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${entryCode ? entryCode : "nicht verfügbar"}`}
          </a>
        )}

        <div className={cx("mx-3", { "mt-3": !hint.associatedEntry })}>
          <h3 className="mb-2 text-sm font-bold">{hint.title}</h3>
          <p className="mb-2"dangerouslySetInnerHTML={{ __html: hint.text }} ></p>

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{hint.author}</div>
              <div className="opacity-40">
                {/* {`${String(hint.timestamp.getDate()).padStart(2, "0")}.
            ${String(hint.timestamp.getMonth()).padStart(2, "0")}.
            ${hint.timestamp.getFullYear()}`} */}
                {"Timestamp"}
              </div>
            </div>

            <div ref={ref} className="self-end relative">
              <Button
                key="createHint"
                bgColor={
                  isMenuOpen ? "bg-lightGrey" : "bg-offWhite hover:bg-lightGrey"
                }
                size="sm"
                textColor="text-darkGrey"
                hasText={false}
                alternativePadding="p-1"
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                }}
                icon={<DotsThree size={20} weight="bold" />}
              ></Button>{" "}
              {isMenuOpen ? (
                <ul className="absolute right-0 bottom-8 p-2 bg-white text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                  <li
                    tabIndex={0}
                    onClick={editHint}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                  >
                    <PencilSimple size={16} />
                    Bearbeiten
                  </li>
                  <li
                    tabIndex={0}
                    onClick={deleteHint}
                    className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none"
                  >
                    <Trash size={16} />
                    Löschen
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
