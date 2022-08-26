import { CaretDown, CaretUp } from "phosphor-react";

const moveSectionButtons = [
  {
    icon: <CaretUp size={14} weight="bold" />,
    title: "Nach oben verschieben",
    onClick: () => {},
  },
  {
    icon: <CaretDown size={14} weight="bold" />,
    title: "Nach unten verschieben",
    onClick: () => {},
  },
];

export const SectionControls = () => {
  return (
    <div className="flex gap-1 flex-col">
      {moveSectionButtons.map((button, index) => (
        <button
          key={`${index}-${button.title}`}
          className="flex items-center py-1 px-2 bg-lightGrey hover:bg-mediumGrey text-darkGrey hover:text-white rounded transition-all"
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};
