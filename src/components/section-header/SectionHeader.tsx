import cx from "classnames";
import { useCase, useHeaderContext, useUser } from "../../contexts";
import { ISection, Sorting, UserRole } from "../../types";
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
  const { showEntrySorting } = useHeaderContext();
  const { selectedSorting } = useHeaderContext();

  const sectionControlsHidden =
    section.version !== currentVersion && selectedSorting === Sorting.Original;

  const isOld = section.version < currentVersion;

  return (
    <div className={cx("grid grid-cols-2 gap-6 items-start pb-4 pt-12 w-full")}>
      {/* Section Number */}
      <div
        className={cx("flex gap-6 items-center", {
          "w-full": user?.role !== UserRole.Defendant,
        })}>
        <div className="flex gap-4 items-center relative">
          {!sectionControlsHidden && (
            <SectionControls position={position} version={section.version} />
          )}
          <div
            className={cx("", {
              "pl-[46px]": sectionControlsHidden,
            })}>
            <div className="ml-1 bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
              <span className="text-white font-bold -rotate-45">
                {sectionId}
              </span>
            </div>
          </div>
        </div>

        {/* Title with User Role */}
        <SectionTitle
          id={section.id}
          role={UserRole.Plaintiff}
          title={section.titlePlaintiff}
          version={section.titlePlaintiffVersion}
        />
      </div>
      {/* Title with User Role */}
      <div className="flex w-[calc(100%_-_40px)] items-start justify-self-center">
        <SectionTitle
          id={section.id}
          role={UserRole.Defendant}
          title={section.titleDefendant}
          version={section.titleDefendantVersion}
        />
        {((!isOld && user?.role !== UserRole.Judge) ||
          (user?.role === UserRole.Judge && !isOld) ||
          (user?.role === UserRole.Judge && showEntrySorting)) && (
          <div className="mt-9">
            <SectionDropdown sectionId={section.id} version={section.version} />
          </div>
        )}
      </div>
    </div>
  );
};
