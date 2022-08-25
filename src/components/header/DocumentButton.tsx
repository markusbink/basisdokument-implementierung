import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CaretDown,
  CaretUp,
  FileArrowDown,
  FileArrowUp,
  UserCircle,
  Warning,
} from "phosphor-react";
import "react-toastify/dist/ReactToastify.css";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ToastContainer } from "react-toastify";
import { useHeaderContext } from "../../contexts";
import { useUser } from "../../contexts/UserContext";

export const DocumentButton = () => {
  const { downloadBasisdokument, reloadPageAndDoNotSave, reloadPageAndSave } =
    useHeaderContext();
  const { user } = useUser();
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [showPopupUpload, setShowPopupUpload] = useState<boolean | undefined>(
    false
  );

  return (
    <div>
      <DropdownMenu.Root
        modal={false}
        onOpenChange={() => {
          setShowDownloadMenu(!showDownloadMenu);
        }}
      >
        <DropdownMenu.Trigger className="flex flex-row bg-darkGrey hover:bg-mediumGrey justify-center items-center rounded-md gap-2 pl-2 pr-2 h-8 hover:cursor-pointer">
          <img
            src={`${process.env.PUBLIC_URL}/icons/document.svg`}
            alt="document icon"
            className="h-4"
          ></img>
          {showDownloadMenu ? (
            <CaretUp size={12} color={"white"} weight="bold" />
          ) : (
            <CaretDown size={12} color={"white"} weight="bold" />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="start"
            className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 gap-4"
          >
            <div className="flex flex-col align-middle justify-center items-center gap-2 bg-offWhite rounded-md p-3 pl-2 pr-2 h-full">
              <UserCircle size={24} className="text-darkGrey" weight="fill" />
              <div className="text-center">
                <p className="font-extrabold text-base text-darkGrey">
                  {user!.name}
                </p>
                <p className="text-sm text-darkGrey">{user!.role}</p>
              </div>
            </div>
            <DropdownMenu.Item
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
              onClick={downloadBasisdokument}
            >
              <FileArrowDown
                size={18}
                className="text-darkGrey"
                weight="fill"
              />
              <div className="text-darkGrey text-sm">
                Basisdokument herunterladen
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setShowPopupUpload(true);
              }}
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
            >
              <FileArrowUp size={18} className="text-darkGrey" weight="fill" />
              <div className="text-darkGrey text-sm">
                Neues Basisdokument erstellen/hochladen
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <div>
        <ToastContainer
          className="font-semibold text-sm"
          toastStyle={{
            backgroundColor: "#3A4342",
            color: "#fff",
            width: "300px",
            borderRadius: "8px",
          }}
          position="top-right"
          autoClose={2000}
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
              <p className="font-bold text-center">
                Sind Sie sich sicher, dass Sie ein anderes Basisdokument öffnen
                möchten?
              </p>
              <p className="text-center text-sm text-mediumGrey">
                Es kann in einem Browser-Tab nur an einem Basisdokument
                gearbeitet werden. Klicken Sie auf “Forfahren und speichern”, um
                die Änderungen an dem Basisdokument, an dem Sie gerade arbeiten,
                zu speichern.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  className="bg-lightRed hover:bg-mediumRed text-center text-darkRed font-bold p-2 rounded-md"
                  onClick={reloadPageAndDoNotSave}
                >
                  Fortfahren und nicht speichern
                </button>
                <button
                  className="bg-offWhite hover:bg-lightGrey text-center font-bold p-2 rounded-md"
                  onClick={reloadPageAndSave}
                >
                  Fortfahren und speichern
                </button>
                <AlertDialog.Cancel
                  className="bg-offWhite hover:bg-lightGrey text-center font-bold p-2 rounded-md"
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
