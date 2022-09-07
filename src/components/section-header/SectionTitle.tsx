import cx from "classnames";
import { useEffect, useRef, useState } from "react";
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
  const titleInputRef = useRef<HTMLInputElement>(null);

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
    <div className={cx("flex w-full flex-col")}>
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
      <div className={cx("flex items-start justify-between gap-2 w-full py-3")}>
        {isEditing ? (
          <input
            ref={titleInputRef}
            readOnly={role !== user?.role && user?.role !== UserRole.Judge}
            placeholder="Bisher kein Titel vergeben"
            type="text"
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
            className={cx(
              "bg-transparent text-xl font-bold w-full outline-none rounded",
              {
                "focus:outline focus:outline-offset-2 focus:outline-blue-600":
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
                "hover:cursor-not-allowed":
                  (role !== user?.role && user?.role !== UserRole.Judge) ||
                  isOld,
              }
            )}
          />
        ) : (
          <h2
            className={cx(
              "bg-transparent text-xl font-bold outline-offset-[6px] rounded",
              {
                "hover:outline hover:outline-offset-2 hover:outline-blue-600":
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
                "hover:cursor-not-allowed":
                  (role !== user?.role && user?.role !== UserRole.Judge) ||
                  isOld,
              }
            )}
            onClick={() => {
              if (!isOld) {
                setIsEditing(true);
              }
            }}>
            {title}
          </h2>
        )}
      </div>
    </div>
  );
};
