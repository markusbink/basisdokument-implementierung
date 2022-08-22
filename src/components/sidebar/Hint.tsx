import { Eye, DotsThree, PencilSimple, Trash } from "phosphor-react";
import { useRef, useState } from "react";
import { Button } from "../Button";
import cx from "classnames";
import { useOutsideClick } from "../../hooks/use-outside-click";

export interface HintProps {
  id: string;
  title: string;
  content?: string;
  author: string;
  timestamp: Date;
  referenceTo?: string;
}

export const Hint: React.FC<HintProps> = (hint: HintProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setIsMenuOpen(false));

  const showReference = (e: React.MouseEvent) => {
    //TODO jump to reference
  };

  const editHint = (e: React.MouseEvent) => {
    setIsMenuOpen(false);
    //TODO open Popup
  };

  const deleteHint = (e: React.MouseEvent) => {
    //TODO
  };

  return (
    <div>
      <div className="flex flex-col bg-offWhite mt-4 rounded-xl text-darkGrey text-xs font-medium">
        {hint.referenceTo && (
          <div
            className="flex gap-1 mt-1.5 mr-1.5 px-1.5 py-0.5 self-end w-fit cursor-pointer
              bg-darkGrey hover:bg-mediumGrey text-lightGrey text-[10px] font-semibold rounded-xl"
            onClick={showReference}
          >
            <Eye size={16} weight="bold" className="inline"></Eye>
            {`${hint.referenceTo}`}
          </div>
        )}

        <div className={cx("mx-3", { "mt-3": !hint.referenceTo })}>
          <div className="mb-2 text-sm font-bold">{hint.title}</div>
          <div className="mb-2">{hint.content}</div>

          <div className="flex justify-between items-center mb-3">
            <div className="">
              <div className="font-bold">{hint.author}</div>
              <div className="opacity-40">
                {`${String(hint.timestamp.getDate()).padStart(2, "0")}.
            ${String(hint.timestamp.getMonth()).padStart(2, "0")}.
            ${hint.timestamp.getFullYear()}`}
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
                icon={<DotsThree size={16} weight="bold" />}
              ></Button>{" "}
              {isMenuOpen ? (
                <ul className="absolute right-7 top-0 p-2 bg-lightGrey text-darkGrey rounded-xl w-[150px] shadow-lg z-50 font-medium">
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
