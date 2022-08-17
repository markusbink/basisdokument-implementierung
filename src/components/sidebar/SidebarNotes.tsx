import { Plus } from "phosphor-react";
import { Button } from "../Button";

export const SidebarNotes = () => {
  return (
    <div className="p-5">
      <div className="flex justify-between items-center">
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
      <div className="mt-7 text-darkGrey opacity-40 text-center text-sm">
        Notizen, die Sie zu Beiträgen verfassen, erscheinen in dieser Ansicht.
      </div>
    </div>
  );
};
