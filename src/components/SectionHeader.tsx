import { CaretDown, CaretUp, DotsThree } from "phosphor-react";
import { Button } from "./Button";

interface SectionHeaderProps {
  sectionId: number;
  titlePlaintiff: string;
  titleDefendant: string;
}

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

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionId,
  titlePlaintiff,
  titleDefendant,
}) => {
  return (
    <div className="text-xl font-bold w-1/2 flex items-center gap-4">
      <div className="flex gap-1 flex-col">
        {moveSectionButtons.map((button, index) => (
          <button className="flex items-center py-1 px-2 bg-lightGrey text-darkGrey rounded">
            {button.icon}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
          <span className="text-white -rotate-45">{sectionId}</span>
        </div>
        <h2 className="">Gliederungspunkt</h2>
      </div>
      <div className="">
        <Button
          icon={<DotsThree size={18} weight="bold" />}
          bgColor="offwhite"
          textColor="lightGrey"
        />
      </div>
    </div>
  );
};
