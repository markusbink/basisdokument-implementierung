import { CaretDown, CaretUp } from "phosphor-react";
import { useSection } from "../../contexts";
import cx from "classnames";

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
}

export const SectionControls: React.FC<SectionControlsProps> = ({
  position,
}) => {
  const { sectionList } = useSection();
  const canMoveDown = position < sectionList.length - 1;
  const canMoveUp = position > 0;
  const handleMoveSection = (direction: Direction) => {
    console.log({ direction, position });
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
          )}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
