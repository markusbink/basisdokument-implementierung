import { CaretDown, CaretUp } from "phosphor-react";
import { useHeaderContext, useSection } from "../../contexts";
import cx from "classnames";
import { Sorting } from "../../types";

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

export const SectionControls: React.FC<SectionControlsProps> = ({
  position,
}) => {
  const { sectionList, setSectionList, setIndividualSorting } = useSection();
  const { selectedSorting } = useHeaderContext();

  const canMoveUp = position > 0;
  const canMoveDown = position < sectionList.length - 1;

  const moveSection = <T,>(direction: Direction, sectionList: T[]) => {
    const moveBy = direction === Direction.Up ? -1 : 1;

    const newSectionList = [...sectionList];
    [newSectionList[position + moveBy], newSectionList[position]] = [
      newSectionList[position],
      newSectionList[position + moveBy],
    ];
    return newSectionList;
  };

  const handleMoveSection = (direction: Direction) => {
    if (
      (!canMoveUp && direction === Direction.Up) ||
      (!canMoveDown && direction === Direction.Down)
    ) {
      return;
    }

    switch (direction) {
      case Direction.Up:
        if (selectedSorting === Sorting.Original) {
          setSectionList((prevSectionList) =>
            moveSection(direction, prevSectionList)
          );
        } else {
          setIndividualSorting((prevSorting) =>
            moveSection(direction, prevSorting)
          );
        }
        break;
      case Direction.Down:
        if (selectedSorting === Sorting.Original) {
          setSectionList((prevSectionList) =>
            moveSection(direction, prevSectionList)
          );
        } else {
          setIndividualSorting((prevSorting) =>
            moveSection(direction, prevSorting)
          );
        }
        break;
      default:
        throw new Error(
          `Unsupported direction used. Only ${Sorting.Original} and ${Sorting.Privat} are available.`
        );
    }
  };

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
          )}>
          {button.icon}
        </button>
      ))}
    </div>
  );
};
