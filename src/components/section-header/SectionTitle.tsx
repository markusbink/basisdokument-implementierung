import cx from "classnames";
import { useState } from "react";
import { useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";
import { SectionDropdown } from "./SectionDropdown";

interface SectionTitleProps {
  id: string;
  title: string;
  role: UserRole;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  id,
  title,
  role,
}) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { setSectionList } = useSection();

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionList((prevState) => {
      const newState = [...prevState];
      const section = newState.find((s) => s.id === id);
      if (section) {
        if (role === UserRole.Plaintiff) {
          section.titlePlaintiff = e.target.value;
        } else {
          section.titleDefendant = e.target.value;
        }
      }
      return newState;
    });
  };

  return (
    <div
      className={cx("flex w-full", {
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
        className={cx("flex items-start gap-2 w-full", {
          "py-3": user?.role !== UserRole.Judge,
        })}
      >
        <input
          readOnly={!isEditing}
          className="bg-transparent text-xl font-bold w-full outline-none"
          placeholder="Optionalen Titel vergeben"
          type="text"
          autoFocus={true}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setIsEditing(false);
            }
          }}
          onClick={() => setIsEditing(true)}
          onChange={changeTitle}
          onBlur={() => setIsEditing(false)}
          value={title}
        />
        <SectionDropdown />
      </div>
    </div>
  );
};
