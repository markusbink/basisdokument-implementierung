import cx from "classnames";
import { useUser } from "../../contexts";
import { UserRole } from "../../types";
import { SectionControls } from "./SectionControls";

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

  const currentRole = "Kläger";

  return (
    <div
      className={cx("flex gap-6", {
        "grid grid-cols-2": user?.role === UserRole.Judge,
      })}
    >
      {/* Section Number */}
      <div className="flex gap-6">
        <div className="flex gap-4 items-center">
          <SectionControls />
          <div className="bg-darkGrey w-10 h-10 rounded-lg rotate-45 flex items-center justify-center">
            <span className="text-white -rotate-45">{sectionId}</span>
          </div>
        </div>

        {/* Title with User Role */}
        {(user?.role === UserRole.Plaintiff ||
          user?.role === UserRole.Judge) && (
          <div
            className={cx("flex", {
              "flex-col": user?.role === UserRole.Judge,
              "items-center": user?.role !== UserRole.Judge,
            })}
          >
            {user.role === UserRole.Judge && (
              <span className="bg-lightPurple text-darkPurple text-xs font-bold rounded-md px-2 py-1 w-fit uppercase">
                {UserRole.Plaintiff}
              </span>
            )}
            <h2 className="text-xl font-bold">{titlePlaintiff}</h2>
          </div>
        )}
      </div>
      {/* Title with User Role */}
      {(user?.role === UserRole.Defendant || user?.role === UserRole.Judge) && (
        <div
          className={cx("flex", {
            "flex-col": user?.role === UserRole.Judge,
            "items-center": user?.role !== UserRole.Judge,
          })}
        >
          {user.role === UserRole.Judge && (
            <span className="bg-lightPetrol text-darkPetrol text-xs font-bold rounded-md px-2 py-1 w-fit uppercase">
              {UserRole.Defendant}
            </span>
          )}
          <h2 className="text-xl font-bold">{titleDefendant}</h2>
          {/* <DropdownSection></DropdownSection> */}
        </div>
      )}
    </div>
  );
};
