import cx from "classnames";
import { useEffect, useState } from "react";
import { useCase, useSection, useUser } from "../../contexts";
import { UserRole } from "../../types";
import { SectionDropdown } from "./SectionDropdown";

interface SectionTitleProps {
  id: string;
  title: string;
  role: UserRole;
  version: number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  id,
  title,
  role,
  version,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useUser();
  const { setSectionList } = useSection();
  const { currentVersion } = useCase();
  const isOld = version < currentVersion;

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

  useEffect(() => {
    if (!title) {
      setIsEditing(true);
    }
  }, [title]);

  return (
    <div
      className={cx("flex w-full", {
        "flex-col": user?.role === UserRole.Judge,
        "items-center gap-2": user?.role !== UserRole.Judge,
      })}>
      {user?.role === UserRole.Judge && (
        <span
          className={cx(
            "text-xs font-bold rounded-md px-2 py-1 w-fit uppercase",
            {
              "bg-lightPurple text-darkPurple": role === UserRole.Plaintiff,
              "bg-lightPetrol text-darkPetrol": role === UserRole.Defendant,
            }
          )}>
          {role}
        </span>
      )}
      <div
        className={cx("flex items-start justify-between gap-2 w-full", {
          "py-3": user?.role !== UserRole.Judge,
        })}>
        {isEditing ? (
          <input
            placeholder="Optionalen Titel vergeben"
            type="text"
            autoFocus={true}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (title.length > 0) {
                  setIsEditing(false);
                }
                e.currentTarget.blur();
              }
            }}
            onChange={changeTitle}
            onBlur={() => {
              if (title.length > 0) {
                setIsEditing(false);
              }
            }}
            value={title}
            className="bg-transparent text-xl font-bold w-full outline-none"
          />
        ) : (
          <h2
            className="bg-transparent text-xl font-bold outline-offset-[6px] rounded"
            onClick={() => setIsEditing(true)}>
            {title}
          </h2>
        )}

        {((!isOld && user?.role !== UserRole.Judge) ||
          user?.role === UserRole.Judge) && (
          <SectionDropdown sectionId={id} version={version} />
        )}
      </div>
    </div>
  );
};
