import cx from "classnames";
import { useCase, useUser } from "../../contexts";
import { ISection, UserRole } from "../../types";
import { SectionControls } from "./SectionControls";
import { SectionDropdown } from "./SectionDropdown";
import { SectionTitle } from "./SectionTitle";

interface SectionHeaderProps {
  sectionId: number;
  section: ISection;
  position: number;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  sectionId,
  section,
  position,
}) => {
  const { user } = useUser();
  const { currentVersion } = useCase();
  const isOld = section.version < currentVersion;

  return (
    <div className={cx("grid grid-cols-2 gap-6 items-start pb-4 pt-12 w-full")}>
      {/* Section Number */}
      <div
        className={cx("flex gap-6 items-center", {
          "w-full": user?.role !== UserRole.Defendant,
        })}>
        <div className="flex gap-4 items-center relative">
          <SectionControls position={position} version={section.version} />
          <div className="ml-1 bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
            <span className="text-white font-bold -rotate-45">{sectionId}</span>
          </div>
        </div>

        {/* Title with User Role */}
        <SectionTitle
          id={section.id}
          role={UserRole.Plaintiff}
          title={section.titlePlaintiff}
          version={section.version}
        />
      </div>
      {/* Title with User Role */}
      <div className="flex w-full gap-6 items-start">
        <SectionTitle
          id={section.id}
          role={UserRole.Defendant}
          title={section.titleDefendant}
          version={section.version}
        />
        {((!isOld && user?.role !== UserRole.Judge) ||
          user?.role === UserRole.Judge) && (
          <div className="mt-9">
            <SectionDropdown sectionId={section.id} version={section.version} />
          </div>
        )}
      </div>
    </div>
  );
};
