import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileArrowDown } from "phosphor-react";
import { useUser } from "../../contexts/UserContext";
import { downloadBasisdokument, downloadBearbeitungsdatei } from "../../data-management/download-handler";
import { useCase, useHeaderContext, useHints, useSection } from "../../contexts";

export const DownloadBasisdokumentButton = () => {
  const { caseId, currentVersion, metaData, entries, litigiousChecks } = useCase();
  const { sectionList } = useSection();
  const { versionHistory } = useHeaderContext();
  const { hints } = useHints();
  const onClickDownloadButton = () => {
    downloadBasisdokument(caseId, currentVersion, versionHistory, metaData, entries, sectionList, hints, litigiousChecks);
    downloadBearbeitungsdatei();
  };

  return (
    <DropdownMenu.Item className="flex flex-row items-center p-2 gap-2 hover:bg-offWhite rounded-md cursor-pointer" onClick={onClickDownloadButton}>
      <FileArrowDown size={18} className="text-darkGrey" weight="fill" />
      <div className="text-darkGrey text-sm">Basisdokument herunterladen</div>
    </DropdownMenu.Item>
  );
};
