import { CaretDown, CaretUp } from "phosphor-react";
import { useCase, useHeaderContext, useSection } from "../../contexts";
import cx from "classnames";
import { ISection, Sorting } from "../../types";

const enum Direction {
  Up = "up",
  Down = "down",
}

const moveSectionButtons = [
  {
    icon: <CaretUp size={14} weight="bold" />,
    title: "Nach oben verschieben",
    action: Direction.Up,
  },
  {
    icon: <CaretDown size={14} weight="bold" />,
    title: "Nach unten verschieben",
    action: Direction.Down,
  },
];

interface SectionControlsProps {
  position: number;
  version: number;
}

const isPreviousSectionMovable = (
  sectionList: ISection[],
  clickedPosition: number,
  currentVersion: number
) => {
  return sectionList[clickedPosition - 1]?.version === currentVersion;
};

export const SectionControls: React.FC<SectionControlsProps> = ({
  position,
  version,
}) => {
  const { sectionList, setSectionList, setIndividualSorting } = useSection();
  const { currentVersion } = useCase();
  const { selectedSorting } = useHeaderContext();

  const isMoveable = version === currentVersion;
  const canMoveUp =
    position > 0 &&
    isPreviousSectionMovable(sectionList, position, currentVersion);
  const canMoveDown = position < sectionList.length - 1;

  const handleMoveSection = (direction: Direction) => {
    if (!canMoveUp || !canMoveDown) {
      return;
    }
  };

  if (!isMoveable && selectedSorting === Sorting.Original) {
    return null;
  }

  return (
    <div className="flex gap-1 flex-col">
      {moveSectionButtons.map((button, index) => (
        <button
          key={`${index}-${button.title}`}
          onClick={() => handleMoveSection(button.action)}
          className={cx(
            "flex items-center py-1 px-2 bg-lightGrey hover:bg-mediumGrey text-darkGrey hover:text-white rounded transition-all",
            {
              // Disabled buttons when cannot move up or down
              "cursor-not-allowed opacity-50":
                (!canMoveUp && button.action === Direction.Up) ||
                (!canMoveDown && button.action === Direction.Down),
            }
          )}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
