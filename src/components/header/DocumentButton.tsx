import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretDown, CaretUp, FileArrowDown, FileArrowUp, Warning } from "phosphor-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export const DocumentButton = () => {
  const [showDownloadMenu, setShowDownloadMenu] = useState<Boolean>(false);
  const [showPopupUpload, setShowPopupUpload] = useState<boolean | undefined>(false);

  const downloadBasisdokument = () => {
    toast("Basisokument wurde heruntergeladen!");
  };

  // If a new base document is to be opened and the user is taken to the home page, the page can also simply be reloaded.
  // Then the state of the components of the entire application is reset and there are no complications.
  const reload_page_and_save = () => {
    console.log("reload page and save!");
  };

  const reload_page_and_do_not_save = () => {
    console.log("reload page and do not save!");
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
            <DropdownMenu.Item
              onClick={() => {
                setShowPopupUpload(true);
              }}
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            >
              <FileArrowUp size={18} className="text-darkGrey" />
              <div className="text-darkGrey">Neues Basisdokument erstellen/hochladen</div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <div>
        <ToastContainer
          className="rounded-md font-light text-sm"
          toastStyle={{ backgroundColor: "#3A4342", color: "#fff", width: "300px" }}
          position="top-right"
          autoClose={2000000}
          closeButton={false}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
      <AlertDialog.Root open={showPopupUpload}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <div
              className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50"
              onClick={() => {
                setShowPopupUpload(false);
              }}
            ></div>
            <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-5 bg-white p-6 rounded-md w-[400px]">
              <div className="flex justify-center">
                <div className="flex items-center justify-center bg-lightRed w-32 h-32 rounded-full">
                  <Warning size={80} weight="light" className="text-darkRed" />
                </div>
              </div>
              <p className="font-bold text-center">Sind Sie sich sicher, dass Sie ein anderes Basisdokument öffnen möchten?</p>
              <p className="text-center text-sm text-mediumGrey">
                Es kann in einem Browser-Tab nur an einem Basisdokument gearbeitet werden. Klicken Sie auf “Forfahren und speichern”, um die Änderungen an dem Basisdokument, an dem Sie gerade
                arbeiten, zu speichern.
              </p>
              <div className="flex flex-col gap-2">
                <button className="bg-lightRed text-center text-darkRed font-bold p-2 rounded-md" onClick={() => {}}>
                  Fortfahren und nicht speichern
                </button>
                <button className="bg-offWhite text-center font-bold p-2 rounded-md">Fortfahren und speichern</button>
                <AlertDialog.Cancel
                  className="bg-offWhite text-center font-bold p-2 rounded-md"
                  onClick={() => {
                    setShowPopupUpload(false);
                  }}
                >
                  Abbrechen
                </AlertDialog.Cancel>
              </div>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};
