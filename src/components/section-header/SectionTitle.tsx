import cx from "classnames";
import { useEffect, useRef, useState } from "react";
import { useCase, useHeaderContext, useSection, useUser } from "../../contexts";
import { getTheme } from "../../themes/getTheme";
import { UserRole } from "../../types";

interface SectionTitleProps {
  id: string;
  title: string;
  role: UserRole;
  version?: number;
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
  const isOld =
    version != null &&
    version < currentVersion &&
    !(typeof title === "string" && title.trim().length === 0);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSectionList((prevState) => {
      const newState = [...prevState];
      const section = newState.find((s) => s.id === id);

      if (section) {
        if (role === UserRole.Plaintiff) {
          section.titlePlaintiff = e.target.value;
          section.titlePlaintiffVersion = currentVersion;
        } else {
          section.titleDefendant = e.target.value;
          section.titleDefendantVersion = currentVersion;
        }
      }
      return newState;
    });
  };

  const { selectedTheme } = useHeaderContext();

  useEffect(() => {
    if (!title) {
      setIsEditing(true);
    }
  }, [title]);

  return (
    <div id={id} className={cx("flex w-full flex-col pt-2")}>
      <span
        className={cx(
          "text-xs font-bold rounded-md px-2 py-1 w-fit uppercase text-darkGrey",
          {
            [`bg-${getTheme(selectedTheme)?.secondaryPlaintiff} text-${
              getTheme(selectedTheme)?.primaryPlaintiff
            }`]: role === UserRole.Plaintiff,
            [`bg-${getTheme(selectedTheme)?.secondaryDefendant} text-${
              getTheme(selectedTheme)?.primaryDefendant
            }`]: role === UserRole.Defendant,
          }
        )}>
        {role}
      </span>
      <div className={cx("flex items-start justify-between gap-2 w-full pt-3")}>
        {isEditing ? (
          <input
            ref={titleInputRef}
            readOnly={
              isOld || (role !== user?.role && user?.role !== UserRole.Judge)
            }
            placeholder={"Bisher kein Titel vergeben " + version}
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
                "focus:outline focus:outline-offset-2 focus:outline-darkGrey":
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
