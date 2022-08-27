import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileArrowDown } from "phosphor-react";
import { downloadBasisdokument, downloadEditFile } from "../../data-management/download-handler";
import { useBookmarks, useCase, useHeaderContext, useHints, useNotes, useSection } from "../../contexts";

export const DownloadBasisdokumentButton = () => {
  const { caseId, currentVersion, metaData, entries, litigiousChecks, highlightedEntries } = useCase();
  const { sectionList, individualSorting } = useSection();
  const { versionHistory, colorSelection } = useHeaderContext();
  const { hints } = useHints();
  const { notes } = useNotes();
  const { bookmarks } = useBookmarks();

  const onClickDownloadButton = () => {
    downloadBasisdokument(caseId, currentVersion, versionHistory, metaData, entries, sectionList, hints, litigiousChecks);
    downloadEditFile(caseId, currentVersion, highlightedEntries, colorSelection, notes, bookmarks, individualSorting);
  };

  return (
    <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer" onClick={onClickDownloadButton}>
      <FileArrowDown size={18} className="text-darkGrey" weight="fill" />
      <div className="text-darkGrey text-sm">Basisdokument herunterladen</div>
    </DropdownMenu.Item>
  );
};
