import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CaretDown,
  CaretUp,
  FileArrowUp,
  UserCircle,
  Warning,
} from "phosphor-react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useUser } from "../../contexts/UserContext";
import { DownloadBasisdokumentButton } from "./DownloadBasisdokumentButton";
import {
  useBookmarks,
  useCase,
  useHeaderContext,
  useHints,
  useNotes,
  useSection,
} from "../../contexts";
import {
  downloadBasisdokument,
  downloadEditFile,
} from "../../data-management/download-handler";
import { Tooltip } from "../Tooltip";
import { themeData } from "../../themes/theme-data";
import Cookies from "js-cookie";
import cx from "classnames";
import { UserRole } from "../../types";
import { useEvidence } from "../../contexts/EvidenceContext";

export const DocumentButton = () => {
  const { user } = useUser();
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [showPopupUpload, setShowPopupUpload] = useState<boolean | undefined>(
    false
  );

  const {
    fileId,
    caseId,
    currentVersion,
    metaData,
    entries,
    individualEntrySorting,
    highlightedEntries,
  } = useCase();
  const { sectionList, individualSorting } = useSection();
  const { evidenceList, evidenceIdsPlaintiff, evidenceIdsDefendant } =
    useEvidence();
  const { versionHistory, colorSelection, selectedTheme, setSelectedTheme } =
    useHeaderContext();
  const { hints } = useHints();
  const { notes } = useNotes();
  const { bookmarks } = useBookmarks();

  const reloadPageAndDoNotSave = () => {
    window.location.reload();
  };
  // If a new base document is to be opened and the user is taken to the home page, the page can also simply be reloaded.
  // Then the state of the components of the entire application is reset and there are no complications.
  const reloadPageAndSave = () => {
    setTimeout(() => {
      downloadBasisdokument(
        fileId,
        caseId,
        currentVersion,
        versionHistory,
        metaData,
        entries,
        sectionList,
        evidenceList,
        evidenceIdsPlaintiff,
        evidenceIdsDefendant,
        hints,
        undefined, //coverPDF
        undefined, //otherAuthor
        false, //download new entries additionally
        false, //download evidences in additional list
        undefined, //regard
        false //download attachments by default
      );
    }, 100);
    setTimeout(() => {
      downloadEditFile(
        fileId,
        caseId,
        currentVersion,
        highlightedEntries,
        colorSelection,
        notes,
        bookmarks,
        individualSorting,
        individualEntrySorting
      );
    }, 200);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div>
      <DropdownMenu.Root
        modal={false}
        onOpenChange={() => {
          setShowDownloadMenu(!showDownloadMenu);
        }}>
        <DropdownMenu.Trigger className="flex flex-row bg-darkGrey hover:bg-mediumGrey justify-center items-center rounded-md gap-2 pl-2 pr-2 h-8 hover:cursor-pointer">
          <img
            src={`${process.env.PUBLIC_URL}/icons/document.svg`}
            alt="document icon"
            className="h-5"></img>
          {showDownloadMenu ? (
            <CaretUp size={12} className="text-white" weight="bold" />
          ) : (
            <CaretDown size={12} className="text-white" weight="bold" />
          )}
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="bottom"
            align="start"
            className="flex flex-col bg-white shadow-md mt-4 rounded-lg p-2 gap-4 z-40">
            <div className="flex flex-col align-middle justify-center items-center gap-2 bg-offWhite rounded-md p-3 pl-2 pr-2 h-full">
              <UserCircle size={24} className="text-darkGrey" weight="fill" />
              <div className="text-center">
                {user?.role !== UserRole.Client && (
                  <p className="font-extrabold text-base text-darkGrey">
                    {user!.name}
                  </p>
                )}
                <p className="text-sm text-darkGrey">{user!.role}</p>
              </div>
            </div>
            <div className="flex flex-col align-middle justify-center items-center gap-2 bg-offWhite rounded-md p-3 pl-2 pr-2 h-full">
              <p className="font-bold text-sm">Erscheinungsbild</p>
              <div className="flex flex-row gap-2">
                {themeData.map((theme, index) => {
                  return (
                    <Tooltip text={theme.title} key={index}>
                      <div
                        className={cx(
                          `flex flex-row rounded-full hover:border-darkGrey hover:border-[2px] w-14 h-14 items-center justify-center cursor-pointer`,
                          {
                            "border-[3px] border-darkGrey":
                              theme.id === selectedTheme,
                          }
                        )}
                        onClick={() => {
                          Cookies.set("theme", theme.id);
                          setSelectedTheme(theme.id);
                        }}>
                        <div
                          className={cx(
                            `h-12 w-6 bg-${theme.primaryPlaintiff} rounded-l-full`
                          )}></div>
                        <div
                          className={cx(
                            `h-12 w-6 bg-${theme.primaryDefendant} rounded-r-full`
                          )}></div>
                      </div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            {user?.role !== UserRole.Client && <DownloadBasisdokumentButton />}
            <DropdownMenu.Item
              onClick={() => {
                if (user?.role === UserRole.Client) {
                  reloadPageAndDoNotSave();
                } else {
                  setShowPopupUpload(true);
                }
              }}
              className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer">
              <FileArrowUp size={18} className="text-darkGrey" weight="fill" />
              <div className="text-darkGrey text-sm">
                Neues Basisdokument{" "}
                {user?.role !== UserRole.Client ? "erstellen/" : ""}hochladen
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <AlertDialog.Root open={showPopupUpload}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay />
          <AlertDialog.Content>
            <div
              className="fixed top-0 left-0 h-screen w-screen bg-black opacity-50 z-[90]"
              onClick={() => {
                setShowPopupUpload(false);
              }}></div>
            <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col gap-5 bg-white p-6 rounded-md w-[400px] z-[100]">
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
                  onClick={reloadPageAndDoNotSave}>
                  Fortfahren und nicht speichern
                </button>
                <button
                  className="bg-offWhite hover:bg-lightGrey text-center font-bold p-2 rounded-md"
                  onClick={reloadPageAndSave}>
                  Fortfahren und speichern
                </button>
                <AlertDialog.Cancel
                  className="bg-offWhite hover:bg-lightGrey text-center font-bold p-2 rounded-md"
                  onClick={() => {
                    setShowPopupUpload(false);
                  }}>
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
