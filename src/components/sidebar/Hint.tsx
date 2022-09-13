import cx from "classnames";
import { ContentState, convertFromHTML, EditorState } from "draft-js";
import { DotsThree, Eye, PencilSimple, Trash } from "phosphor-react";
import React, { useRef, useState } from "react";
import { useCase, useHeaderContext, useHints, useUser } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { getTheme } from "../../themes/getTheme";
import { IHint } from "../../types";
import { getEntryCode } from "../../util/get-entry-code";
import { Button } from "../Button";
import { ErrorPopup } from "../ErrorPopup";

export interface HintProps {
  hint: IHint;
}

export const Hint: React.FC<HintProps> = ({ hint }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ref = useRef(null);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] =
    useState<boolean>(false);
  useOutsideClick(ref, () => setIsMenuOpen(false));
  const { entries, currentVersion } = useCase();
  const { hints, setHints } = useHints();
  const { user } = useUser();
  const { versionHistory, selectedTheme } = useHeaderContext();
  const {
    setShowJudgeHintPopup,
    setTitle,
    setEditorState,
    setOpenedHintId,
    setAssociatedEntryIdHint,
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
      setAssociatedEntryIdHint(hint.associatedEntry);
    }
    const blocksFromHTML = convertFromHTML(hint.text);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  };

  const deleteHint = () => {
    setHints(hints.filter((item) => item.id !== hint.id));
  };

  return (
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {hint.associatedEntry && (
          <a
            href={`#${entryCode}`}
            className={cx(
              "flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit cursor-pointer text-[10px] font-semibold rounded-xl",
              {
                "bg-darkGrey text-offWhite hover:bg-mediumGrey": !entryCode,
                [`bg-${getTheme(selectedTheme)?.secondaryLeft} text-${
                  getTheme(selectedTheme)?.primaryLeft
                } hover-bg-${getTheme(selectedTheme)?.primaryLeft} hover-text-${
                  getTheme(selectedTheme)?.secondaryLeft
                }`]: entryCode?.charAt(0) === "K",
                [`bg-${getTheme(selectedTheme)?.secondaryRight} text-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-bg-${
                  getTheme(selectedTheme)?.primaryRight
                } hover-text-${getTheme(selectedTheme)?.secondaryRight}`]:
                  entryCode?.charAt(0) === "B",
              }
            )}>
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${entryCode ? entryCode : "nicht verfügbar"}`}
          </a>
        )}

        <div className={cx("mx-3", { "mt-3": !hint.associatedEntry })}>
          <h3 className="mb-2 text-sm font-bold">{hint.title}</h3>
          <p
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: hint.text }}></p>

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{hint.author}</div>

              {hint.version !== currentVersion ? (
                <div className="opacity-40">{`${new Date(
                  Date.parse(versionHistory[hint.version - 1].timestamp)
                ).toLocaleString("de-DE")}`}</div>
              ) : null}
            </div>

            {hint.version === currentVersion && user?.role === "Richter:in" ? (
              <div ref={ref} className="self-end relative">
                <Button
                  key="createHint"
                  bgColor={
                    isMenuOpen
                      ? "bg-lightGrey"
                      : "bg-offWhite hover:bg-lightGrey"
                  }
                  size="sm"
                  textColor="text-darkGrey"
                  hasText={false}
                  alternativePadding="p-1"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  icon={<DotsThree size={20} weight="bold" />}></Button>{" "}
                {isMenuOpen ? (
                  <ul className="absolute right-0 bottom-8 p-2 bg-white text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
                    <li
                      tabIndex={0}
                      onClick={editHint}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                      <PencilSimple size={16} />
                      Bearbeiten
                    </li>

                    <li
                      tabIndex={0}
                      onClick={() => setIsDeleteErrorVisible(true)}
                      className="flex items-center gap-2 p-2 rounded-lg text-vibrantRed hover:bg-offWhite focus:bg-offWhite focus:outline-none cursor-pointer">
                      <Trash size={16} />
                      Löschen
                    </li>
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ErrorPopup isVisible={isDeleteErrorVisible}>
        <div className="flex flex-col items-center justify-center space-y-8">
          <p className="text-center text-base font-normal">
            Sind Sie sicher, dass Sie den Hinweis <b>{hint.title}</b> löschen
            möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              bgColor="bg-lightGrey hover:bg-mediumGrey/50"
              textColor="text-mediumGrey font-bold hover:text-lightGrey"
              onClick={() => {
                setIsDeleteErrorVisible(false);
              }}>
              Abbrechen
            </Button>
            <Button
              bgColor="bg-lightRed hover:bg-darkRed/25"
              textColor="text-darkRed font-bold"
              onClick={() => {
                setIsDeleteErrorVisible(false);
                deleteHint();
              }}>
              Hinweis löschen
            </Button>
          </div>
        </div>
      </ErrorPopup>
    </div>
  );
};
