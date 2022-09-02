import { SidebarHeader } from "./SidebarHeader";
import cx from "classnames";
import { useSidebar } from "../../contexts/SidebarContext";

export const Sidebar = () => {
  const {
    sidebars,
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebar,
    setActiveSidebar,
  } = useSidebar();

  return (
    <aside
      className={cx(
        "h-full overflow-y-clip shadow-lg divide-y-[1px] divide-lightGrey transition-width duration-300",
        {
          "w-[65px] overflow-hidden": !isSidebarOpen,
          "w-[400px]": isSidebarOpen,
        }
      )}>
      <SidebarHeader
        setActiveSidebar={setActiveSidebar}
        sidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
      />
      {sidebars.map(
        (sidebar) =>
          sidebar.name === activeSidebar && isSidebarOpen && sidebar.jsxElem
      )}
    </aside>
  );
};
