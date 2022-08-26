import { saveAs } from "file-saver";
import { IEntry, IHint, ILitigiousCheck, IMetaData, ISection, IVersion } from "../types";

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
  basisdokumentObject["metaData"] = metaData;
  basisdokumentObject["entries"] = entries;
  basisdokumentObject["sections"] = sectionList;
  basisdokumentObject["judgeHints"] = hints;
  basisdokumentObject["litigiousChecks"] = litigiousChecks;
  console.log(basisdokumentObject);
}

export function downloadBearbeitungsdatei() {}
