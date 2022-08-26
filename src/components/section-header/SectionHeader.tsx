import cx from "classnames";
import { useUser } from "../../contexts";
import { UserRole } from "../../types";
import { SectionControls } from "./SectionControls";
import { SectionDropdown } from "./SectionDropdown";
import { SectionTitle } from "./SectionTitle";

interface SectionHeaderProps {
  sectionId: number;
  titlePlaintiff: string;
  titleDefendant: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionId,
  titlePlaintiff,
  titleDefendant,
}) => {
  const { user } = useUser();

  return (
    <div
      className={cx("flex gap-6 py-4 items-start", {
        "grid grid-cols-2": user?.role === UserRole.Judge,
      })}
    >
      {/* Section Number */}
      <div className="flex gap-6 items-start">
        <div className="flex gap-4 items-center">
          <SectionControls />
          <div className="bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
            <span className="text-white font-bold -rotate-45">{sectionId}</span>
          </div>
        </div>

        {/* Title with User Role */}
        {(user?.role === UserRole.Plaintiff ||
          user?.role === UserRole.Judge) && (
          <SectionTitle role={UserRole.Plaintiff} title={titlePlaintiff} />
        )}
      </div>
      {/* Title with User Role */}
      {(user?.role === UserRole.Defendant || user?.role === UserRole.Judge) && (
        <SectionTitle role={UserRole.Defendant} title={titleDefendant} />
      )}
    </div>
  );
};
