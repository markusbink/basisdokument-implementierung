import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNotes } from "./SidebarNotes";
import cx from "classnames";
import { SidebarHints } from "./SidebarHints";
import { SidebarBookmarks } from "./SidebarBookmarks";

const sidebars = [
  {
    name: "Notes",
    jsxElem: <SidebarNotes key="Notes"></SidebarNotes>,
  },
  {
    name: "Hints",
    jsxElem: <SidebarHints key="Hints"></SidebarHints>,
  },
  {
    name: "Bookmarks",
    jsxElem: <SidebarBookmarks key="Bookmarks"></SidebarBookmarks>,
  },
];

export const Sidebar = () => {
  const [activeSidebar, setActiveSidebar] = useState<string>(sidebars[0].name);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside
      className={cx(
        "h-full overflow-y-clip shadow-lg divide-y-[1px] divide-lightGrey transition-width duration-300",
        {
          "w-[65px] min-w-[65px] max-w-[65px]": !sidebarOpen,
          "w-[350px] min-w-[350px] max-w-[350px]": sidebarOpen,
        }
      )}>
      <SidebarHeader
        setActiveSidebar={setActiveSidebar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebars.map(
        (sidebar) =>
          sidebar.name === activeSidebar && sidebarOpen && sidebar.jsxElem
      )}
    </aside>
  );
};
