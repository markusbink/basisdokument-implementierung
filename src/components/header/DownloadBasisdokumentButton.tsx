import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileArrowDown } from "phosphor-react";
import { toast } from "react-toastify";
import { downloadBasisdokument, downloadEditFile } from "../../data-management/download-handler";
import { IBookmark, IEntry, IHighlightedEntry, IHighlighter, IHint, ILitigiousCheck, IMetaData, INote, ISection, IVersion } from "../../types";

interface IProps {
  caseId: string;
  currentVersion: number;
  versionHistory: IVersion[];
  metaData: IMetaData | null;
  entries: IEntry[];
  sectionList: ISection[];
  hints: IHint[];
  litigiousChecks: ILitigiousCheck[];
  highlightedEntries: IHighlightedEntry[];
  colorSelection: IHighlighter[];
  notes: INote[];
  bookmarks: IBookmark[];
  individualSorting: string[];
}

export const DownloadBasisdokumentButton: React.FC<IProps> = ({
  caseId,
  currentVersion,
  versionHistory,
  metaData,
  entries,
  sectionList,
  hints,
  litigiousChecks,
  highlightedEntries,
  colorSelection,
  notes,
  bookmarks,
  individualSorting,
}) => {
  const onClickDownloadButton = () => {
    setTimeout(() => {
      downloadBasisdokument(caseId, currentVersion, versionHistory, metaData, entries, sectionList, hints, litigiousChecks);
    }, 100);
    setTimeout(() => {
      downloadEditFile(caseId, currentVersion, highlightedEntries, colorSelection, notes, bookmarks, individualSorting);
    }, 200);
    toast("Basisdokument wurde heruntergeladen!")
  };

  return (
    <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer" onClick={onClickDownloadButton}>
      <FileArrowDown size={18} className="text-darkGrey" weight="fill" />
      <div className="text-darkGrey text-sm">Basisdokument herunterladen</div>
    </DropdownMenu.Item>
  );
};
