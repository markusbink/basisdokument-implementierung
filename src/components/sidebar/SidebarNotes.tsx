import { Plus } from "phosphor-react";
import { Button } from "../Button";

export const SidebarNotes = () => {
  return (
    <div className="flex justify-between items-center m-2.5 p-2.5">
      <div className="text-base font-bold text-darkGrey">Notizen</div>
      <Button
        key="createNote"
        bgColor="bg-darkGrey"
        size="sm"
        textColor="text-white"
        hasText={false}
        alternativePadding="p-1"
        icon={<Plus size={18} />}
      ></Button>
    </div>
  );
};
