import { SidebarHeader } from "./SidebarHeader";
import cx from "classnames";
import { useSidebar } from "../../contexts/SidebarContext";

export const Sidebar = () => {
  const { sidebars, isSidebarOpen, activeSidebar } = useSidebar();

  return (
    <aside
      className={cx(
        "h-full overflow-y-clip shadow-lg transition-width duration-300",
        {
          "w-[65px] overflow-hidden": !isSidebarOpen,
          "w-[350px]": isSidebarOpen,
        }
      )}>
      <SidebarHeader/>
      {sidebars.map(
        (sidebar) =>
          sidebar.name === activeSidebar && isSidebarOpen && sidebar.jsxElem
      )}
    </aside>
  );
};
