import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, FileArrowDown, FileArrowUp } from "phosphor-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DocumentButton = () => {
  const [showDownloadMenu, setShowDownloadMenu] = useState<Boolean>(false);
  const downloadBasisdokument = () => {
    toast("Basisokument wurde heruntergeladen!");
  };
  return (
    <div>
      <DropdownMenu.Root
        onOpenChange={() => {
          setShowDownloadMenu(!showDownloadMenu);
        }}
      >
        <DropdownMenu.Trigger className="flex flex-row bg-darkGrey justify-center items-center rounded-md gap-2 pl-2 pr-2 pt-2 pb-2 hover:cursor-pointer">
          <img src={`${process.env.PUBLIC_URL}/icons/document.svg`} alt="document icon"></img>
          {showDownloadMenu ? <CaretUp size={12} color={"white"} /> : <CaretDown size={12} color={"white"} />}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content side="bottom" align="start" className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2">
            <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer" onClick={downloadBasisdokument}>
              <FileArrowDown size={18} className="text-darkGrey" />
              <div className="text-darkGrey">Basisdokument herunterladen</div>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer">
              <FileArrowUp size={18} className="text-darkGrey" />
              <div className="text-darkGrey">Neues Basisdokument erstellen/hochladen</div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <div>
        <ToastContainer
          className="rounded-md font-light text-sm"
          toastStyle={{ backgroundColor: "white", color: "#000", width: "300px" }}
          position="top-center"
          autoClose={20000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};
