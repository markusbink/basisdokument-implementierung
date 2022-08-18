import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNotes } from "./SidebarNotes";

const sidebars = [
  {
    name: "Notes",
    jsxElem: <SidebarNotes key="Notes"></SidebarNotes>,
  },
  {
    name: "Hints",
    jsxElem: <div key="Hints">Hints</div>,
  },
  {
    name: "Bookmarks",
    jsxElem: <div key="Bookmarks">Bookmarks</div>,
  },
];

export const Sidebar = () => {
  const [activeSidebar, setActiveSidebar] = useState<string>(sidebars[0].name);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside className="w-[400px] h-full shadow-lg p-4 divide-y-[1px] divide-lightGrey">
      <SidebarHeader setActiveSidebar={setActiveSidebar} />
      {sidebars.map(
        (sidebar) => sidebar.name === activeSidebar && sidebar.jsxElem
      )}
    </aside>
  );
};
