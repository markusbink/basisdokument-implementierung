import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileArrowDown } from "phosphor-react";
import { useExport } from "../../contexts";

export const DownloadBasisdokumentButton = () => {

  const { isExportPopupOpen, setIsExportPopupOpen } = useExport();

  const onClickDownloadButton = () => {
    setIsExportPopupOpen((currentState) => !currentState);
  };

  return (
    <DropdownMenu.Item
      className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
      onClick={onClickDownloadButton}>
      <FileArrowDown size={18} className="text-darkGrey" weight="fill" />
      <div className="text-darkGrey text-sm">Basisdokument herunterladen</div>
    </DropdownMenu.Item>
  );
};
