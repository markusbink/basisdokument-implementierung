import { useState } from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNotes } from "./SidebarNotes";

const sidebars = [
  {
    name: "Notes",
  }, 
  {
    name: "Hints"
  }, 
  {
    name: "Bookmarks"
  }, 
]

export const Sidebar = () => {
  const [activeSidebar, setActiveSidebar] = useState<string>(sidebars[0].name)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <aside className="w-[400px] h-full shadow-lg p-4">
      <SidebarHeader/>
      <SidebarNotes/>
    </aside>
  );
};
