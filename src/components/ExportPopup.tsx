import { X } from "phosphor-react";
import cx from "classnames";
import { useExport, useCase } from "../contexts";
import { FileArrowDown } from "phosphor-react";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  IBookmark,
  IEntry,
  IHighlightedEntry,
  IHighlighter,
  IHint,
  IMetaData,
  INote,
  ISection,
  IVersion,
} from "../types";
import {
  downloadBasisdokument,
  downloadEditFile,
} from "../data-management/download-handler";

interface IProps {
  caseId: string;
  currentVersion: number;
  versionHistory: IVersion[];
  metaData: IMetaData | null;
  entries: IEntry[];
  sectionList: ISection[];
  hints: IHint[];
  highlightedEntries: IHighlightedEntry[];
  colorSelection: IHighlighter[];
  notes: INote[];
  bookmarks: IBookmark[];
  individualSorting: string[];
}

export const ExportPopup: React.FC<IProps> = ({
  caseId,
  currentVersion,
  versionHistory,
  metaData,
  entries,
  sectionList,
  hints,
  highlightedEntries,
  colorSelection,
  notes,
  bookmarks,
  individualSorting,
}) => {
  const { setIsExportPopupOpen } = useExport();
  const { individualEntrySorting } = useCase();

  const onClickDownloadButton = () => {
    setTimeout(() => {
      downloadBasisdokument(
        caseId,
        currentVersion,
        versionHistory,
        metaData,
        entries,
        sectionList,
        hints
      );
    }, 100);
    setTimeout(() => {
      downloadEditFile(
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
    toast("Basisdokument wurde heruntergeladen!");
  };

  return (
    <>
      <div
        className={cx(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        )}>
        <div className="w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="p-6 space-y-4 border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-lg ">
              <h3 className="text-xl font-bold text-darkGrey">
                Basisdokument herunterladen
              </h3>
              <div>
                <button
                  onClick={(currentState) =>
                    setIsExportPopupOpen(!currentState)
                  }
                  className="text-darkGrey bg-offWhite p-1 rounded-md hover:bg-lightGrey">
                  <X size={24} />
                </button>
              </div>
            </div>
            {/*body*/}
            <div className="space-y-4">
              <div
                className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer"
                onClick={onClickDownloadButton}>
                <FileArrowDown
                  size={18}
                  className="text-darkGrey"
                  weight="fill"
                />
                <div className="text-darkGrey text-sm">
                  Basisdokument herunterladen
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
