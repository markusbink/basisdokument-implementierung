import { Tooltip } from "../Tooltip";
import cx from "classnames";
import { Signpost } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { useCase, useHeaderContext, useSection, useUser } from "../../contexts";
import { getTheme } from "../../themes/getTheme";
import { UserRole } from "../../types";
import { useOutsideClick } from "../../hooks/use-outside-click";

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
  const [suggestionsActive, setSuggestionsActive] = useState<boolean>(false);

  const { user } = useUser();
  const { setSectionList } = useSection();
  const { currentVersion } = useCase();
  const isOld =
    version != null &&
    version < currentVersion &&
    !(typeof title === "string" && title.trim().length === 0);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const changeTitle = (t: string) => {
    setSectionList((prevState) => {
      const newState = [...prevState];
      const section = newState.find((s) => s.id === id);

      if (section) {
        if (role === UserRole.Plaintiff) {
          section.titlePlaintiff = t;
          section.titlePlaintiffVersion = currentVersion;
        } else {
          section.titleDefendant = t;
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

  const menuRef = useRef(null);
  useOutsideClick(menuRef, (e) => {
    if (title.trim().length > 0) {
      setIsEditing(false);
    }
    setSuggestionsActive(false);
    e?.stopPropagation();
  });

  return (
    <div id={id} className={cx("flex w-full flex-col")}>
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
      <div
        ref={menuRef}
        className={cx("flex items-start justify-between gap-2 w-full pt-3")}>
        {isEditing ? (
          <div
            className={cx(
              "flex flex-row justify-between w-full rounded pointer-none outline-none outline-2 outline-offset-2",
              {
                "outline outline-lightGrey":
                  suggestionsActive &&
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
                "hover:outline hover:outline-lightGrey":
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
              }
            )}>
            <input
              autoFocus
              ref={titleInputRef}
              readOnly={
                isOld || (role !== user?.role && user?.role !== UserRole.Judge)
              }
              placeholder={"Bisher kein Titel vergeben"}
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (title.trim().length > 0) {
                    setIsEditing(false);
                  }
                  setSuggestionsActive(false);
                }
              }}
              onChange={(e) => changeTitle(e.target.value)}
              onBlur={() => {
                if (title.trim().length > 0) {
                  setIsEditing(false);
                }
                setSuggestionsActive(false);
              }}
              value={title}
              className={cx(
                "bg-transparent text-xl font-bold w-full outline-none rounded",
                {
                  "hover:cursor-not-allowed":
                    (role !== user?.role && user?.role !== UserRole.Judge) ||
                    isOld,
                }
              )}></input>
            {(role === user?.role || user?.role === UserRole.Judge) &&
              !isOld && (
                <Tooltip text="Vorschläge" className="justify-end mx-2">
                  <div
                    className={cx("rounded p-1 text-mediumGrey opacity-50", {
                      "bg-lightGrey": suggestionsActive,
                    })}
                    onClick={(e) => {
                      setSuggestionsActive(!suggestionsActive);
                      e.stopPropagation();
                    }}>
                    <Signpost size={16}></Signpost>
                  </div>
                </Tooltip>
              )}
          </div>
        ) : (
          <h2
            className={cx(
              "flex flex-row justify-between bg-transparent text-xl font-bold rounded w-full outline-2 outline-offset-2",
              {
                "outline outline-lightGrey":
                  suggestionsActive &&
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
                "hover:outline hover:outline-lightGrey":
                  (role === user?.role || user?.role === UserRole.Judge) &&
                  !isOld,
                "hover:cursor-not-allowed":
                  (role !== user?.role && user?.role !== UserRole.Judge) ||
                  isOld,
              }
            )}
            onClick={() => {
              if (
                (role === user?.role || user?.role === UserRole.Judge) &&
                !isOld
              ) {
                setIsEditing(true);
              }
            }}>
            {title}
            {(role === user?.role || user?.role === UserRole.Judge) &&
              !isOld && (
                <Tooltip text="Vorschläge" className="justify-end mx-2">
                  <div
                    className={cx("rounded p-1 text-mediumGrey opacity-50", {
                      "bg-lightGrey": suggestionsActive,
                    })}
                    onClick={(e) => {
                      setSuggestionsActive(!suggestionsActive);
                      e.stopPropagation();
                    }}>
                    <Signpost size={16}></Signpost>
                  </div>
                </Tooltip>
              )}
          </h2>
        )}
        <div className="relative">
          {suggestionsActive ? (
            <ul
              className="absolute right-0 top-2 p-2 bg-offWhite text-darkGrey rounded-xl w-max h-[180px] overflow-auto shadow-lg z-50 font-medium"
              onClick={(e) => {
                let value = (e.target as HTMLElement).innerHTML;
                if (value && value.length > 0) {
                  changeTitle(value);
                  setIsEditing(false);
                }
                setSuggestionsActive(false);
              }}>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Anträge
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Verjährung
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Rechtliche Würdigung
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Zulässigkeit
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Begründetheit
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Anspruchsgrund
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Anspruchshöhe
              </li>
              <li
                tabIndex={0}
                className="p-1 rounded-lg hover:bg-lightGrey focus:bg-lightGrey focus:outline-none cursor-pointer">
                Vorbemerkung
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};
