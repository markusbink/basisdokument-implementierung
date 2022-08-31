import cx from "classnames";
import { Check, X } from "phosphor-react";
import { useRef, useState } from "react";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";

interface LitigiousCheckProps {
  entryId: string;
}

export const LitigiousCheck: React.FC<LitigiousCheckProps> = ({ entryId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLSpanElement>(null);
  const { litigiousChecks, setLitigiousChecks } = useCase();
  useOutsideClick(menuRef, () => closeMenu());

  const isLitigious = litigiousChecks.filter(
    (check) => check.entryId === entryId
  )[0]?.isLitigious;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const removeLitigiousCheck = () => {
    setLitigiousChecks(
      litigiousChecks.filter((check) => check.entryId !== entryId)
    );
  };

  const setLitigiousCheck = (isLitigious: boolean) => {
    // Create new litigious check if it doesn't exist yet in the litigious checks array
    if (!litigiousChecks.filter((check) => check.entryId === entryId)[0]) {
      setLitigiousChecks([...litigiousChecks, { entryId, isLitigious }]);
    }
    // Otherwise, update the litigious check in the litigious checks array
    else {
      setLitigiousChecks(
        litigiousChecks.map((litigiousCheck) =>
          litigiousCheck.entryId === entryId
            ? { ...litigiousCheck, isLitigious }
            : litigiousCheck
        )
      );
    }
  };

  return (
    <span
      ref={menuRef}
      onClick={(e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
      }}
      className={cx(
        "flex items-center justify-center cursor-pointer absolute bottom-0 right-0 translate-x-1 translate-y-1 z-10 rounded-full bg-offWhite text-white  h-6 w-6",
        {
          "border-2 border-mediumGrey": isLitigious === undefined,
          "bg-vibrantRed": isLitigious,
          "bg-vibrantGreen": isLitigious === false,
        }
      )}>
      {isLitigious && <X size={14} weight="bold" />}
      {isLitigious === false && <Check size={14} weight="bold" />}
      {isMenuOpen && (
        <ul className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl min-w-[250px] shadow-lg z-50">
          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              removeLitigiousCheck();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
            <CircleWithIcon isLitigious={null} />
            Zurücksetzen
          </li>

          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setLitigiousCheck(false);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
            <CircleWithIcon
              icon={<Check size={12} weight="bold" />}
              isLitigious={false}
            />
            Als unstreitig markieren
          </li>
          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setLitigiousCheck(true);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
            <CircleWithIcon
              icon={<X size={12} weight="bold" />}
              isLitigious={true}
            />
            Als streitig markieren
          </li>
        </ul>
      )}
    </span>
  );
};

interface CircleWithIconProps {
  icon?: React.ReactNode;
  isLitigious?: boolean | null;
}

const CircleWithIcon: React.FC<CircleWithIconProps> = ({
  icon,
  isLitigious,
}) => {
  return (
    <div
      className={cx(
        "w-4 h-4 flex items-center justify-center rounded-full bg-offWhite text-white",
        {
          "border border-mediumGrey": isLitigious === null,
          "bg-vibrantRed": isLitigious,
          "bg-vibrantGreen": isLitigious === false,
        }
      )}>
      {icon}
    </div>
  );
};
