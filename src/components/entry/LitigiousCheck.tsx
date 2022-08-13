import cx from "classnames";
import { Check, Pencil, Trash, X } from "phosphor-react";
import { useState } from "react";

interface LitigiousCheckProps {
  isLitigious: boolean | null;
  setIsLitigious: (isLitigious: boolean | null) => void;
}

export const LitigiousCheck: React.FC<LitigiousCheckProps> = ({
  isLitigious,
  setIsLitigious,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
      }}
      className={cx(
        "flex items-center justify-center cursor-pointer absolute bottom-0 right-0 translate-x-1 translate-y-1 z-10 rounded-full bg-offWhite text-white  h-6 w-6",
        {
          "border-2 border-mediumGrey": isLitigious === null,
          "bg-vibrantRed": isLitigious,
          "bg-vibrantGreen": isLitigious === false,
        }
      )}
    >
      {isLitigious && <X size={14} weight="bold" />}
      {isLitigious === false && <Check size={14} weight="bold" />}
      {isMenuOpen && (
        <ul className="absolute right-0 top-full p-2 bg-white text-darkGrey rounded-xl min-w-[250px] shadow-lg z-50">
          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setIsLitigious(null);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
          >
            <CircleWithIcon isLitigious={null} />
            Zurücksetzen
          </li>

          <li
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setIsLitigious(false);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
          >
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
              setIsLitigious(true);
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-offWhite focus:bg-offWhite focus:outline-none"
          >
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
      )}
    >
      {icon}
    </div>
  );
};
