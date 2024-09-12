import { X } from "phosphor-react";
import cx from "classnames";
import { IEntry, UserRole } from "../types";
import { Entry } from "./entry";
import { useUser } from "../contexts";
import { useRef } from "react";
import { useOutsideClick } from "../hooks/use-outside-click";

type AssociationsPopupProps = {
  setIsAssociationsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entry: IEntry;
  associatedEntry: IEntry;
};

export const AssociationsPopup: React.FC<AssociationsPopupProps> = ({
  setIsAssociationsPopupOpen,
  entry,
  associatedEntry,
}) => {
  const { user } = useUser();
  const popupRef = useRef(null);
  useOutsideClick(popupRef, () => setIsAssociationsPopupOpen(false));

  return (
    <>
      <div
        className={cx(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        )}>
        <div className="my-6 mx-auto w-[80vw]">
          {/*content*/}
          <div
            ref={popupRef}
            className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg ">
              <h3 className="text-xl font-bold text-darkGrey">{`Beitrag ${entry.entryCode} bezieht sich auf Beitrag ${associatedEntry.entryCode}`}</h3>
              <div>
                <button
                  onClick={() => {
                    setIsAssociationsPopupOpen(false);
                  }}
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 w-full">
              <Entry
                shownInPopup={true}
                entry={associatedEntry}
                viewedBy={
                  user?.role === UserRole.Plaintiff
                    ? UserRole.Defendant
                    : UserRole.Plaintiff
                }></Entry>
              <Entry
                shownInPopup={true}
                entry={entry}
                viewedBy={
                  user?.role === UserRole.Plaintiff
                    ? UserRole.Defendant
                    : UserRole.Plaintiff
                }></Entry>
            </div>
            {/*body*/}
            <div className="space-y-4"></div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
