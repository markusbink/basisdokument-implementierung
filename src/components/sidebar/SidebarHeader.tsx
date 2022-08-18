import { Bookmarks, List, Notepad, Scales } from "phosphor-react";
import { useState } from "react";
import cx from "classnames";
import { Button } from "../Button";

interface SidebarProps {
  setActiveSidebar: any;
}

const buttons = [
  {
    name: "Notes",
    icon: <Notepad size={18} />,
  },
  {
    name: "Hints",
    icon: <Scales size={18} />,
  },
  {
    name: "Bookmarks",
    icon: <Bookmarks size={18} />,
  },
];

export const SidebarHeader: React.FC<SidebarProps> = ({ setActiveSidebar }) => {
  const [activeButton, setActiveButton] = useState<string>(buttons[0].name);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div
      className={cx("flex flex-row mb-1", {
        "justify-between": sidebarOpen,
        "justify-end": !sidebarOpen,
      })}
    >
      <div
        className={cx("transition duration-300", {
          "rotate-90": sidebarOpen,
          "rotate-0": !sidebarOpen,
        })}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Button
          key={"sidebarActive"}
          bgColor="transparent"
          size="sm"
          textColor="font-bold text-darkGrey"
          hasText={false}
          alternativePadding="p-2"
          icon={<List size={18} />}
        />
      </div>

      <div
        className={cx("flex flex-row gap-3", {
          hidden: !sidebarOpen,
        })}
      >
        {buttons.map((button) => (
          <Button
            key={button.name}
            bgColor={
              button.name === activeButton ? "bg-offWhite" : "transparent"
            }
            size="sm"
            textColor="font-bold text-darkGrey"
            icon={button.icon}
            hasText={false}
            alternativePadding="py-1.5 px-2"
            onClick={() => {
              setActiveButton(button.name);
              setActiveSidebar(button.name);
            }}
          />
        ))}
      </div>
    </div>
  );
};
