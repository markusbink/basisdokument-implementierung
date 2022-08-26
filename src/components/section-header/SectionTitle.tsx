import { useUser } from "../../contexts";
import { UserRole } from "../../types";
import cx from "classnames";
import { SectionDropdown } from "./SectionDropdown";

interface SectionTitleProps {
  title: string;
  role: UserRole;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, role }) => {
  const { user } = useUser();

  return (
    <div
      className={cx("flex", {
        "flex-col": user?.role === UserRole.Judge,
        "items-center gap-2": user?.role !== UserRole.Judge,
      })}
    >
      {user?.role === UserRole.Judge && (
        <span
          className={cx(
            "text-xs font-bold rounded-md px-2 py-1 w-fit uppercase",
            {
              "bg-lightPurple text-darkPurple": role === UserRole.Plaintiff,
              "bg-lightPetrol text-darkPetrol": role === UserRole.Defendant,
            }
          )}
        >
          {role}
        </span>
      )}
      <div
        className={cx("flex items-start gap-2", {
          "py-3": user?.role !== UserRole.Judge,
        })}
      >
        <h2 className="text-xl font-bold">{title}</h2>
        <SectionDropdown />
      </div>
    </div>
  );
};
