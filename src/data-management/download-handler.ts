import { saveAs } from "file-saver";
import { IBookmark, IEntry, IHighlightedEntry, IHighlighter, IHint, ILitigiousCheck, IMetaData, INote, ISection, IVersion } from "../types";

function downloadObjectAsJSON(obj: object, fileName: string) {
  // Create a blob of the data
  var fileToSave = new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });

  // Save the file
  saveAs(fileToSave, fileName);
}


export function downloadBasisdokument(
  caseId: string,
  currentVersion: number,
  versionHistory: IVersion[],
  metaData: IMetaData | null,
  entries: IEntry[],
  sectionList: ISection[],
  hints: IHint[],
  litigiousChecks: ILitigiousCheck[]
) {
  let basisdokumentObject: any = {};
  basisdokumentObject["caseId"] = caseId;
  basisdokumentObject["fileType"] = "basisdokument";
  basisdokumentObject["currentVersion"] = currentVersion;
  basisdokumentObject["versions"] = versionHistory;
  basisdokumentObject["versions"][basisdokumentObject["versions"].length - 1]["timestamp"] = new Date().toLocaleString("de-DE", {timeZone: "Europe/Berlin"});
  basisdokumentObject["metaData"] = metaData;
  basisdokumentObject["entries"] = entries;
  basisdokumentObject["sections"] = sectionList;
  basisdokumentObject["judgeHints"] = hints;
  basisdokumentObject["litigiousChecks"] = litigiousChecks;
  downloadObjectAsJSON(basisdokumentObject, "basisdokument_version_" + currentVersion + "_case_" + currentVersion);
}

export function downloadEditFile(
  caseId: string,
  currentVersion: number,
  highlightedEntries: IHighlightedEntry[],
  colorSelection: IHighlighter[],
  notes: INote[],
  bookmarks: IBookmark[],
  individualSorting: string[]
) {
  let editFileObject: any = {};
  editFileObject["caseId"] = caseId;
  editFileObject["fileType"] = "editFile";
  editFileObject["currentVersion"] = currentVersion;
  editFileObject["highlightedEntries"] = highlightedEntries;
  editFileObject["highlighter"] = colorSelection;
  editFileObject["notes"] = notes;
  editFileObject["bookmarks"] = bookmarks;
  editFileObject["individualSorting"] = individualSorting;
  downloadObjectAsJSON(editFileObject, "bearbeitungsdatei_version_" + currentVersion + "_case_" + currentVersion);
}
