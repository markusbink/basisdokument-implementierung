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
        className={cx("flex items-start justify-start gap-2 w-full", {
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
              console.log("onblur");

              if (title.length > 0) {
                setIsEditing(false);
              }
            }}
            value={title}
            className="bg-transparent text-xl font-bold w-full max-w-[250px] outline-none"
          />
        ) : (
          <div
            className="bg-transparent text-xl font-bold outline-offset-[6px] rounded"
            onClick={() => setIsEditing(true)}>
            {title}
          </div>
        )}
        {}
        {((!isOld && user?.role !== UserRole.Judge) ||
          user?.role === UserRole.Judge) && (
          <SectionDropdown version={version} />
        )}
      </div>
    </div>
  );
};
