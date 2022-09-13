import cx from "classnames";
import { Check, Scales, X } from "phosphor-react";
import { useRef, useState } from "react";
import { useCase } from "../../contexts";
import { useOutsideClick } from "../../hooks/use-outside-click";

interface LitigiousCheckProps {
  rowId: string;
}

export const LitigiousCheck: React.FC<LitigiousCheckProps> = ({ rowId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLSpanElement>(null);
  const { litigiousChecks, setLitigiousChecks } = useCase();
  useOutsideClick(menuRef, () => closeMenu());

  const isLitigious = litigiousChecks.filter(
    (check) => check.entryId === rowId
  )[0]?.isLitigious;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const removeLitigiousCheck = () => {
    setLitigiousChecks(
      litigiousChecks.filter((check) => check.entryId !== rowId)
    );
  };

  const setLitigiousCheck = (isLitigious: boolean) => {
    // Create new litigious check if it doesn't exist yet in the litigious checks array
    if (
      !litigiousChecks.filter(
        (litigiousCheck) => litigiousCheck.entryId === rowId
      )[0]
    ) {
      setLitigiousChecks([...litigiousChecks, { entryId: rowId, isLitigious }]);
    }
    // Otherwise, update the litigious check in the litigious checks array
    else {
      setLitigiousChecks(
        litigiousChecks.map((litigiousCheck) =>
          litigiousCheck.entryId === rowId
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
        "relative flex gap-2 items-center justify-center cursor-pointer rounded bg-white text-black text-sm font-semibold px-4 py-2",
        {
          "border border-mediumGrey/50": isLitigious === undefined,
          "bg-red-100 border border-vibrantRed": isLitigious,
          "bg-green-100 border border-vibrantGreen": isLitigious === false,
        }
      )}>
      {isLitigious === undefined && (
        <>
          <Scales size={14} weight="bold" /> Keine Strittigkeitsprüfung
        </>
      )}
      {isLitigious && (
        <>
          <X size={14} weight="bold" /> Strittig
        </>
      )}
      {isLitigious === false && (
        <>
          <Check size={14} weight="bold" /> Unstrittig
        </>
      )}
      {isMenuOpen && (
        <ul className="absolute top-full p-2 !mt-2 bg-white text-darkGrey rounded-xl min-w-[250px] shadow-lg z-50">
          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              removeLitigiousCheck();
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 !mt-0 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
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
            className="flex items-center gap-2 p-2 !mt-0 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
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
            className="flex items-center gap-2 p-2 !mt-0 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none">
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
