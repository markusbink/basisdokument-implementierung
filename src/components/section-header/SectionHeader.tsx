import cx from "classnames";
import { useUser } from "../../contexts";
import { ISection, UserRole } from "../../types";
import { SectionControls } from "./SectionControls";
import { SectionTitle } from "./SectionTitle";

interface SectionHeaderProps {
  sectionId: number;
  section: ISection;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionId,
  section,
}) => {
  const { user } = useUser();

  return (
    <div
      className={cx("flex gap-6 pb-4 pt-12 items-start w-full", {
        "grid grid-cols-2": user?.role === UserRole.Judge,
      })}>
      {/* Section Number */}
      <div
        className={cx("flex gap-6 items-start", {
          "w-full": user?.role !== UserRole.Defendant,
        })}>
        <div className="flex gap-4 items-center">
          <SectionControls />
          <div className="bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
            <span className="text-white font-bold -rotate-45">{sectionId}</span>
          </div>
        </div>

        {/* Title with User Role */}
        {(user?.role === UserRole.Plaintiff ||
          user?.role === UserRole.Judge) && (
          <SectionTitle
            id={section.id}
            role={UserRole.Plaintiff}
            title={section.titlePlaintiff}
          />
        )}
      </div>
      {/* Title with User Role */}
      {(user?.role === UserRole.Defendant || user?.role === UserRole.Judge) && (
        <SectionTitle
          id={section.id}
          role={UserRole.Defendant}
          title={section.titleDefendant}
        />
      )}
    </div>
  );
};
