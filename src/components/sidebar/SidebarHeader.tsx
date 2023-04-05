import { List } from "phosphor-react";
import cx from "classnames";
import { Button } from "../Button";
import { useSidebar } from "../../contexts/SidebarContext";

export const SidebarHeader = () => {
  const {
    sidebars,
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebar,
    setActiveSidebar,
  } = useSidebar();

  return (
    <div
      className={cx(
        "flex flex-row items-center h-14 border-b-[0.5px] border-lightGrey px-4 w-[350px]",
        {
          "justify-between": isSidebarOpen,
        }
      )}>
      <div
        className={cx("transition duration-300", {
          "rotate-90": isSidebarOpen,
          "rotate-0": !isSidebarOpen,
        })}>
        <Button
          key={"sidebarActive"}
          bgColor="transparent hover:bg-lightGrey"
          size="sm"
          textColor="font-bold text-darkGrey"
          hasText={false}
          alternativePadding="py-1.5 px-1.5"
          icon={<List size={20} />}
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>
      <div
        className={cx("flex flex-row gap-3", {
          hidden: !isSidebarOpen,
        })}>
        {sidebars.map((sidebar) => (
          <Button
            key={sidebar.name}
            bgColor={
              sidebar.name === activeSidebar
                ? "bg-offWhite hover:bg-lightGrey"
                : "transparent hover:bg-lightGrey"
            }
            size="sm"
            textColor="font-bold text-darkGrey"
            icon={sidebar.icon}
            hasText={false}
            alternativePadding="py-1.5 px-2"
            onClick={() => {
              setActiveSidebar(sidebar.name);
            }}
          />
        ))}
      </div>
    </div>
  );
};
